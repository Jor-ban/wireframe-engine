import * as THREE from "three";
import {WhenReady} from "⚙️/examples/utilClasses/when-ready";
import {EngineInterface} from "⚙️/types/Engine.interface";

export abstract class WireframeController {
    protected constructor(
        private __engine: EngineInterface
    ) {}
    provide(...objects: (Object | THREE.Object3D)[]) {
        objects.forEach((object) => {
            if(object instanceof THREE.Object3D) {
                this.__engine.add(object)
            } else if('whenReady' in object && typeof object.whenReady === 'function') {
                Object.create(object).whenReady((mesh) => {
                    this.__engine.add(mesh)
                })
            } else {
                throw new Error('Invalid object, it should be class extending class WhenReady or instanceof THREE.Object3D')
            }
        })
    }
}