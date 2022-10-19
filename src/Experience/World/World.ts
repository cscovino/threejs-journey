import { Scene } from 'three';
import Experience from '../Experience';
import Resources from '../Utils/Resources';
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';

export default class World {
  experience: Experience;
  scene: Scene;
  environment!: Environment;
  floor!: Floor;
  fox!: Fox;
  resources: Resources;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) this.fox.update();
  }
}
