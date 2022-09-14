import {Object3D} from "three";
import {dispose} from "../../utils/dispose";
import {clickedObject$} from "./activeObjects";

export const htmlObjectsMap = new WeakMap<Object3D, HTMLElement>();

export function deleteObjectFromMap(obj: Object3D) {
    if(window.confirm(`Are you sure you want to delete ${obj.name}?`)) {
        const element = htmlObjectsMap.get(obj)
        if(element) {
            element.parentNode?.removeChild(element)
        }
        dispose(obj)
        clickedObject$.next(null)
    }
}