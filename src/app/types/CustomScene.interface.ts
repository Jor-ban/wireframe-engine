import {LoadingManager, TextureEncoding} from "three";

export interface CustomScene {
    skybox: {
        negY: string,
        posY: string,
        negX: string,
        posX: string,
        negZ: string,
        posZ: string,
    } | string[],
    encoding ?: TextureEncoding,
    loadingManager?: LoadingManager
}