import {Light, PerspectiveCamera} from "three";
import {PointLightWithHelper} from "../../../lib/devClasses/lightsWithHelper/PointLightWithHelper";
import {SpotLightWithHelper} from "../../../lib/devClasses/lightsWithHelper/SpotLightWithHelper";
import {DirectionalLightWithHelper} from "../../../lib/devClasses/lightsWithHelper/DirectionalLightWithHelper";
import {HemisphereLightWithHelper} from "../../../lib/devClasses/lightsWithHelper/HemisphereLightWithHelper";

export class LightWithHelperGenerator {
    static addPointLight(camera: PerspectiveCamera): Light {
        const light = new PointLightWithHelper()
        this.positionLight(light, camera)
        return light
    }
    static addSpotLight(camera: PerspectiveCamera): Light {
        const light = new SpotLightWithHelper()
        this.positionLight(light, camera)
        return light
    }
    static addDirectionalLight(camera: PerspectiveCamera): Light {
        const light = new DirectionalLightWithHelper()
        this.positionLight(light, camera)
        return light
    }
    static addHemisphereLight(camera: PerspectiveCamera): Light {
        const light = new HemisphereLightWithHelper()
        this.positionLight(light, camera)
        return light
    }

    private static positionLight(light: Light, camera: PerspectiveCamera) {
        light.position.set( // creating new position depending on camera position and orientation
            Math.round((camera.position.x - Math.sin(camera.rotation.y) * 5) * 10) / 10,
            Math.round((camera.position.y + Math.sin(camera.rotation.x) * 5) * 10) / 10,
            Math.round((camera.position.z - Math.cos(camera.rotation.z) * 5) * 10) / 10,
        )
        light.rotation.copy(camera.rotation)
    }
}