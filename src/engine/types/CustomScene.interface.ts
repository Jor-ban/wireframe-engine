import {LoadingManager, TextureEncoding} from "three";

export interface CustomScene {
    skybox?: {
        posX: string,
        negX: string,
        posY: string,
        negY: string,
        posZ: string,
        negZ: string,
    } | string[], // Array loads multiple images in the same order as in object
    encoding ?: TextureEncoding,
    loadingManager?: LoadingManager
}