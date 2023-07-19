// @ts-nocheck
import {Object3D} from "three";
export abstract class WhenReady<T extends Object3D = Object3D> {
    constructor() {
        if(!this.__proto__.__onInitListeners) this.__proto__.__onInitListeners = []
    }
    public whenInstanceReady(cb: (obj: T) => void) {
        if(!this.__proto__.__object) {
            this.__proto__.__onInitListeners.push(cb)
        } else {
            cb(this.__proto__.__object)
        }
    }

    public static whenReady(cb: (obj: Object3D) => void) {
        if(!this.prototype.__object) {
            this.prototype.__onInitListeners.push(cb)
        } else {
            cb(this.prototype.__object)
        }
    }
}