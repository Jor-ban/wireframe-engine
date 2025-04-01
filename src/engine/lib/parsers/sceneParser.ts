import { WScene } from '⚙️/lib';
import {CubeTextureLoader, Scene, Color} from "three";
import {SceneJson} from "./types/SceneJson.type";
import {defaultSkybox} from "⚙️/shared/consts/defaultSkybox";

export class SceneParser {
    public static parse(scene ?: Scene | SceneJson): WScene {
        if(scene instanceof Scene) {
            const w = new WScene()
            w.background = scene.background
            w.environment = scene.environment
            w.fog = scene.fog
            w.overrideMaterial = scene.overrideMaterial
            w.onBeforeRender = scene.onBeforeRender
            w.onAfterRender = scene.onAfterRender
            return w
        } else if(!scene) {
            const scene = new WScene()
            scene.environment = defaultSkybox
            scene.background = defaultSkybox
            return scene
        }
        const sceneInstance = new WScene()
        let { skybox, loadingManager, encoding } = scene
        if(skybox) {
            if(skybox instanceof Color) {
                sceneInstance.background = skybox
            } else {
                if(!Array.isArray(skybox)) {
                    skybox = [skybox.posX, skybox.negX, skybox.posY, skybox.negY, skybox.posZ, skybox.negZ]
                }
                const cubeTextureLoader = new CubeTextureLoader(loadingManager)
                const envMap = cubeTextureLoader.load(skybox)
                sceneInstance.background = envMap
                sceneInstance.environment = envMap
            }
        } else {
            sceneInstance.background = defaultSkybox
            sceneInstance.environment = defaultSkybox
        }
        return sceneInstance
    }
}