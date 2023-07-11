import { MeshParser } from "⚙️/lib/parsers/MeshParser";
import { MeshJson } from "./types/MeshJson.type";
import { LightJson } from "⚙️/lib/parsers/types/LightJson.type";
import { Object3D } from "three";
import {ParserDataType} from "⚙️/lib/guards/parser-data-type";
import {LightParser} from "⚙️/lib/parsers/lightParser";
import {GroupParser} from "⚙️/lib/parsers/GroupParser";

export type ParseListener = (json: Object, arg: Object3D) => any

export class ParsingManager {
    private listeners: Set<ParseListener> = new Set()
    constructor() {
    }
    public async parse(json: MeshJson | LightJson | Object3D): Promise<Object3D> {
        let mesh: Object3D
        if(json instanceof Object3D) {
            mesh = json
        } else {
            if(ParserDataType.isLight(json))
                mesh = LightParser.parse(json)
            else if(ParserDataType.isGroup(json))
                mesh = await GroupParser.parseAsync(json)
            else if(ParserDataType.isJsonWithPath(json))
                mesh = await MeshParser.parseUrlFileJson(json)
            else
                mesh = MeshParser.parse(json)
        }
        for(let callback of this.listeners) {
            callback(json, mesh)
        }
        return mesh
    }

    public parseAll(objects: MeshJson[]): Promise<Object3D[]> {
        return Promise.all(objects.map(o => this.parse(o)))
    }

    public addListener(listener: ParseListener) {
        this.listeners.add(listener)
    }
    public removeListener(listener: ParseListener) {
        this.listeners.delete(listener)
    }
}