import {
    Group,
    Light,
    Object3D,
    Scene
} from "three";
import {FolderApi} from "tweakpane";
import {SceneFolder} from "./leftControls";
import {ChangeDetector} from "../changeDetector/changeDetector";
import {WireframeMesh} from "../../lib";
import {dispose} from "../../utils/dispose";

export class ElementsListControls {


    // TODO refactor it with web components and update it when update is triggered


    private clickedElement: HTMLElement | undefined = undefined
    private objectMap = new WeakMap<Object3D, HTMLElement>();
    constructor(scene: Scene, folder: FolderApi) {
        ChangeDetector.clickedObject$.subscribe((obj: Object3D | WireframeMesh | null) => {
            if(obj) {
                const element = this.objectMap.get(obj)
                this.clickedElement?.classList.remove('__wireframe-active')
                element?.classList.add('__wireframe-active')
                this.clickedElement = element
            }
        })
        ChangeDetector.addedObject$.subscribe(() => this.parseScene(scene.children, folder))
        ChangeDetector.removedObject$.subscribe((obj: Object3D) => {
            this.deleteObject(obj)
            this.parseScene(scene.children, folder)
        })
        this.parseScene(scene.children, folder)
    }
    parseScene(children: Object3D[], folder: FolderApi) {
        folder.element.classList.add('__wireframe-elements-list-controls-container')
        folder.element.innerHTML = ''
        for(const obj of children as SceneFolder[]) {
            if(obj instanceof Group) {

            } else if(obj instanceof Object3D) {
                if(
                    obj instanceof WireframeMesh ||
                    obj instanceof Light
                ) {

                    const text = document.createElement('div')
                    text.classList.add('__wireframe-object-text')
                    if(obj instanceof WireframeMesh && obj.geometry) {
                        text.innerText = obj.geometry.type.replace("Geometry", "")
                    } else if(obj instanceof Light) {
                        text.innerText = obj.type
                    } else {
                        text.innerText = obj.name || obj.type
                    }

                    text.addEventListener('mouseover', () => {
                        ChangeDetector.hoveredObject$.next(obj)
                    })

                    const showButton = document.createElement("button")
                    showButton.innerHTML = "👁"
                    showButton.addEventListener("click",() => {
                        if(obj.visible) {
                            obj.visible = false
                            showButton.innerText = "◡"
                        } else {
                            obj.visible = true
                            showButton.innerText = "👁"
                        }
                    })

                    const deleteButton = document.createElement("button")
                    deleteButton.innerHTML = "x"
                    deleteButton.addEventListener("click", () => {
                        ChangeDetector.removedObject$.next(obj)
                    })

                    const div = document.createElement("div")
                    div.classList.add('__wireframe-object-select')
                    div.appendChild(text)
                    div.appendChild(showButton)
                    div.appendChild(deleteButton)
                    folder.element.appendChild(div)
                    div.addEventListener('click', () => {
                        this.clickedElement?.classList.remove('__wireframe-active')
                        div.classList.add('__wireframe-active')
                        this.clickedElement = div
                        ChangeDetector.clickedObject$.next(obj)
                    })
                    this.objectMap.set(obj, div)
                }
            }
        }
    }
    deleteObject(obj: Object3D) {
        const element = this.objectMap.get(obj)
        if(element) {
            element.parentNode?.removeChild(element)
        }
        dispose(obj)
        this.clickedElement = undefined
    }
}