import {Nameable, Positionable, Rotatable} from "./Custom3dObject.type";

export type PerspectiveCameraSettings = Nameable & {
    fov ?: number
    aspect ?: number
    near ?: number
    far ?: number
    type ?: 'perspectiveCamera'
}

export type OrthographicCameraSettings = Nameable & {
    left ?: number,
    right ?: number,
    top ?: number,
    bottom ?: number,
    near ?: number,
    far ?: number,
    type: 'orthographicCamera'
}

export type CustomCamera = (PerspectiveCameraSettings | OrthographicCameraSettings) & {
    parameters?: Positionable & Rotatable
}