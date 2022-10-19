import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  TextureLoader,
  PlaneGeometry,
  Mesh,
  RawShaderMaterial,
  // BufferAttribute,
  Vector2,
  Clock,
  Color,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import testVertexShader from './shaders/test/vertex.glsl';
import testFragmentShader from './shaders/test/fragment.glsl';
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

// Textures
const textureLoader = new TextureLoader();
const flagTexture = textureLoader.load('/textures/flag-french.jpg');

// Mesh
const geometry = new PlaneGeometry(1, 1, 32, 32);

// const count = geometry.attributes.position.count;
// const randoms = new Float32Array(count);

// for (let i = 0; i < count; i++) {
//   randoms[i] = Math.random();
// }

// geometry.setAttribute('aRandom', new BufferAttribute(randoms, 1));

const material = new RawShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  uniforms: {
    uFrequency: { value: new Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new Color('orange') },
    uTexture: { value: flagTexture },
  },
});

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX');
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY');

const mesh = new Mesh(geometry, material);
mesh.scale.y = 2 / 3;
scene.add(mesh);

// Camera
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(0.25, -0.25, 1);
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
const clock = new Clock();

// Animations
const tick = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();

  // Update material
  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
