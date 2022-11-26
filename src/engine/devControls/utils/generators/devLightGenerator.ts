import {Light, OrthographicCamera, PerspectiveCamera} from "three";
import {DevPointLight} from "../../../lib/devLights/DevPointLight";
import {DevSpotLight} from "../../../lib/devLights/DevSpotLight";
import {DevDirectionalLight} from "../../../lib/devLights/DevDirectionalLight";
import {DevHemisphereLight} from "../../../lib/devLights/DevHemisphereLight";

export class DevLightGenerator {
    static addPointLight(camera: PerspectiveCamera | OrthographicCamera): Light {
        const light = new DevPointLight()
        this.positionLight(light, camera)
        return light
    }
    static addSpotLight(camera: PerspectiveCamera | OrthographicCamera): Light {
        const light = new DevSpotLight()
        this.positionLight(light, camera)
        return light
    }
    static addDirectionalLight(camera: PerspectiveCamera | OrthographicCamera): Light {
        const light = new DevDirectionalLight()
        this.positionLight(light, camera)
        return light
    }
    static addHemisphereLight(camera: PerspectiveCamera | OrthographicCamera): Light {
        const light = new DevHemisphereLight()
        this.positionLight(light, camera)
        return light
    }

    private static positionLight(light: Light, camera: PerspectiveCamera | OrthographicCamera) {
        light.position.set( // creating new position depending on camera position and orientation
            Math.round((camera.position.x - Math.sin(camera.rotation.y) * 5) * 10) / 10,
            Math.round((camera.position.y + Math.sin(camera.rotation.x) * 5) * 10) / 10,
            Math.round((camera.position.z - Math.cos(camera.rotation.z) * 5) * 10) / 10,
        )
        light.rotation.copy(camera.rotation)
    }
}