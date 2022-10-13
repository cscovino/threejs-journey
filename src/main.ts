import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
  AmbientLight,
  DirectionalLight,
  PCFSoftShadowMap,
  AnimationMixer,
  Clock,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';
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

// Scene
const scene = new Scene();

// Models
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

let mixer: AnimationMixer | null = null;
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
  // const children = [...gltf.scene.children];
  // children.forEach((child) => {
  //   scene.add(child);
  // });

  mixer = new AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[1]);
  action.play();

  gltf.scene.scale.set(0.025, 0.025, 0.025);
  scene.add(gltf.scene);
});

// FLoor
const floor = new Mesh(
  new PlaneGeometry(10, 10),
  new MeshStandardMaterial({ color: '#444444', metalness: 0, roughness: 0.5 }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Lights
const ambientLight = new AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Camera
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

// Renderer
const renderer = new WebGLRenderer({
  canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setSize(SIZES.width, SIZES.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Clock
const clock = new Clock();
let previousTime = 0;

// Animations
const tick = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update mixer
  if (mixer !== null) mixer.update(deltaTime);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
