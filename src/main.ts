import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Clock,
  PCFShadowMap,
  TextureLoader,
  Mesh,
  MeshStandardMaterial,
  DirectionalLight,
  BoxGeometry,
  SphereGeometry,
  PlaneGeometry,
  TorusKnotGeometry,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import * as dat from 'dat.gui';
import './style.css';

// Stats
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

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

// Loaders
const textureLoader = new TextureLoader();

// Textures
const displacementTexture = textureLoader.load('/textures/displacementMap.png');

// Test Meshes
const cube = new Mesh(new BoxGeometry(2, 2, 2), new MeshStandardMaterial());
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.set(-5, 0, 0);
scene.add(cube);

const torusKnot = new Mesh(new TorusKnotGeometry(1, 0.4, 128, 32), new MeshStandardMaterial());
torusKnot.castShadow = true;
torusKnot.receiveShadow = true;
scene.add(torusKnot);

const sphere = new Mesh(new SphereGeometry(1, 32, 32), new MeshStandardMaterial());
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere.position.set(5, 0, 0);
scene.add(sphere);

const floor = new Mesh(new PlaneGeometry(10, 10), new MeshStandardMaterial());
floor.castShadow = true;
floor.receiveShadow = true;
floor.position.set(0, -2, 0);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Lights
const directionalLight = new DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, 2.25);
scene.add(directionalLight);

// Camera
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 6;
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;
renderer.setSize(SIZES.width, SIZES.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Clock
const clock = new Clock();

// Animations
const tick = () => {
  stats.begin();

  // Clock
  const elapsedTime = clock.getElapsedTime();

  // Update material
  torusKnot.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);

  stats.end();
};

tick();

//Tips

// // Tip 4
// console.log(renderer.info)

// // Tip 6
// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

// // Tip 10
// directionalLight.shadow.camera.top = 3
// directionalLight.shadow.camera.right = 6
// directionalLight.shadow.camera.left = - 6
// directionalLight.shadow.camera.bottom = - 3
// directionalLight.shadow.camera.far = 10
// directionalLight.shadow.mapSize.set(1024, 1024)

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)

// // Tip 11
// cube.castShadow = true
// cube.receiveShadow = false

// torusKnot.castShadow = true
// torusKnot.receiveShadow = false

// sphere.castShadow = true
// sphere.receiveShadow = false

// floor.castShadow = false
// floor.receiveShadow = true

// // Tip 12
// renderer.shadowMap.autoUpdate = false
// renderer.shadowMap.needsUpdate = true

// // Tip 18
// for(let i = 0; i < 50; i++)
// {
//     const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

//     const material = new THREE.MeshNormalMaterial()

//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// // Tip 19
// for(let i = 0; i < 50; i++)
// {
//     const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

//     const material = new THREE.MeshNormalMaterial()

//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// // Tip 20
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

// for(let i = 0; i < 50; i++)
// {
//     const material = new THREE.MeshNormalMaterial()

//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// // Tip 22
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

// const material = new THREE.MeshNormalMaterial()

// for(let i = 0; i < 50; i++)
// {
//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// // Tip 29
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// // Tip 31, 32, 34 and 35
// const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)

// const shaderMaterial = new THREE.ShaderMaterial({
//     uniforms:
//     {
//         uDisplacementTexture: { value: displacementTexture },
//         uDisplacementStrength: { value: 1.5 }
//     },
//     vertexShader: `
//         uniform sampler2D uDisplacementTexture;
//         uniform float uDisplacementStrength;

//         varying vec2 vUv;

//         void main()
//         {
//             vec4 modelPosition = modelMatrix * vec4(position, 1.0);

//             float elevation = texture2D(uDisplacementTexture, uv).r;
//             if(elevation < 0.5)
//             {
//                 elevation = 0.5;
//             }

//             modelPosition.y += elevation * uDisplacementStrength;

//             gl_Position = projectionMatrix * viewMatrix * modelPosition;

//             vUv = uv;
//         }
//     `,
//     fragmentShader: `
//         uniform sampler2D uDisplacementTexture;

//         varying vec2 vUv;

//         void main()
//         {
//             float elevation = texture2D(uDisplacementTexture, vUv).r;
//             if(elevation < 0.25)
//             {
//                 elevation = 0.25;
//             }

//             vec3 depthColor = vec3(1.0, 0.1, 0.1);
//             vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
//             vec3 finalColor = vec3(0.0);
//             finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
//             finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
//             finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;

//             gl_FragColor = vec4(finalColor, 1.0);
//         }
//     `
// })

// const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
// shaderMesh.rotation.x = - Math.PI * 0.5
// scene.add(shaderMesh)
