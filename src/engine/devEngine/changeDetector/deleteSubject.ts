import {Subject} from "rxjs";
import {Mesh, Object3D} from "three";
import {ChangeDetector} from ".";

export class DeleteSubject<T extends Object3D> extends Subject<T> {
    constructor() {
        super();
    }
    next(value: T) {
        let name: string = 'this Object'
        if (value.name) {
            name = value.name
        } else if (value instanceof Mesh) {
            name = value.geometry.type
        }
        if(window.confirm(`Are you sure you want to delete ${name}?`)) {
            super.next(value);
            ChangeDetector.hoveredObject$.next(null)
            ChangeDetector.clickedObject$.next(null)
        }
    }
}