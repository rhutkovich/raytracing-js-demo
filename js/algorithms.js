//https://www.scratchapixel.com/code.php?id=3&origin=/lessons/3d-basic-rendering/introduction-to-ray-tracing
import Color from './color.js';
import FloatValue from './float-value.js';

const INFINITY = 1e8;
const MAX_RAY_DEPTH = 5;

function mix(a, b, mix) {
  return b * mix + a * (1 - mix);
}

export function trace(rayOrigin, rayDirection, spheres, depth) {
  let tNear = INFINITY;
  let intersectionedSphere = null;

  // find intersection of this ray with the sphere in the scene

  for (const sphere of spheres) {
    let t0 = new FloatValue(INFINITY);
    let t1 = new FloatValue(INFINITY);

    if (sphere.isIntersect(rayOrigin, rayDirection, t0, t1)) {
      if (t0.value < 0) {
        t0.value = t1.value;
      }
      if (t0.value < tNear) {
        tNear = t0.value;
        intersectionedSphere = sphere;
      }
    }
  }

  // if there's no intersection return black or background color
  if (!intersectionedSphere) {
    return Color.rgb(2, 2, 2);
  }

  let surfaceColor = intersectionedSphere.surfaceColor;//Color.rgb(0,0,0) //color of the ray/surface of the object intersected by the ray
  let pHit = rayOrigin.add(rayDirection.scale(tNear)); //point of intersection
  let nHit = pHit.sub(intersectionedSphere.center); //normal at the intersection point
  nHit.normalize();  //normalize normal direction

  // If the normal and the view direction are not opposite to each other
  // reverse the normal direction. That also means we are inside the sphere so set
  // the inside bool to true. Finally, reverse the sign of IdotN which we want
  // positive.

  const bias = 1e-4;  //add some bias to the point from which we will be tracing
  let inside = false;

  if (rayDirection.dot(nHit) > 0) {
    nHit = nHit.inverse();
    inside = true;
  }

  if ((intersectionedSphere.transparency > 0 || intersectionedSphere.reflection > 0) && depth < MAX_RAY_DEPTH) {
    let facingRatio = -rayDirection.dot(nHit);
    // change the mix value to tweak the effect
    let fresnelEffect = mix(Math.pow(1 - facingRatio, 3), 1, 0.1);
    // compute reflection direction (not need to normalize because all vectors are already normalized)
    let reflectDirection = rayDirection.sub(nHit.scale(2 * rayDirection.dot(nHit)));
    reflectDirection.normalize();
    let reflection = trace(pHit.add(nHit.scale(bias)), reflectDirection, spheres, depth + 1);
    let refraction = intersectionedSphere.surfaceColor;//Color.rgb(1, 1, 1);
    // if the sphere is also transparent compute refraction ray (transmission)
    if (intersectionedSphere.transparency) {
      let ior = 1.1;
      let eta = (inside) ? ior : 1 / ior; //are we inside or outside the surface?
      let cosi = -nHit.dot(rayDirection);
      let k = 1 - eta * eta * (1 - cosi * cosi);
      let refractionDirection = rayDirection.scale(eta).add(nHit.scale(eta * cosi - Math.sqrt(k)));
      refractionDirection.normalize();
      refraction = trace(pHit.sub(nHit.scale(bias)), refractionDirection, spheres, depth + 1);
    }
    // the result is a mix of reflection and refraction (if the sphere is transparent)
    surfaceColor = intersectionedSphere.surfaceColor.multiply(reflection.intense(fresnelEffect).add(refraction.intense((1 - fresnelEffect) * intersectionedSphere.transparency)));
  } else {
    // it's a diffuse object, no need to raytrace any further
    for (let i = 0; i < spheres.length; ++i) {
      if (spheres[i].emissionColor.isNonBlack()) {
        // this is a light
        let transmission = Color.rgb(1, 1, 1);
        let lightDirection = spheres[i].center.sub(pHit);
        lightDirection.normalize();
        for (let j = 0; j < spheres.length; ++j) {
          if (i !== j) {
            let t0 = new FloatValue(0);
            let t1 = new FloatValue(0);
            if (spheres[j].isIntersect(pHit.add(nHit.scale(bias)), lightDirection, t0, t1)) {
              transmission = Color.rgb(0, 0, 0);
              break;
            }
          }
        }
        let colorFactor = Math.max(0, nHit.dot(lightDirection));
        surfaceColor = surfaceColor.add(intersectionedSphere.surfaceColor.multiply(transmission).intense(colorFactor).multiply(spheres[i].emissionColor));
      }
    }
  }

  return surfaceColor.add(intersectionedSphere.emissionColor);
}

