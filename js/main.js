import Vector3d from './vector3d.js';
import Sphere from './sphere.js';
import Color from './color.js';
import {trace} from './algorithms.js';

const HEIGHT = 640;
const WIDTH = 640;
const canvas = document.getElementById('myCanvas');

const spheres = [
  new Sphere(new Vector3d(0.0, -10004, -20), 10000, Color.rgb(0.20, 0.20, 0.20), 0, 0),
  new Sphere(new Vector3d(0.0, 0, -20), 4, Color.rgb(1.00, 0.32, 0.36), 1, 0.5),
  new Sphere(new Vector3d(5.0, -1, -15), 2, Color.rgb(0.90, 0.76, 0.46), 1, 0),
  new Sphere(new Vector3d(5.0, 0, -25), 3, Color.rgb(0.65, 0.77, 0.97), 1, 0),
  new Sphere(new Vector3d(-5.5, 0, -15), 3, Color.rgb(0.90, 0.90, 0.90), 1, 0),

  // light
  new Sphere(new Vector3d(0.0, 20, -30), 3, Color.rgb(0.00, 0.00, 0.00), 0, 0.0, Color.rgb(3, 3, 3))
];

let angle = 0;
setInterval(() => {
  const context = canvas.getContext('2d');
  const buffer = context.createImageData(HEIGHT, WIDTH);
  render(buffer, spheres, new Vector3d(2*Math.sin(angle), 0, -2+2*Math.cos(angle)));
  context.putImageData(buffer, 0, 0);
  angle++;
}, 50);

function setPixel(buffer, x, y, color) {
  const index = 4 * (x + y * WIDTH);
  buffer.data[index] = Math.min(1, color.r) * 255;
  buffer.data[index + 1] = Math.min(1, color.g) * 255;
  buffer.data[index + 2] = Math.min(1, color.b) * 255;
  buffer.data[index + 3] = Math.min(1, color.a) * 255;
}

function render(frameBuffer, spheres, start) {
  const invWidth = 1.0 / WIDTH;
  const invHeight = 1.0 / HEIGHT;
  const fov = 90;
  const aspectRatio = 1.0 * WIDTH / HEIGHT;
  const angle = Math.tan(Math.PI * 0.5 * fov / 180.0);
  // Trace rays
  for (let y = 0; y < HEIGHT; ++y) {
    for (let x = 0; x < WIDTH; ++x) {
      const xx = (2 * ((x + 0.5) * invWidth) - 1) * angle * aspectRatio;
      const yy = (1 - 2 * ((y + 0.5) * invHeight)) * angle;
      const rayDirection = new Vector3d(xx, yy, -1);
      rayDirection.normalize();
      const pixColor = trace(start, rayDirection, spheres, 0);

      setPixel(frameBuffer, x, y, pixColor);
    }
  }
}


