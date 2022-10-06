import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  // TextureLoader,
  // LoadingManager,
  // Clock,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  AdditiveBlending,
  Points,
  Color,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { IParameters } from './types';
import './style.css';
import { random16 } from 'three/src/math/MathUtils';

// Sizes
const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const aspectRatio = SIZES.width / SIZES.height;

window.addEventListener('resize', () => {
  // Update SIZES
  SIZES.width = window.innerWidth;
  SIZES.height = window.innerHeight;

  // Update camera
  camera.aspect = SIZES.width / SIZES.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(SIZES.width, SIZES.height);
});

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Cursor
const cursor = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / SIZES.width - 0.5;
  cursor.y = -(event.clientY / SIZES.height - 0.5);
});

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

// Textures
// const loadingManager = new LoadingManager();
// const textureLoader = new TextureLoader(loadingManager);

// Galaxy
const parameters: IParameters = {
  count: 10000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
};

let geometry: BufferGeometry | null = null;
let material: PointsMaterial | null = null;
let points: Points | null = null;

const generateGalaxy = ({
  count,
  size,
  radius,
  branches,
  spin,
  randomness,
  randomnessPower,
  insideColor,
  outsideColor,
}: IParameters) => {
  if (points !== null) {
    geometry?.dispose();
    material?.dispose();
    scene.remove(points);
  }

  geometry = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const colorInside = new Color(insideColor);
  const colorOutside = new Color(outsideColor);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radiusGalaxy = Math.random() * radius;
    const spinAngle = radiusGalaxy * spin;
    const branchAngle = ((i % branches) / branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      radiusGalaxy;
    const randomY =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      radiusGalaxy;
    const randomZ =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      radiusGalaxy;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radiusGalaxy + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] =
      Math.sin(branchAngle + spinAngle) * radiusGalaxy + randomZ;

    const mixedColor = colorInside
      .clone()
      .lerp(colorOutside, radiusGalaxy / radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  material = new PointsMaterial({
    size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
  });

  points = new Points(geometry, material);
  scene.add(points);
};

generateGalaxy(parameters);

gui
  .add(parameters, 'count')
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(() => generateGalaxy(parameters));
gui
  .add(parameters, 'size')
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(() => generateGalaxy(parameters));
gui
  .add(parameters, 'radius')
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(() => generateGalaxy(parameters));
gui
  .add(parameters, 'branches')
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(() => generateGalaxy(parameters));
gui
  .add(parameters, 'spin')
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(() => generateGalaxy(parameters));
gui
  .add(parameters, 'randomness')
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(() => generateGalaxy(parameters));
gui
  .add(parameters, 'randomnessPower')
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(() => generateGalaxy(parameters));
gui
  .addColor(parameters, 'insideColor')
  .onFinishChange(() => generateGalaxy(parameters));
gui
  .addColor(parameters, 'outsideColor')
  .onFinishChange(() => generateGalaxy(parameters));

// Camera
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new WebGLRenderer({
  canvas,
});
renderer.setSize(SIZES.width, SIZES.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Clock
// const clock = new Clock();

// Animations
const tick = () => {
  // Clock
  // const elapsedTime = clock.getElapsedTime();

  // Update particles

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
