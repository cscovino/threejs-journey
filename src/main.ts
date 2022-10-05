import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  TextureLoader,
  LoadingManager,
  Clock,
  PointsMaterial,
  Points,
  BufferGeometry,
  BufferAttribute,
  AdditiveBlending,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// import * as dat from 'dat.gui';
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
const cursor = {x: 0, y: 0};
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / SIZES.width - 0.5;
  cursor.y = -(event.clientY / SIZES.height - 0.5);
});

// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

// Textures
const loadingManager = new LoadingManager();
const textureLoader = new TextureLoader(loadingManager);

const particlesTexture = textureLoader.load('/textures/particles/2.png');

// Particles
const particlesGeometry = new BufferGeometry();
const count = 20000;
const colorChannels = 3;
const coords = 3;
const points = count * coords;
const colorsCount = count * colorChannels;

const positions = new Float32Array(points);
const colors = new Float32Array(colorsCount);

for (let i = 0; i < points; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  'position',
  new BufferAttribute(positions, coords),
);
particlesGeometry.setAttribute(
  'color',
  new BufferAttribute(colors, colorChannels),
);

const particlesMaterial = new PointsMaterial({
  color: 0xff88cc,
  transparent: true,
  alphaMap: particlesTexture,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  blending: AdditiveBlending,
  vertexColors: true,
  size: 0.1,
  sizeAttenuation: true,
});

const particles = new Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Camera
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
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
const clock = new Clock();

// Animations
const tick = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();

  // Update particles
  // particles.rotation.y = elapsedTime * 0.2;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x,
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
