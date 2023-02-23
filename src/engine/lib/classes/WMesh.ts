import { MeshParser } from '⚙️/lib/parsers/MeshParser';
import {BufferGeometry, Mesh, Object3D} from "three";
import {Material} from "three/src/materials/Material";
import { Stringifyable } from './types/stringifyable.interface';
import { MeshJson } from '../parsers/types/MeshJson.type';

export class WMesh<
    TGeometry extends BufferGeometry = BufferGeometry,
    TMaterial extends Material | Material[] = Material | Material[],
> extends Mesh<TGeometry, TMaterial> implements Stringifyable {
    public isWireframe: true = true;

    from(o: Object3D | MeshJson) {
        if(o instanceof Object3D) {
            return o
        }
        return MeshParser.parse(o)
    }
    toJson(): string {
        return ''
    }
}