import { BufferGeometry, Mesh } from "three";
import { Material } from "three/src/materials/Material";

export class WMesh<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[],
> extends Mesh<TGeometry, TMaterial> {
    public isWireframeMesh: true = true;
    __clickable = true

    static from(mesh: Mesh) {
        // @ts-ignore
        mesh.__proto__ = WMesh.prototype
        const wMesh = mesh as WMesh
        wMesh.isWireframeMesh = true
        return wMesh
    }
}