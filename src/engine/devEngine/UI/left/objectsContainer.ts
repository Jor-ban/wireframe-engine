import { ListElement } from './listElement';
import { Object3D } from "three";
import { ChangeDetector } from "../../changeDetector";
import { SceneFolder } from "../../types/SceneFolder.type";

export class ObjectsContainer {
    constructor(
        private children: Object3D[],
        private container: HTMLElement
    ) {
        ChangeDetector.addedObject$.subscribe((obj) => {
            if(obj.parent?.children === this.children) {
                this.update()
            }
        })
        this.update()
    }
    update() {
        this.container.innerHTML = ''
        for(const obj of this.children as SceneFolder[]) {
            if(obj instanceof Object3D) {
                new ListElement(obj, this.container, this)
            }
        }
    }
}