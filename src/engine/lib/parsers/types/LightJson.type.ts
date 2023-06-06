import {Nameable, Positionable, Rotatable, UuidSettable} from "./Object3DJson.type";
import {Color} from "three";

export type AmbientLightJson = Nameable & UuidSettable & {
    intensity ?: number
    color ?: string | Color
}

export type PointLightJson = AmbientLightJson & {
    castShadow ?: boolean
    decay ?: number
    distance?: number
    power ?: number
}
export type DirectionalLightJson = AmbientLightJson & {
    castShadow ?: boolean
}
export type HemisphereLightJson = AmbientLightJson & {
    groundColor ?: string | Color
}

export type LightJson = (AmbientLightJson & PointLightJson & DirectionalLightJson & HemisphereLightJson) & {
    type?: 'ambient' | 'point' | 'directional' | 'hemisphere'
    parameters?: Positionable & Rotatable
}