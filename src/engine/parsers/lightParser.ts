import {AmbientLight, Color, ColorRepresentation, DirectionalLight, HemisphereLight, Light, PointLight} from "three";
import {CustomAmbientLight, CustomLight} from "../types/CustomLight.interface";
import {MeshParser} from "./MeshParser";

export class LightParser {
    static parse(light: Light | CustomLight): Light {
        if(light instanceof Light) {
            return light
        } else {
            let lightInstance: AmbientLight | PointLight | DirectionalLight | HemisphereLight
            const color = this.parseColor(light.color)
            const intensity = light.intensity
            if(light.type === 'ambient') {
                lightInstance = new AmbientLight(color, intensity)
            } else if(light.type === 'point' || light.type === undefined) {
                lightInstance = new PointLight(color, intensity, light.distance, light.decay)
                if(light.power) {
                    lightInstance.power = light.power
                }
                lightInstance.castShadow = light.castShadow
                MeshParser.position(lightInstance, light.parameters)
            } else if(light.type === 'directional') {
                lightInstance = new DirectionalLight(color, intensity)
                light.castShadow = light.castShadow || false
                MeshParser.position(lightInstance, light.parameters)
                MeshParser.rotate(lightInstance, light.parameters)
            } else if(light.type === 'hemisphere') {
                lightInstance = new HemisphereLight(color, this.parseColor(light.groundColor), intensity)
                MeshParser.position(lightInstance, light.parameters)
            }

            if(light.name) {
                lightInstance.name = light.name
            }

            return lightInstance
        }
    }
    public static parseAmbientLight(light: AmbientLight | CustomAmbientLight) : AmbientLight {
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