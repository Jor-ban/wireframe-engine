import {AmbientLight, AxesHelper, Group, Mesh, Object3D, OrthographicCamera, PerspectiveCamera, Scene} from "three";
import {FolderApi} from "tweakpane";
import {clickedObject$, hoveredObject$} from "../shared/activeObjects";
import {deleteObjectFromMap, htmlObjectsMap} from "../shared/objectMap";
import {SceneFolder} from "./leftControls";

export class ElementsListControls {
    private clickedElement: HTMLElement | undefined = undefined
    private objectMap !: WeakMap<Object3D, HTMLElement>
    constructor(scene: Scene, folder: FolderApi) {
        this.objectMap = htmlObjectsMap
        clickedObject$.subscribe((obj: Object3D | Mesh | null) => {
            if(obj) {
                const element = this.objectMap.get(obj)
                this.clickedElement?.classList.remove('__wireframe-active')
                element?.classList.add('__wireframe-active')
                this.clickedElement = element
            }
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
                    !(obj instanceof AxesHelper) &&
                    !(obj instanceof PerspectiveCamera) &&
                    !(obj instanceof OrthographicCamera) &&
                    !(obj instanceof AmbientLight) &&
                    obj.uuid !== "__wireframe-hoveredObject__" &&
                    obj.uuid !== "__wireframe-clickedObject__"
                ) {

                    const text = document.createElement('div')
                    text.classList.add('__wireframe-object-text')
                    text.innerText = obj.name || obj.type
                    text.addEventListener('mouseover', () => {
                        hoveredObject$.next(obj)
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
                    deleteButton.addEventListener("click", () => { this.deleteObject(obj) })

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
                        clickedObject$.next(obj)
                    })
                    this.objectMap.set(obj, div)
                }
            }
        }
    }
    deleteObject(obj: Object3D) {
        deleteObjectFromMap(obj)
        this.clickedElement = undefined
    }
}