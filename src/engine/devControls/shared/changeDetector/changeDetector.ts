import {Subject} from "rxjs";
import {Mesh, Object3D} from "three";

export class ChangeDetector {
    static clickedObject$: Subject<Mesh | Object3D | null> = new Subject()
    static hoveredObject$: Subject<Mesh | Object3D | null> = new Subject()
    static addedObject$: Subject<Object3D> = new Subject()
    static removedObject$: Subject<Object3D> = new Subject()
}
