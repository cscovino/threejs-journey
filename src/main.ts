import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Clock,
  DirectionalLight,
  CubeTextureLoader,
  sRGBEncoding,
  PCFSoftShadowMap,
  ReinhardToneMapping,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  ShaderMaterial,
  LoadingManager,
  Vector3,
  Raycaster,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
import { gsap } from 'gsap';
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
});

// Debug
const gui = new dat.GUI();
const debugObject = {
  envMapIntensity: 0,
};

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Scene
const scene = new Scene();

// Overlay
const overlayGeometry = new PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new ShaderMaterial({
  wireframe: false,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1.0 },
  },
  vertexShader: `
    void main() {
      gl_Position =  vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uAlpha;

    void main() {
      gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
    }
  `,
});
const overlay = new Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

let sceneReady = false;
// Loaders
const loadingElement = document.querySelector('.loading-bar') as HTMLElement;
const loadingManager = new LoadingManager(
  // Loaded
  () => {
    gsap.delayedCall(0.5, () => {
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 });
      loadingElement.classList.add('ended');
      loadingElement.style.transform = '';
    });

    setTimeout(() => {
      sceneReady = true;
    }, 2000);
  },
  // Progess
  (_, itemsLoaded, itemsTotal) => {
    loadingElement.style.transform = `scaleX(${itemsLoaded / itemsTotal})`;
  },
);
const cubeTextureLoader = new CubeTextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);

// Update all materials
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

// Environment map
const environmentMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
]);

environmentMap.encoding = sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;

debugObject.envMapIntensity = 2.5;

// Models
gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(2.5, 2.5, 2.5);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();
});

// Points of interest
const raycaster = new Raycaster();

const points = [
  {
    position: new Vector3(1.55, 0.3, -0.6),
    element: document.querySelector('.point-0') as HTMLElement,
  },
  {
    position: new Vector3(0.5, 0.8, -1.6),
    element: document.querySelector('.point-1') as HTMLElement,
  },
  {
    position: new Vector3(1.6, -1.3, -0.7),
    element: document.querySelector('.point-2') as HTMLElement,
  },
];

// Lights
const directionalLight = new DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

// Camera
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.x = 4;
camera.position.y = 1;
camera.position.z = -4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new WebGLRenderer({
  canvas,
  powerPreference: 'high-performance',
  antialias: true,
});
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = sRGBEncoding;
renderer.toneMapping = ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setSize(SIZES.width, SIZES.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Clock
const clock = new Clock();

// Animations
const tick = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();

  // Go through each point
  if (sceneReady) {
    points.forEach((point) => {
      const screenPosition = point.position.clone();
      screenPosition.project(camera);

      raycaster.setFromCamera(screenPosition, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length === 0) {
        point.element.classList.add('visible');
      } else {
        const intersectionDistance = intersects[0].distance;
        const pointDistance = point.position.distanceTo(camera.position);
        if (intersectionDistance < pointDistance) {
          point.element.classList.remove('visible');
        } else {
          point.element.classList.add('visible');
        }
      }

      const translateX = screenPosition.x * SIZES.width * 0.5;
      const translateY = -screenPosition.y * SIZES.height * 0.5;
      point.element.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
