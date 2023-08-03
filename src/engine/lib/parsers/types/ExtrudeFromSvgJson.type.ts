import { Object3dJSON } from "⚙️/lib/parsers/types/Object3DJson.type";
import { MaterializableJson } from "⚙️/lib/parsers/types/MeshJson.type";
import { ExtrudeGeometryOptions } from "three/src/geometries/ExtrudeGeometry";

export type ExtrudeFromSvgJson = MaterializableJson & Object3dJSON & {
    svgContent?: string
    url?: string
    parameters?: Object3dJSON
    extrudeOptions?: ExtrudeGeometryOptions
}