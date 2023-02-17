import {Object3D} from "three";
import { WMesh } from "⚙️/lib";

export interface ObjectUpdateInterface {
    target: Object3D
    changedPropertyName: keyof WMesh
    value: unknown
}
