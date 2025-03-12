import { Object3D } from "three";
import { OnInit } from "⚙️/examples/extentions/decorators/types/on-init-hooks.type";

export type DecorationTargetInterface<T extends Object3D = Object3D> = Function & Partial<OnInit<T>> & {
    prototype: T & {
        __onInitListeners ?: ((object: T) => void)[]
        __object ?: T
        __asyncLoaded ?: boolean
    }
}