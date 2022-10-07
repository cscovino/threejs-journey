import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  Raycaster,
  Clock,
  Vector2,
  Intersection,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
const cursor = new Vector2();
window.addEventListener('mousemove', (event) => {
  cursor.x = (event.clientX / SIZES.width) * 2 - 1;
  cursor.y = -(event.clientY / SIZES.height) * 2 + 1;
});

window.addEventListener('click', () => {
  if (currentIntersect) {
    if (currentIntersect.object === obj1) console.log('click obj1');
  }
});

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

// Objects
const obj1 = new Mesh(new SphereGeometry(0.5, 16, 16), new MeshBasicMaterial({ color: 0xff0000 }));
obj1.position.x = -2;

const obj2 = new Mesh(new SphereGeometry(0.5, 16, 16), new MeshBasicMaterial({ color: 0xff0000 }));

const obj3 = new Mesh(new SphereGeometry(0.5, 16, 16), new MeshBasicMaterial({ color: 0xff0000 }));
obj3.position.x = 2;

scene.add(obj1, obj2, obj3);

// Raycaster
const raycaster = new Raycaster();

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

let currentIntersect: Intersection | null = null;

// Animations
const tick = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  obj1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  obj2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  obj3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Cast a ray
  raycaster.setFromCamera(cursor, camera);

  const objectsToTest = [obj1, obj2, obj3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  objectsToTest.forEach((object) => {
    object.material.color.set(0xff0000);
  });

  intersects.forEach((intersect) => {
    (intersect.object as Mesh<SphereGeometry, MeshBasicMaterial>).material.color.set(0x0000ff);
  });

  if (intersects.length) {
    if (currentIntersect == null) {
      console.log('enter');
    }
    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log('leave');
    }
    currentIntersect = null;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
