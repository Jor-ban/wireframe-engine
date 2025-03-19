import {EngineInterface, EnginePluginInterface} from "@/engine";
import gsap from "gsap";
import {BehaviorSubject} from "rxjs";
import {Positionable} from "⚙️/lib/parsers/types/Object3DJson.type";
import {Camera, Vector3} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export const cameraParameters = new BehaviorSubject<Positionable & { lookAt ?: Vector3 }>({})

class CameraPluginFactory implements EnginePluginInterface {
    private lastLookAt = new Vector3(0, 0, 0)
    getNewInstance(): EnginePluginInterface {
        return new CameraPluginFactory();
    }
    afterCreate(engine: EngineInterface): void {
        engine.camera.lookAt(this.lastLookAt);
        this.setOrbitCenter(engine.orbitControls, engine.camera, this.lastLookAt)
        cameraParameters.subscribe(params => {
            if(params.x) {
                engine.camera.position.setX(params.x);
            }
            if(params.y) {
                engine.camera.position.setY(params.y);
            }
            if(params.z) {
                engine.camera.position.setZ(params.z);
            }
            if(params.lookAt) {
                gsap.to(this.lastLookAt, {
                    duration: 1,
                    x: params.lookAt.x,
                    y: params.lookAt.y,
                    z: params.lookAt.z,
                    onUpdate: () => {
                        engine.camera.lookAt(this.lastLookAt)
                        this.setOrbitCenter(engine.orbitControls, engine.camera, this.lastLookAt)
                    },
                    onComplete: (data) => {
                        this.lastLookAt = params.lookAt
                    }
                })
            }
        })
    }

    private setOrbitCenter(controls: OrbitControls, camera: Camera, newTarget: Vector3): void {
        const offset = new Vector3().subVectors(newTarget, controls.target);

        // Move camera position by the offset
        camera.position.add(offset);

        // Move the controls target by the same offset
        controls.target.copy(newTarget);

        // Update the controls
        controls.update();
    }

}

export const CameraPlugin = new CameraPluginFactory()