import {
  // MeshBasicMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  // MeshBasicMaterial,
  Mesh,
  // AxesHelper,
  // Box3,
  // Mesh,
  TextureLoader,
  LoadingManager,
  // NearestFilter,
  SphereGeometry,
  PlaneGeometry,
  TorusGeometry,
  BoxGeometry,
  Clock,
  // Color,
  // DoubleSide,
  // MeshNormalMaterial,
  // MeshMatcapMaterial,
  // MeshDepthMaterial,
  AmbientLight,
  PointLight,
  // MeshLambertMaterial,
  // MeshPhongMaterial,
  // MeshToonMaterial,
  MeshStandardMaterial,
  DirectionalLight,
  CameraHelper,
  PCFSoftShadowMap,
  // HemisphereLight,
  // RectAreaLight,
  // Vector3,
  SpotLight,
  MeshBasicMaterial,
  // HemisphereLightHelper,
  // DirectionalLightHelper,
  // PointLightHelper,
  // SpotLightHelper,
  // BufferAttribute,
  // CubeTextureLoader,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper';
// import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
// import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
// import gsap from 'gsap';
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

// Debug
const gui = new dat.GUI();
// const parameters = {
//   color: 0xff0000,
//   spin: () => {
//     gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + 10});
//   },
// };

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

// Cursor
const cursor = {x: 0, y: 0};
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / SIZES.width - 0.5;
  cursor.y = -(event.clientY / SIZES.height - 0.5);
});

// Scene
const scene = new Scene();

// Axes helper
// const axesHelper = new AxesHelper();
// scene.add(axesHelper);

// Lights
const ambientLight = new AmbientLight(0xffffff, 0.4);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

const directionalLight = new DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(directionalLight);

// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.camera.top = 2;
// directionalLight.shadow.camera.right = 2;
// directionalLight.shadow.camera.bottom = -2;
// directionalLight.shadow.camera.left = -2;
// directionalLight.shadow.camera.near = 1;
// directionalLight.shadow.camera.far = 6;
// directionalLight.shadow.radius = 10;

const pointLight = new PointLight(0xffffff, 0.3, 10, Math.PI * 0.3);
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

// pointLight.castShadow = true;
// pointLight.shadow.mapSize.width = 1024;
// pointLight.shadow.mapSize.height = 1024;
// pointLight.shadow.camera.near = 0.1;
// pointLight.shadow.camera.far = 5;

// const rectAreaLight = new RectAreaLight(0x4e00ff, 2, 1, 1);
// rectAreaLight.position.set(-1.5, 0, 1.5);
// rectAreaLight.lookAt(new Vector3(0, 0, 0));
// scene.add(rectAreaLight);

const spotLight = new SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);

// spotLight.castShadow = true;
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
// spotLight.shadow.camera.fov = 30;
// spotLight.shadow.camera.near = 1;
// spotLight.shadow.camera.far = 6;

// Light helpers
// const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 0.2);
// scene.add(hemisphereLightHelper);

// const directionalLightHelper = new DirectionalLightHelper(
//   directionalLight,
//   0.2,
// );
// scene.add(directionalLightHelper);
const directionalLightCameraHelper = new CameraHelper(
  directionalLight.shadow.camera,
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// const pointLightHelper = new PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);
const pointLightCameraHelper = new CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(rectAreaLightHelper);

// const spotLightHelper = new SpotLightHelper(spotLight);
// scene.add(spotLightHelper);
// window.requestAnimationFrame(() => spotLightHelper.update());
const spotLightCameraHelper = new CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// Textures
const loadingManager = new LoadingManager();
// loadingManager.onStart = () => console.log('onStart');
// loadingManager.onLoad = () => console.log('onLoad');
// loadingManager.onProgress = () => console.log('onProgress');
// loadingManager.onError = () => console.log('onError');

const textureLoader = new TextureLoader(loadingManager);
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');
// const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
// const cubeTextureLoader = new CubeTextureLoader(loadingManager);

// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png');
// const colorTexture = textureLoader.load('/textures/minecraft.png');
// colorTexture.generateMipmaps = false;
// colorTexture.minFilter = NearestFilter;
// colorTexture.magFilter = NearestFilter;
// const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
// const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
// const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
// const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
// const doorAmbientOcclusionTexture = textureLoader.load(
//   '/textures/door/ambientOcclusion.jpg',
// );
// const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
// const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
// const matcapTexture = textureLoader.load('/textures/matcaps/7.png');
// const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
// gradientTexture.minFilter = NearestFilter;
// gradientTexture.magFilter = NearestFilter;
// gradientTexture.generateMipmaps = false;

// const environmentMapTexture = cubeTextureLoader.load([
//   '/textures/environmentMaps/0/px.jpg',
//   '/textures/environmentMaps/0/nx.jpg',
//   '/textures/environmentMaps/0/py.jpg',
//   '/textures/environmentMaps/0/ny.jpg',
//   '/textures/environmentMaps/0/pz.jpg',
//   '/textures/environmentMaps/0/nz.jpg',
// ]);

// Fonts
// const fontLoader = new FontLoader();
// fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
//   const textGeometry = new TextGeometry('Hello Three.js', {
//     font,
//     size: 0.5,
//     height: 0.2,
//     curveSegments: 5,
//     bevelEnabled: true,
//     bevelThickness: 0.03,
//     bevelSize: 0.02,
//     bevelOffset: 0,
//     bevelSegments: 4,
//   });
//   textGeometry.center();
//   // textGeometry.computeBoundingBox();
//   // textGeometry.translate(
//   //   -((textGeometry.boundingBox as Box3).max.x - 0.02) * 0.5,
//   //   -((textGeometry.boundingBox as Box3).max.y - 0.02) * 0.5,
//   //   -((textGeometry.boundingBox as Box3).max.z - 0.03) * 0.5,
//   // );

//   const material = new MeshMatcapMaterial({matcap: matcapTexture});
//   const text = new Mesh(textGeometry, material);
//   scene.add(text);

//   const donutGeometry = new TorusGeometry(0.3, 0.2, 20, 45);

//   for (let i = 0; i < 100; i++) {
//     const donut = new Mesh(donutGeometry, material);

//     donut.position.x = (Math.random() - 0.5) * 10;
//     donut.position.y = (Math.random() - 0.5) * 10;
//     donut.position.z = (Math.random() - 0.5) * 10;

//     donut.rotation.x = Math.random() * Math.PI;
//     donut.rotation.y = Math.random() * Math.PI;

//     const scale = Math.random();
//     donut.scale.set(scale, scale, scale);

//     scene.add(donut);
//   }
// });

// Objects
// const geometry = new BoxGeometry(1, 1, 1);
// const material = new MeshBasicMaterial({map: colorTexture});
// const mesh = new Mesh(geometry, material);
// scene.add(mesh);

// const material = new MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new Color(0x00ff00);
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// material.side = DoubleSide;

// const material = new MeshNormalMaterial();
// material.flatShading = true

// const material = new MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new MeshDepthMaterial();

// const material = new MeshLambertMaterial();

// const material = new MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new Color(0x1188ff);

// const material = new MeshToonMaterial();
// material.gradientMap = gradientTexture;

// const material = new MeshStandardMaterial();
// material.metalness = 0;
// material.roughness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.1, 0.1);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

const material = new MeshStandardMaterial();
material.roughness = 0.7;
material.metalness = 0;
// material.envMap = environmentMapTexture;
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
// gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
// gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);
// gui.add(material.normalScale, 'x').min(0).max(1).step(0.0001);
// gui.add(material.normalScale, 'y').min(0).max(1).step(0.0001);

const sphere = new Mesh(new SphereGeometry(0.5, 32, 32), material);
// sphere.castShadow = true;
// sphere.position.x = -1.5;
// sphere.geometry.setAttribute(
//   'uv2',
//   new BufferAttribute(sphere.geometry.attributes.uv.array, 2),
// );

// const cube = new Mesh(new BoxGeometry(0.75, 0.75, 0.75), material);
// plane.geometry.setAttribute(
//   'uv2',
//   new BufferAttribute(plane.geometry.attributes.uv.array, 2),
// );

// const torus = new Mesh(new TorusGeometry(0.3, 0.2, 32, 64), material);
// torus.position.x = 1.5;
// torus.geometry.setAttribute(
//   'uv2',
//   new BufferAttribute(torus.geometry.attributes.uv.array, 2),
// );

const plane = new Mesh(new PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
// plane.receiveShadow = true;

const sphereShadow = new Mesh(
  new PlaneGeometry(1.5, 1.5),
  new MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  }),
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);

// scene.add(sphere, cube, torus, plane);
scene.add(sphere, plane);

// Debug
// gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
// gui.add(mesh, 'visible');
// gui.add(material, 'wireframe');
// gui.addColor(parameters, 'color').onChange(() => {
//   material.color.set(parameters.color);
// });
// gui.add(parameters, 'spin');

// Camera
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 3;
// camera.lookAt(mesh.position);
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
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = PCFSoftShadowMap;

// Clock
const clock = new Clock();

// Animations
const tick = () => {
  // Clock
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.position.x = Math.cos(elapsedTime);
  sphere.position.z = Math.sin(elapsedTime);
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  sphereShadow.position.x = Math.cos(elapsedTime);
  sphereShadow.position.z = Math.sin(elapsedTime);
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  // sphere.rotation.y = 0.1 * elapsedTime;
  // cube.rotation.y = 0.1 * elapsedTime;
  // torus.rotation.y = 0.1 * elapsedTime;

  // sphere.rotation.x = 0.15 * elapsedTime;
  // cube.rotation.x = 0.15 * elapsedTime;
  // torus.rotation.x = 0.15 * elapsedTime;

  // Update camera
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(mesh.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
