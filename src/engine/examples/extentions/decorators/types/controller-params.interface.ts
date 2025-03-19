import {Object3D} from "three";

export type ControllerParamsInterface = {
    autoMount ?: boolean
    objects ?: (Function | Object3D)[]
    controllers ?: Function[]
}