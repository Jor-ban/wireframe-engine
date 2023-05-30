import {Nameable, Positionable, Rotatable, UuidSettable} from "./Object3DJson.type";

export type PerspectiveCameraJson = Nameable & UuidSettable & {
    fov ?: number
    aspect ?: number
    near ?: number
    far ?: number
}

export type OrthographicCameraJson = Nameable  & UuidSettable & {
    left ?: number,
    right ?: number,
    top ?: number,
    bottom ?: number,
    near ?: number,
    far ?: number,
}

export type CameraJson = PerspectiveCameraJson & OrthographicCameraJson & {
    parameters?: Positionable & Rotatable
    type ?: 'perspectiveCamera' | 'orthographicCamera'
}