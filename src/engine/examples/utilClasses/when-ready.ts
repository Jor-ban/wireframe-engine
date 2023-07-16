// @ts-nocheck
import {Object3D} from "three";
export abstract class WhenReady<T extends Object3D = Object3D> {
    constructor() {
        if(!this.__proto__.__onInitListeners) this.__proto__.__onInitListeners = []
        this.__proto__.__onInitListeners.push((obj: T) => {
            console.log(this.__proto__.__onInitListeners)
            this.__proto__.awaitingCallbacks.forEach((cb) => cb(obj))
        })
    }
    public whenReady(cb: (obj: T) => void) {
        if(!this.__proto__.__object) {
            this.__proto__.awaitingCallbacks.push(cb)
        } else {
            cb(this.__proto__.__object)
        }
    }
}