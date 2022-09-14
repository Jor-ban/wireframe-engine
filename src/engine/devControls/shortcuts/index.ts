import {deleteObjectFromMap} from "../shared/objectMap";
import {clickedObject$} from "../shared/activeObjects";
import {Mesh, Object3D} from "three";

export class Shortcuts {
    static init(): void {
        let activeElement: Object3D | null = null;
        clickedObject$.subscribe((obj: Mesh | Object3D | null) => {
            activeElement = obj;
        })
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            if(e.key === 'Delete' && activeElement) {
                deleteObjectFromMap(activeElement);
            }
        })
    }
}