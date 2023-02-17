import {Object3D} from "three";
import { WireframeMesh } from "⚙️/lib";

export interface ObjectUpdateInterface {
    target: Object3D
    changedPropertyName: keyof WireframeMesh
    value: unknown
}
