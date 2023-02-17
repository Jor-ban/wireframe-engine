import {PointLightWithHelper} from "./PointLightWithHelper";
import {DirectionalLightWithHelper} from "./DirectionalLightWithHelper";
import {SpotLightWithHelper} from "./SpotLightWithHelper";
import {HemisphereLightWithHelper} from "./HemisphereLightWithHelper";
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

export class LightWithHelper {
    static from(light: Light): AmbientLight | PointLightWithHelper | DirectionalLightWithHelper | SpotLightWithHelper | HemisphereLightWithHelper | undefined {
        if(light instanceof AmbientLight) {
            return light
        } else if(light instanceof PointLight) {
            return PointLightWithHelper.from(light)
        } else if(light instanceof DirectionalLight) {
            return DirectionalLightWithHelper.from(light)
        } else if(light instanceof HemisphereLight) {
            return HemisphereLightWithHelper.from(light)
        } else if(light instanceof SpotLight) {
            return SpotLightWithHelper.from(light)
        }
        return undefined
    }

    static isLightWithHelper(light: any): light is PointLightWithHelper | DirectionalLightWithHelper | SpotLightWithHelper | HemisphereLightWithHelper {
        return light instanceof PointLightWithHelper ||
            light instanceof DirectionalLightWithHelper ||
            light instanceof SpotLightWithHelper ||
            light instanceof HemisphereLightWithHelper
    }
    static isLightHelper(object: Object3D): object is DirectionalLightHelper | HemisphereLightHelper | PointLightHelper | SpotLightHelper {
        return object instanceof DirectionalLightHelper ||
            object instanceof HemisphereLightHelper ||
            object instanceof PointLightHelper ||
            object instanceof SpotLightHelper
    }
}