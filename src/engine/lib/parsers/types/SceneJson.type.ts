import {LoadingManager, TextureEncoding} from "three";

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
    loadingManager?: LoadingManager
}