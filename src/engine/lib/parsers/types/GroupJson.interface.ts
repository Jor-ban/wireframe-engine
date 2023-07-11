import {Object3dJSON} from "⚙️/lib/parsers/types/Object3DJson.type";
import {Object3D} from "three";
import {MeshJson} from "⚙️/lib/parsers/types/MeshJson.type";
import {LightJson} from "⚙️/lib/parsers/types/LightJson.type";

export type GroupJsonInterface = Object3dJSON & {
    children: (Object3D | MeshJson | LightJson)[], // array of objects)[], // array of objects
}