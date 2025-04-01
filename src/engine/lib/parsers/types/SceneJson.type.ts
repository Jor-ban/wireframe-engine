import {Color, LoadingManager, Object3D} from "three";
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
    } | [string, string, string, string, string, string] | Color, // Array loads multiple images in the same order as in object
    loadingManager?: LoadingManager,
    children ?: (Object3D | MeshJson | LightJson)[], // array of objects
}