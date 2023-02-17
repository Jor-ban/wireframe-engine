import { MeshParser } from '⚙️/lib/parsers/MeshParser';
import { MeshJson } from '../parsers/types/MeshJson.type';
import { SceneParser } from '../parsers/sceneParser';
import { SceneJson } from '../parsers/types/SceneJson.type';
import { Object3D, Scene } from "three";

export class WScene extends Scene {

    constructor() {
        super()
    }

    static from(scene: Scene | SceneJson): WScene {
        return SceneParser.parse(scene)
    }
    add(...objects: (MeshJson | Object3D)[]): this {
        super.add(...objects.map(obj => {
            if(obj instanceof Object3D) {
                return obj
            } else {
                return MeshParser.parse(obj)
            }
        }))
        return this
    }
}