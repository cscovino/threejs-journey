import { CubeTextureLoader, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ISource, ISourceNames, ISourceType } from '../sources';

import EventEmitter from './EventEmitter';

interface ILoaders {
  gltfLoader: GLTFLoader;
  textureLoader: TextureLoader;
  cubeTextureLoader: CubeTextureLoader;
}

export default class Resources extends EventEmitter {
  sources: Array<ISource>;
  items: Partial<{ [key in ISourceNames]: ISourceType[keyof ISourceType] }>;
  toLoad: number;
  loaded: number;
  loaders: ILoaders = {
    gltfLoader: new GLTFLoader(),
    textureLoader: new TextureLoader(),
    cubeTextureLoader: new CubeTextureLoader(),
  };

  constructor(sources: Array<ISource>) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.startLoading();
  }

  startLoading() {
    this.sources.forEach((source) => {
      switch (source.type) {
        case 'gltfModel':
          this.loaders.gltfLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        case 'texture':
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        case 'cubeTexture':
          this.loaders.cubeTextureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        default:
          console.error('Invalid source type');
          break;
      }
    });
  }

  sourceLoaded(source: ISource, file: ISourceType[keyof ISourceType]) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger('ready');
    }
  }
}
