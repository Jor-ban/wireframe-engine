import { LightJson } from "⚙️/lib/parsers/types/LightJson.type";

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
}