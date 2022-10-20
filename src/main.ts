import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  BufferGeometry,
  BufferAttribute,
  AdditiveBlending,
  Points,
  Color,
  Clock,
  ShaderMaterial,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import galaxyVertexShader from './shaders/galaxy/vertex.glsl';
import galaxyFragmentShader from './shaders/galaxy/fragment.glsl';
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

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

// Galaxy
const parameters: IParameters = {
  count: 200000,
  radius: 5,
  branches: 3,
  randomness: 0.5,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
};

let geometry: BufferGeometry | null = null;
let material: ShaderMaterial | null = null;
let points: Points | null = null;

const generateGalaxy = ({
  count,
  radius,
  branches,
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
  const scales = new Float32Array(count * 1);
  const randomnessPosition = new Float32Array(count * 3);

  const colorInside = new Color(insideColor);
  const colorOutside = new Color(outsideColor);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Position
    const radiusGalaxy = Math.random() * radius;
    const branchAngle = ((i % branches) / branches) * Math.PI * 2;

    positions[i3] = Math.cos(branchAngle) * radiusGalaxy;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngle) * radiusGalaxy;

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

    randomnessPosition[i3] = randomX;
    randomnessPosition[i3 + 1] = randomY;
    randomnessPosition[i3 + 2] = randomZ;

    // Color
    const mixedColor = colorInside.clone().lerp(colorOutside, radiusGalaxy / radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    // Scale
    scales[i] = Math.random();
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  geometry.setAttribute('aScale', new BufferAttribute(scales, 1));
  geometry.setAttribute('aRandomness', new BufferAttribute(randomnessPosition, 3));

  material = new ShaderMaterial({
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
    vertexShader: galaxyVertexShader,
    fragmentShader: galaxyFragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uSize: { value: 30.0 * renderer.getPixelRatio() },
    },
  });

  points = new Points(geometry, material);
  scene.add(points);
};

gui
  .add(parameters, 'count')
  .min(100)
  .max(1000000)
  .step(100)
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
gui.addColor(parameters, 'insideColor').onFinishChange(() => generateGalaxy(parameters));
gui.addColor(parameters, 'outsideColor').onFinishChange(() => generateGalaxy(parameters));

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

generateGalaxy(parameters);

// Clock
const clock = new Clock();

// Animations
const tick = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();

  // Update material
  if (material) material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
