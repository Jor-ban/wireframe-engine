export interface Nameable {
    name ?: string
}
export interface Positionable {
    x?: number
    y?: number
    z?: number
}
export interface Rotatable {
    rotateX?: number
    rotateY?: number
    rotateZ?: number
}
export interface Scalable {
    scaleX?: number
    scaleY?: number
    scaleZ?: number
}

export type Custom3dObjectType = Nameable & Positionable & Rotatable & Scalable & {
    castShadow?: boolean
    visible?: boolean
    receiveShadow?: boolean
    frustumCulled?: boolean
}