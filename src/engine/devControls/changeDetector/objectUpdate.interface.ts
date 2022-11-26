import {Object3D} from "three";

export interface ObjectUpdateInterface {
    target: Object3D
    changedPropertyName: string
    value: unknown
}