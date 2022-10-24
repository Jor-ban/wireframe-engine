import {DevPointLight} from "./DevPointLight";
import {DevDirectionalLight} from "./DevDirectionalLight";
import {DevSpotLight} from "./DevSpotLight";
import {DevHemisphereLight} from "./DevHemisphereLight";
import {
    AmbientLight,
    DirectionalLight,
    DirectionalLightHelper,
    HemisphereLight, HemisphereLightHelper,
    Light,
    Object3D,
    PointLight, PointLightHelper,
    SpotLight, SpotLightHelper
} from "three";

export class DevLight {
    static from(light: Light): AmbientLight | DevPointLight | DevDirectionalLight | DevSpotLight | DevHemisphereLight | undefined {
        if(light instanceof AmbientLight) {
            return light
        } else if(light instanceof PointLight) {
            return DevPointLight.from(light)
        } else if(light instanceof DirectionalLight) {
            return DevDirectionalLight.from(light)
        } else if(light instanceof HemisphereLight) {
            return DevHemisphereLight.from(light)
        } else if(light instanceof SpotLight) {
            return DevSpotLight.from(light)
        }
    }

    static ifDevLight(light: Light): light is DevPointLight | DevDirectionalLight | DevSpotLight | DevHemisphereLight {
        return light instanceof DevPointLight ||
            light instanceof DevDirectionalLight ||
            light instanceof DevSpotLight ||
            light instanceof DevHemisphereLight
    }
    static isLightHelper(object: Object3D): object is DirectionalLightHelper | HemisphereLightHelper | PointLightHelper | SpotLightHelper {
        return object instanceof DirectionalLightHelper ||
            object instanceof HemisphereLightHelper ||
            object instanceof PointLightHelper ||
            object instanceof SpotLightHelper
    }
}