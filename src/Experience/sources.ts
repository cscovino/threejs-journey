import { CubeTexture, Texture } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export type ISourceNames =
  | 'environmentMapTexture'
  | 'grassColorTexture'
  | 'grassNormalTexture'
  | 'foxModel';

export interface ISourceType {
  gltfModel: GLTF;
  texture: Texture;
  cubeTexture: CubeTexture;
}

export type ISource =
  | {
      name: ISourceNames;
      type: 'cubeTexture';
      path: Array<string>;
    }
  | {
      name: ISourceNames;
      type: Exclude<keyof ISourceType, 'cubeTexture'>;
      path: string;
    };

const sources: Array<ISource> = [
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path: [
      'textures/environmentMap/px.jpg',
      'textures/environmentMap/nx.jpg',
      'textures/environmentMap/py.jpg',
      'textures/environmentMap/ny.jpg',
      'textures/environmentMap/pz.jpg',
      'textures/environmentMap/nz.jpg',
    ],
  },
  {
    name: 'grassColorTexture',
    type: 'texture',
    path: 'textures/dirt/color.jpg',
  },
  {
    name: 'grassNormalTexture',
    type: 'texture',
    path: 'textures/dirt/normal.jpg',
  },
  {
    name: 'foxModel',
    type: 'gltfModel',
    path: 'models/Fox/glTF/Fox.gltf',
  },
];

export default sources;
