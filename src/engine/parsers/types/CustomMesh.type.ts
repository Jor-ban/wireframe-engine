import {Custom3dObjectParameters, Nameable} from "./Custom3dObject.type";
import {BufferGeometry, Material} from "three";
import { CustomGeometry } from "./CustomGeometry.type";
import { CustomMaterial } from "./CustomMaterial.type";

export type CustomComposedMesh = Nameable & {
    parameters?: Custom3dObjectParameters
    geometry?: CustomGeometry | BufferGeometry
    material?: CustomMaterial | Material
}
export type CustomGltfMesh = Nameable & {
    parameters?: Custom3dObjectParameters
    path?: string
}

export type CustomMesh = CustomComposedMesh & CustomGltfMesh