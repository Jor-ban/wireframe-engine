import {Nameable, Positionable, Rotatable} from "./Custom3dObject.type";
import {Color} from "three";

export type CustomAmbientLight = Nameable & {
    intensity ?: number
    color ?: string | Color
}

export type CustomPointLight = CustomAmbientLight & {
    castShadow ?: boolean
    decay ?: number
    distance?: number
    power ?: number
    parameters?: Positionable
}
export type CustomDirectionalLight = CustomAmbientLight & {
    castShadow ?: boolean
    parameters?: Positionable & Rotatable
}
export type CustomHemisphereLight = CustomAmbientLight & {
    groundColor: string | Color
    parameters?: Positionable
}

export type CustomLight = (CustomAmbientLight & CustomPointLight & CustomDirectionalLight & CustomHemisphereLight) & {
    type?: 'ambient' | 'point' | 'directional' | 'hemisphere'
}