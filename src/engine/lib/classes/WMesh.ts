import { BufferGeometry, Mesh } from "three";
import { Material } from "three/src/materials/Material";

export class WMesh<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[],
> extends Mesh<TGeometry, TMaterial> {
    public isWireframeMesh: true = true;
}