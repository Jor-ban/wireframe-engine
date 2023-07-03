import { LightJson } from "⚙️/lib/parsers/types/LightJson.type";
import { PathToMeshJson } from "⚙️/lib/parsers/types/MeshJson.type";

export class ParserDataType {
    public static isLightJson(obj: any): obj is LightJson {
        return obj.type !== undefined ||
            obj.intensity !== undefined ||
            obj.color !== undefined ||
            obj.castShadow !== undefined ||
            obj.decay !== undefined ||
            obj.distance !== undefined ||
            obj.power !== undefined ||
            obj.groundColor !== undefined ||
            obj.type === 'ambient' ||
            obj.type === 'point' ||
            obj.type === 'directional' ||
            obj.type === 'hemisphere'
    }
    public static isJsonWithPath(obj: any): obj is Required<PathToMeshJson> {
        return obj.url !== undefined
    }
}