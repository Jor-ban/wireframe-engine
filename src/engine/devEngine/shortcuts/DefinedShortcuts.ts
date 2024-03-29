import {Mesh, Object3D} from "three";
import {ChangeDetector} from "../changeDetector";
import {KeyEvent} from "./index";
import {InstrumentsEnum} from "../types/Instruments.enum";

export class DefinedShortcuts {
    static activeElement: Object3D | null = null;
    static init() {
        ChangeDetector.clickedObject$.subscribe((obj: Mesh | Object3D | null) => {
            this.activeElement = obj;
        })
        KeyEvent.key('Delete').subscribe(() => {
            if(this.activeElement !== null) {
                ChangeDetector.removedObject$.next(this.activeElement)
                ChangeDetector.clickedObject$.next(null)
                ChangeDetector.hoveredObject$.next(null)
                this.activeElement = null
            }
        })
        KeyEvent.key('x', {CtrlPressed : false, ShiftPressed: false, AltPressed: false}).subscribe(() => {
            ChangeDetector.activeInstrument$.next(InstrumentsEnum.pointer)
        })
        KeyEvent.key('v', {CtrlPressed : false, ShiftPressed: false, AltPressed: false}).subscribe(() => {
            ChangeDetector.activeInstrument$.next(InstrumentsEnum.move)
        })
        KeyEvent.key('r', {CtrlPressed : false, ShiftPressed: false, AltPressed: false}).subscribe(() => {
            ChangeDetector.activeInstrument$.next(InstrumentsEnum.rotation)
        })
        KeyEvent.key('s', {CtrlPressed : false, ShiftPressed: false, AltPressed: false}).subscribe(() => {
            ChangeDetector.activeInstrument$.next(InstrumentsEnum.scale)
        })
    }
}