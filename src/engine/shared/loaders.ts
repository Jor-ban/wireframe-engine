import { TextureLoader } from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class WireframeLoadersFactory {
    private _textureLoader: TextureLoader | null = null
    private _fontLoader: FontLoader | null = null
    private _fbxLoader: FBXLoader | null = null
    private _objLoader: OBJLoader | null = null
    private _gltfLoader: GLTFLoader | null = null
    public get textureLoader(): TextureLoader {
        if(!this._textureLoader)
            this._textureLoader = new TextureLoader()

        return this._textureLoader
    }
    public get fontLoader(): FontLoader {
        if(!this._fontLoader)
            this._fontLoader = new FontLoader()

        return this._fontLoader
    }
    public get FBXLoader(): FBXLoader {
        if(!this._fbxLoader)
            this._fbxLoader = new FBXLoader()

        return this._fbxLoader
    }
    public get objLoader(): OBJLoader {
        if(!this._objLoader)
            this._objLoader = new OBJLoader()

        return this._objLoader
    }
    public get GLTFLoader(): GLTFLoader {
        if(!this._gltfLoader)
            this._gltfLoader = new GLTFLoader()

        return this._gltfLoader
    }
}

export const WireframeLoaders = new WireframeLoadersFactory()