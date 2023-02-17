import {Nameable, Positionable, Rotatable, UuidSettable} from "./Object3DJson.type";

export type PerspectiveCameraSettings = Nameable & UuidSettable & {
    fov ?: number
    aspect ?: number
    near ?: number
    far ?: number
    type ?: 'perspectiveCamera'
}

export type OrthographicCameraSettings = Nameable  & UuidSettable & {
    left ?: number,
    right ?: number,
    top ?: number,
    bottom ?: number,
    near ?: number,
    far ?: number,
    type: 'orthographicCamera'
}

export type CameraJson = (PerspectiveCameraSettings | OrthographicCameraSettings) & {
    parameters?: Positionable & Rotatable
}