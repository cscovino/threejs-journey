import { DirectionalLight, Mesh, MeshStandardMaterial, Scene, sRGBEncoding, Texture } from 'three';
import Experience from '../Experience';
import Debug from '../Utils/Debug';
import Resources from '../Utils/Resources';

export default class Environment {
  experience: Experience;
  scene: Scene;
  sunLight!: DirectionalLight;
  resources: Resources;
  environmentMap!: {
    intensity: number;
    texture: Texture;
    updateMaterials: () => void;
  };
  debug: Debug;
  debugFolder?: Debug['ui'];

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('environment');
    }

    this.setSunLight();
    this.setEnvironmentMap();
  }

  setSunLight() {
    this.sunLight = new DirectionalLight('#ffffff', 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);

    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.sunLight, 'intensity')
        .name('sunLightIntensity')
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'x')
        .name('sunLightX')
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'y')
        .name('sunLightY')
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'z')
        .name('sunLightZ')
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {
      intensity: 0.4,
      texture: this.resources.items.environmentMapTexture as Texture,
      updateMaterials: () => {
        this.scene.traverse((child) => {
          if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
            child.material.envMap = this.environmentMap.texture;
            child.material.envMapIntensity = this.environmentMap.intensity;
            child.material.needsUpdate = true;
          }
        });
      },
    };
    this.environmentMap.texture.encoding = sRGBEncoding;
    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials();

    if (this.debug.active && this.debugFolder) {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .name('envMapIntensity')
        .min(0)
        .max(10)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials);
    }
  }
}
