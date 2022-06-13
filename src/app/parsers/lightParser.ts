import {AmbientLight, Light} from "three";
import {CustomAmbientLight} from "../types/CustomAmbientLight";

export class LightParser {
    static parse(light: AmbientLight | CustomAmbientLight): Light {
        if(light instanceof AmbientLight) {
            return light
        } else {
            return new AmbientLight(
                light?.color || 'white',
                light?.intensity || 1
            )
        }
    }
}