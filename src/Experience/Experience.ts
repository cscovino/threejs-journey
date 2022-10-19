import { Mesh, Scene } from 'three';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Resources from './Utils/Resources';
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import sources from './sources';
import Debug from './Utils/Debug';

export default class Experience {
  private static _instance: Experience;
  canvas!: HTMLCanvasElement;
  sizes!: Sizes;
  time!: Time;
  scene!: Scene;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;
  resources!: Resources;
  debug!: Debug;

  constructor(canvas?: HTMLCanvasElement) {
    if (Experience._instance) return Experience._instance;

    Experience._instance = this;

    // Global access
    (<any>window).experience = this;

    // Options
    this.canvas = canvas as HTMLCanvasElement;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // Sizes resize event
    this.sizes.on('resize', this.resize.bind(this));

    // Time tick event
    this.time.on('tick', this.update.bind(this));
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off('resize');
    this.time.off('tick');

    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) this.debug.ui.destroy();
  }
}
