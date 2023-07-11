import {GroupJsonInterface} from "⚙️/lib/parsers/types/GroupJson.interface";
import {Group, Object3D} from "three";
import {ParserDataType} from "⚙️/lib/guards/parser-data-type";
import {LightParser} from "⚙️/lib/parsers/lightParser";
import {MeshParser} from "⚙️/lib/parsers/MeshParser";

export class GroupParser {
    static parseAsync(json: GroupJsonInterface): Promise<Group> {
        const group = new Group()
        return Promise.all(json.children?.map(childJson => {
            if(childJson instanceof Object3D) {
                group.add(childJson)
                return childJson
            } else if(ParserDataType.isLight(childJson)) {
                const light = LightParser.parse(childJson)
                group.add(light)
                return light
            } else if(ParserDataType.isGroup(childJson)) {
                return this.parseAsync(childJson).then(g => group.add(g))
            } else if(ParserDataType.isJsonWithPath(childJson)) {
                return MeshParser.parseUrlFileJson(childJson).then(m => group.add(m))
            } else {
                const mesh = MeshParser.parse(childJson)
                group.add(mesh)
                return mesh
            }
        })).then(() => group)
    }
    static parse(json: GroupJsonInterface): Group {
        const group = new Group()
        json.children?.forEach(childJson => {
            if(childJson instanceof Object3D) {
                group.add(childJson)
            } else if(ParserDataType.isLight(childJson)) {
                const light = LightParser.parse(childJson)
                group.add(light)
            } else if(ParserDataType.isGroup(childJson)) {
                const g = this.parse(childJson)
                group.add(g)
            } else if(ParserDataType.isJsonWithPath(childJson)) {
                throw new Error("[GroupParser -> parseSync]: Cannot parse json with url synchronously")
            } else {
                const mesh = MeshParser.parse(childJson)
                group.add(mesh)
            }
        })
        return group
    }
}