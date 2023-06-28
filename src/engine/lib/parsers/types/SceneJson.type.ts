import {LoadingManager, Object3D, TextureEncoding} from "three";
import {MeshJson} from "⚙️/lib/parsers/types/MeshJson.type";
import {LightJson} from "⚙️/lib/parsers/types/LightJson.type";

export type SceneJson = {
    skybox?: {
        posX: string,
        negX: string,
        posY: string,
        negY: string,
        posZ: string,
        negZ: string,
    } | [string, string, string, string, string, string], // Array loads multiple images in the same order as in object
    encoding ?: TextureEncoding,
    loadingManager?: LoadingManager,
    children ?: (Object3D | MeshJson | LightJson)[], // array of objects
}