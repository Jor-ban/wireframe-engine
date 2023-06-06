import { Object3dJSON, Nameable, UuidSettable } from "./Object3DJson.type";
import { BufferGeometry, Material } from "three";
import { GeometryJson } from "./GeometryJson.type";
import { MaterialJson } from "./MaterialJson.type";

export type ComposedMeshJson = Nameable & UuidSettable & {
    parameters?: Object3dJSON
    geometry?: GeometryJson | BufferGeometry
    material?: MaterialJson | Material
}
export type PathToMeshJson = Nameable & UuidSettable & {
    parameters?: Object3dJSON
    url?: string
}

export type MeshJson = ComposedMeshJson & PathToMeshJson