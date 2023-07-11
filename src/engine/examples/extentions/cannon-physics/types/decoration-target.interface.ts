import { Object3D } from "three";
import { Body } from "objects/Body";

export type DecorationTargetInterface<T extends Object3D = Object3D> = Function & {
    onInit?: (object: T) => void
    prototype: T & {
        __onInitListeners ?: ((object: T) => void)[]
        __object ?: T
        __asyncLoaded ?: boolean
        __rigidBody ?: Body
    }
}