import {Vector3} from "three";

export type Nameable = {
    name ?: string
}
export type Positionable = Vector3 | {
    x?: number
    y?: number
    z?: number
}
export type Rotatable = {
    rotateX?: number
    rotateY?: number
    rotateZ?: number
}
export type Scalable = {
    scaleX?: number
    scaleY?: number
    scaleZ?: number
}

export type Custom3dObjectParameters = Positionable & Rotatable & Scalable & {
    castShadow?: boolean
    visible?: boolean
    receiveShadow?: boolean
    frustumCulled?: boolean
}