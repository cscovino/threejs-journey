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
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { IParameters } from './types';
import './style.css';

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
console.log(canvas);

// Scene
const scene = new Scene();

// Textures
// const loadingManager = new LoadingManager();
// const textureLoader = new TextureLoader(loadingManager);

// Galaxy
const parameters: IParameters = {
  count: 1000,
  size: 0.02,
};

gui.add(parameters, 'count').min(100).max(1000000).step(100);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001);

const generateGalaxy = ({ count, size }: IParameters) => {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = Math.random();
    positions[i3 + 1] = Math.random();
    positions[i3 + 2] = Math.random();
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  const material = new PointsMaterial({
    size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const points = new Points(geometry, material);
  scene.add(points);
};

generateGalaxy(parameters);

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
