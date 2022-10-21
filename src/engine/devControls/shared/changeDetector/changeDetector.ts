import {Subject} from "rxjs";
import {Mesh, Object3D} from "three";
import {InstrumentsEnum} from "../../types/Instruments.enum";
import {WireframeMesh} from "../../../lib/WireframeMesh";

export class ChangeDetector {
    static clickedObject$: Subject<WireframeMesh | Object3D | null> = new Subject()
    static hoveredObject$: Subject<WireframeMesh | Object3D | null> = new Subject()
    static addedObject$: Subject<Object3D> = new Subject()
    static removedObject$: Subject<Object3D> = new Subject()
    static activeInstrument$: Subject<InstrumentsEnum> = new Subject()
}
