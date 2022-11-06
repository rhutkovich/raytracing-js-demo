import Color from './color.js';

class Sphere {
  center;
  radius;
  surfaceColor;
  emissionColor;
  transparency;
  reflection;

  constructor(center, radius, surfaceColor, reflection, transparency, emissionColor) {
    this.center = center;
    this.radius = radius;
    this.surfaceColor = surfaceColor;
    this.transparency = transparency;
    this.reflection = reflection;
    this.emissionColor = emissionColor || Color.rgb(0, 0, 0);
  }

  squaredRadius() {
    return this.radius * this.radius;
  }

  isIntersect(rayOrigin, rayDirection, t0, t1) {
    const l = this.center.sub(rayOrigin);

    const tca = l.dot(rayDirection);
    if (tca < 0) {
      return false;
    }

    const d2 = l.dot(l) - tca * tca;
    if (d2 > this.squaredRadius()) {
      return false;
    }

    const thc = Math.sqrt(this.squaredRadius() - d2);
    t0.value = tca - thc;
    t1.value = tca + thc;

    return true;
  }

}

export default Sphere;