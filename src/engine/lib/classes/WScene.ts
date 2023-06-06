import { MeshParser } from '⚙️/lib/parsers/MeshParser';
import { MeshJson } from '../parsers/types/MeshJson.type';
import { SceneParser } from '../parsers/sceneParser';
import { SceneJson } from '../parsers/types/SceneJson.type';
import { Object3D, Scene } from "three";
import {ParserDataType} from "⚙️/lib/guards/parser-data-type";
import {LightParser} from "⚙️/lib/parsers/lightParser";
export class WScene extends Scene{

    constructor() {
        super()
    }

    static from(scene: Scene | SceneJson): WScene {
        return SceneParser.parse(scene)
    }
    public override add(...objects: (MeshJson | Object3D)[]): this {
        const els = objects.map(obj => {
            if(obj instanceof Object3D)
                return obj
            else if(ParserDataType.isLightJson(obj))
                return LightParser.parse(obj)
            else
                return MeshParser.parse(obj)
        })
        Promise.all(els).then(obj3ds => super.add(...obj3ds))
        return this
    }
}