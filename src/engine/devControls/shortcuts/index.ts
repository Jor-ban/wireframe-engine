import {deleteObjectFromMap} from "../shared/objectMap";
import {Mesh, Object3D} from "three";
import {ChangeDetector} from "../shared/changeDetector/changeDetector";

export class Shortcuts {
    static init(): void {
        let activeElement: Object3D | null = null;
        ChangeDetector.clickedObject$.subscribe((obj: Mesh | Object3D | null) => {
            activeElement = obj;
        })
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            if(e.key === 'Delete' && activeElement) {
                deleteObjectFromMap(activeElement);
            }
        })
    }
}