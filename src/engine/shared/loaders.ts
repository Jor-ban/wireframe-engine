import { TextureLoader } from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const WireframeTextureLoader = new TextureLoader()
export const WireframeFontLoader = new FontLoader()
export const WireframeFBXLoader = new FBXLoader()
export const WireframeObjLoader = new OBJLoader()
export const WireframeGLTFLoader = new GLTFLoader()