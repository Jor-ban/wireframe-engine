import {Vector3} from "three";

export type Nameable = {
    name ?: string
}
export type UuidSettable = {
    uuid ?: string
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
    scale?: number
    scaleX?: number
    scaleY?: number
    scaleZ?: number
}

export type Object3dJSON = Nameable & Positionable & Rotatable & Scalable & UuidSettable & {
    castShadow?: boolean
    visible?: boolean
    receiveShadow?: boolean
    frustumCulled?: boolean
}