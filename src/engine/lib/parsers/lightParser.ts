import {
    AmbientLight,
    Color,
    ColorRepresentation,
    DirectionalLight,
    HemisphereLight,
    Light,
    PointLight,
} from "three";
import { AmbientLightJson, LightJson } from './types/LightJson.type';
import { Object3dParser } from "⚙️/lib/parsers/Object3dParser";

export class LightParser {
    static parse(light: Light | LightJson): Light {
        if(light instanceof Light) {
            return light
        } else {
            let lightInstance: AmbientLight | PointLight | DirectionalLight | HemisphereLight
            const color = this.parseColor(light.color)
            const intensity = light.intensity
            if(light.type === 'ambient') {
                lightInstance = new AmbientLight(color, intensity)
            } else if(light.type === 'directional') {
                lightInstance = new DirectionalLight(color, intensity)
                light.castShadow = light.castShadow || false
                Object3dParser.position(lightInstance, light.parameters)
                Object3dParser.rotate(lightInstance, light.parameters)
            } else if(light.type === 'hemisphere') {
                lightInstance = new HemisphereLight(color, this.parseColor(light.groundColor), intensity)
                Object3dParser.position(lightInstance, light.parameters)
            } else { // point or undefined
                lightInstance = new PointLight(color, intensity, light.distance, light.decay)
                if(light.power) {
                    lightInstance.power = light.power
                }
                lightInstance.castShadow = light.castShadow ?? false
                Object3dParser.position(lightInstance, light.parameters)
            }

            if(light.name) {
                lightInstance.name = light.name
            }

            return lightInstance
        }
    }
    public static parseAmbientLight(light: AmbientLight | AmbientLightJson) : AmbientLight {
        if(light instanceof AmbientLight) {
            return light
        }
        return new AmbientLight(this.parseColor(light.color), light.intensity)
    }
    public static parseColor(color?: string | Color | ColorRepresentation): Color {
        if(color instanceof Color) {
            return color
        } else {
            return new Color(color || 'white')
        }
    }
}