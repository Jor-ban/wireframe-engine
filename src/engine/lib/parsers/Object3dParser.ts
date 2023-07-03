import {Object3D} from "three";
import {Object3dJSON, Positionable, Rotatable, Scalable} from "⚙️/lib/parsers/types/Object3DJson.type";

export class Object3dParser {
    public static setParameters(mesh: Object3D, parameters: Object3dJSON | undefined): Object3D {
        this.position(mesh, parameters)
        this.scale(mesh, parameters)
        this.rotate(mesh, parameters)
        return mesh
    }
    public static position(object: Object3D, positions?: Positionable): Object3D {
        if(positions) {
            object.position.set(positions.x ?? 0, positions.y ?? 0, positions.z ?? 0);
        }
        return object
    }
    public static scale(object: Object3D, scales?: Scalable): Object3D {
        if(scales) {
            object.scale.set(scales.scaleX ?? 1, scales.scaleY ?? 1, scales.scaleY ?? 1)
        }
        return object
    }
    public static rotate(object: Object3D, rotation: Rotatable | undefined): Object3D {
        if(rotation) {
            object.rotation.set(
                rotation.rotateX ? rotation.rotateX * Math.PI / 180 : 0,
                rotation.rotateY ? rotation.rotateY * Math.PI / 180 : 0,
                rotation.rotateZ ? rotation.rotateZ * Math.PI / 180 : 0
            )
        }
        return object
    }
}