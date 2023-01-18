import {CubeTextureLoader, Scene, sRGBEncoding} from "three";
import {CustomScene} from "./types/CustomScene.interface";
import {defaultSkybox} from "../shared/defaultSkybox";

export class SceneParser {
    public static parse(scene ?: Scene | CustomScene): Scene {
        if(scene instanceof Scene) {
            return scene
        } else if(!scene) {
            const scene = new Scene()
            scene.environment = defaultSkybox
            scene.background = defaultSkybox
            return scene
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
        } else {
            sceneInstance.background = defaultSkybox
            sceneInstance.environment = defaultSkybox
        }
        return sceneInstance
    }
}