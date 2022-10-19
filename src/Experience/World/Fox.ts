import { AnimationAction, AnimationMixer, Mesh, Scene } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import Experience from '../Experience';
import Debug from '../Utils/Debug';
import Resources from '../Utils/Resources';
import Time from '../Utils/Time';

interface IAnimationActions {
  idle: AnimationAction;
  walking: AnimationAction;
  running: AnimationAction;
  current: AnimationAction;
}

export default class Fox {
  experience: Experience;
  scene: Scene;
  time: Time;
  resources: Resources;
  resource: GLTF;
  model!: GLTF['scene'];
  animation!: {
    play: Function;
    mixer: AnimationMixer;
    actions: IAnimationActions;
  };
  debug: Debug;
  debugFolder?: Debug['ui'];

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fox');
    }

    this.resource = this.resources.items.foxModel as GLTF;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    const mixer = new AnimationMixer(this.model);

    this.animation = {
      mixer,
      actions: {
        idle: mixer.clipAction(this.resource.animations[0]),
        walking: mixer.clipAction(this.resource.animations[1]),
        running: mixer.clipAction(this.resource.animations[2]),
        current: mixer.clipAction(this.resource.animations[0]),
      },
      play: (name: keyof IAnimationActions) => {
        const newAction: AnimationAction = (this.animation.actions as IAnimationActions)[name];
        const oldAction: AnimationAction = (this.animation.actions as IAnimationActions).current;

        newAction.reset();
        newAction.play();
        newAction.crossFadeFrom(oldAction, 1, false);

        (this.animation.actions as IAnimationActions).current = newAction;
      },
    };

    this.animation.actions.current.play();

    if (this.debug.active && this.debugFolder) {
      const debugObject = {
        playIdle: () => {
          this.animation.play('idle');
        },
        playWalking: () => {
          this.animation.play('walking');
        },
        playRunning: () => {
          this.animation.play('running');
        },
      };

      this.debugFolder.add(debugObject, 'playIdle');
      this.debugFolder.add(debugObject, 'playWalking');
      this.debugFolder.add(debugObject, 'playRunning');
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}
