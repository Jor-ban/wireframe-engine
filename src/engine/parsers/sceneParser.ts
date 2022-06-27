import {CubeTextureLoader, Scene, sRGBEncoding} from "three";
import {CustomScene} from "../types/CustomScene.interface";

export class SceneParser {
    public static parse(scene ?: Scene | CustomScene): Scene {
        if(scene instanceof Scene) {
            return scene
        } else if(!scene) {
            return new Scene()
        }
        const sceneInstance = new Scene()
        let { skybox, loadingManager, encoding } = scene
        if(skybox) {
            if(!Array.isArray(skybox)) {
                skybox = [skybox.posX, skybox.negX, skybox.posY, skybox.negY, skybox.posZ, skybox.negZ]
            }
            const cubeTextureLoader = new CubeTextureLoader(loadingManager)
            const envMap = cubeTextureLoader.load(skybox)
            envMap.encoding = encoding || sRGBEncoding
            sceneInstance.background = envMap
            sceneInstance.environment = envMap
        }
        return sceneInstance
    }
}