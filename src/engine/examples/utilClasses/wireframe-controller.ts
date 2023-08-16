import * as THREE from "three";
import {EngineInterface} from "⚙️/types/Engine.interface";

export interface ProvidingObjectInterface {
    prototype: {
        __object?: THREE.Object3D
        __onInitListeners?: ((mesh: THREE.Object3D) => void)[]
    }
}

export abstract class WireframeController {
    protected constructor(
        private __engine: EngineInterface
    ) {}
    provide(...objects: (Object | THREE.Object3D)[]) {
        provideTo(this.__engine, objects)
    }
}

export function provideTo(scene: THREE.Scene | THREE.Group | EngineInterface, objects: (Object | THREE.Object3D)[]) {
    objects.forEach((object) => {
        if(object instanceof THREE.Object3D) {
            scene.add(object)
            return
        }
        const classObject = object as ProvidingObjectInterface
        if(classObject.prototype?.__object && classObject.prototype.__object instanceof THREE.Object3D) {
            scene.add(classObject.prototype.__object)
        } else {
            if(classObject.prototype && !classObject.prototype.__onInitListeners){
                classObject.prototype.__onInitListeners = []
            }
            classObject.prototype?.__onInitListeners.push((mesh: THREE.Object3D) => {
                scene.add(mesh)
            })
        }
    })
}