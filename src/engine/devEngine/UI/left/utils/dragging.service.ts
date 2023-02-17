import { ListElement } from './../listElement';
import { filter } from "rxjs"
import { Group, Object3D } from "three"
import { WMesh } from "⚙️/lib"
import { ChangeDetector } from "⚙️/devEngine/changeDetector"
import { getElementText } from "./getObjectIcon"
import { dispose } from '⚙️/shared/dispose';

class DraggingServiceFactory {
    private objectMap: WeakMap<Object3D, ListElement> = new WeakMap()
    private draggingElement: ListElement | null = null
    private draggingElementIndex = -1
    private clickedElement: HTMLElement | null = null
    private clickedObject: Object3D | null = null

    constructor() {
        ChangeDetector.clickedObject$.subscribe((obj: Object3D | WMesh | null) => {
            if(obj) {
                this.clickedObject = obj
                const element = this.objectMap.get(obj)
                if(element) {
                    this.clickedElement?.classList.remove('__wireframe-active')
                    element?.container.classList.add('__wireframe-active')
                    this.clickedElement = element?.container
                }
            }
        })
        ChangeDetector.activeObjectUpdated$
            .pipe(
                filter(({changedPropertyName}) => changedPropertyName === 'name')
            ).subscribe(({target}) => {
                const el = this.clickedElement?.getElementsByClassName('__wireframe-object-text')[0]
                if(el instanceof HTMLElement) {
                    el.innerHTML = getElementText(target)
                }
            })
        ChangeDetector.removedObject$.subscribe((obj: Object3D) => {
            this.deleteObject(obj)
            this.objectMap.get(obj)?.updateParent()
        })
    }
    addEvents(el: ListElement) {
        this.objectMap.set(el.object, el)
        if(el.object === this.clickedObject) {
            el.container.classList.add('__wireframe-active')
        }
        el.container.addEventListener('click', () => {
            ChangeDetector.clickedObject$.next(el.object)
        })
        el.container.addEventListener('dragstart', () => {
            this.draggingElement = el
            this.draggingElementIndex = el.object?.parent?.children.indexOf(el.object) ?? -1
        })
        el.container.addEventListener('dragend', (e) => {
            this.draggingElement = null
        })
        el.container.addEventListener('dragenter', (e) => {
            e.preventDefault()
            el.container.classList.add('__wireframe-dragover')
        })
        el.container.addEventListener('dragleave', (e) => {
            e.preventDefault()
            el.container.classList.remove('__wireframe-dragover')
        })
        el.container.addEventListener('drop', (e) => {
            e.preventDefault()
            el.container.classList.remove('__wireframe-dragover')
            if(this.draggingElement) {
                const draggingObject = this.draggingElement?.object
                const targetObject = el.object
                if(!draggingObject?.parent || !targetObject?.parent || draggingObject === targetObject) return
                if(targetObject instanceof Group) {
                    draggingObject.parent.children.splice(this.draggingElementIndex, 1)
                    targetObject.add(draggingObject)
                    this.draggingElement?.updateParent()
                } else if(draggingObject.parent !== targetObject.parent) {
                    draggingObject?.parent?.remove(draggingObject)
                    targetObject?.parent?.add(draggingObject)
                    this.draggingElement?.updateParent()
                } else {
                    draggingObject.parent.children.splice(this.draggingElementIndex, 1)
                    targetObject.parent.children.splice(targetObject.parent.children.indexOf(targetObject), 0, draggingObject)
                }
                el.updateParent()
            }
        })
        el.container.addEventListener('dragover', (e) => {
            e.preventDefault()
        })
        el.container.addEventListener('mouseover', () => {
            ChangeDetector.hoveredObject$.next(el.object)
        })
    }
    dropTo(dropTo: Object3D, index?: number): void {
        if(!this.draggingElement) {
            console.warn("[DraggingService -> dropTo] this error must not appear, draggingObject is null")
            return;
        }
        if(index !== undefined) {
            this.draggingElement.object.parent?.children.splice(this.draggingElementIndex, 1)
            dropTo?.children.splice(index, 0, this.draggingElement.object)
            this.draggingElement.updateParent()
        } else {
            dropTo.add(this.draggingElement.object)
        }
    }
    deleteObject(obj: Object3D) {
        const element = this.objectMap.get(obj)
        if(element) {
            element?.container.parentNode?.removeChild(element?.container)
        }
        dispose(obj)
        this.clickedElement = null
    }
}
export const DraggingService = new DraggingServiceFactory()