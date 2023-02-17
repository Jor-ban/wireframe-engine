import { MovedObjectInterface } from './types/movedObject.interface';
import { Subject } from "rxjs";
import { Object3D } from "three";
import { InstrumentsEnum } from "../types/Instruments.enum";
import { WireframeMesh } from "../../lib";
import { ObjectUpdateInterface } from "./types/objectUpdate.interface";
import { DeleteSubject } from "./deleteSubject";

export class ChangeDetector {
    static clickedObject$: Subject<WireframeMesh | Object3D | null> = new Subject()
    static hoveredObject$: Subject<WireframeMesh | Object3D | null> = new Subject()
    static addedObject$: Subject<Object3D> = new Subject()
    static movedObject$: Subject<MovedObjectInterface> = new Subject()
    static removedObject$: DeleteSubject<Object3D> = new DeleteSubject()
    static activeInstrument$: Subject<InstrumentsEnum> = new Subject()
    static activeObjectUpdated$: Subject<ObjectUpdateInterface> = new Subject()
}

ChangeDetector.activeObjectUpdated$.subscribe((update) => {
    if(update.changedPropertyName === 'visible') {
        update.target.visible = Boolean(update.value)
    }
})