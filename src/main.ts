import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Clock,
  TextureLoader,
  MeshBasicMaterial,
  sRGBEncoding,
  BufferGeometry,
  BufferAttribute,
  Points,
  ShaderMaterial,
  AdditiveBlending,
  Color,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';
import firefliesVertexShader from './shaders/fireflies/vertex.glsl';
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update fireflies
  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
});

// Debug
const debugObject: any = {};
const gui = new dat.GUI({
  width: 400,
});

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

// Loaders
// Texture loader
const textureLoader = new TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Textures
const bakedTexture = textureLoader.load('/baked.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = sRGBEncoding;

// Materials
const bakedMaterial = new MeshBasicMaterial({ map: bakedTexture });
const poleLightMaterial = new MeshBasicMaterial({ color: 0xffb14d });

debugObject.portalColorStart = '#ff9419';
debugObject.portalColorEnd = '#201919';
gui.addColor(debugObject, 'portalColorStart').onChange(() => {
  portalLightMaterial.uniforms.uColorStart.value.set(debugObject.portalColorStart);
});
gui.addColor(debugObject, 'portalColorEnd').onChange(() => {
  portalLightMaterial.uniforms.uColorEnd.value.set(debugObject.portalColorEnd);
});

const portalLightMaterial = new ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorStart: { value: new Color(debugObject.portalColorStart) },
    uColorEnd: { value: new Color(debugObject.portalColorEnd) },
  },
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
});

// Models
gltfLoader.load('/portal.glb', (gltf) => {
  const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked');
  const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'poleLightA');
  const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB');
  const portalLightMesh = gltf.scene.children.find((child) => child.name === 'portalLight');

  (bakedMesh as any).material = bakedMaterial;
  (poleLightAMesh as any).material = poleLightMaterial;
  (poleLightBMesh as any).material = poleLightMaterial;
  (portalLightMesh as any).material = portalLightMaterial;

  scene.add(gltf.scene);
});

// Fireflies
const firefliesGeometry = new BufferGeometry();
const firefliesCount = 80;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = Math.random() * 2.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

  scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute('position', new BufferAttribute(positionArray, 3));
firefliesGeometry.setAttribute('aScale', new BufferAttribute(scaleArray, 1));

const firefliesMaterial = new ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 100 },
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: AdditiveBlending,
  depthWrite: false,
});
gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize');

const fireflies = new Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

// Camera
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.outputEncoding = sRGBEncoding;
renderer.setSize(SIZES.width, SIZES.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

debugObject.clearColor = '#201919';
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, 'clearColor').onChange((newColor) => {
  renderer.setClearColor(newColor);
});

// Clock
const clock = new Clock();

// Animations
const tick = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();

  // Update materials
  firefliesMaterial.uniforms.uTime.value = elapsedTime;
  portalLightMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
