import { __DevEngine } from './../../devEngine';
import { WireframeDropdown } from './../../utils/dropdown';
import { filter } from 'rxjs';
import {
    AmbientLight,
    BoxGeometry,
    Camera,
    CircleGeometry,
    ConeGeometry,
    CylinderGeometry,
    DirectionalLight,
    DodecahedronGeometry,
    Group,
    Light,
    Object3D,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    RingGeometry,
    Scene,
    SphereGeometry,
    SpotLight
} from "three";
import { SceneFolder } from "../../types/SceneFolder.type";
import { ChangeDetector } from "../../changeDetector/changeDetector";
import { WireframeMesh } from "../../../lib";
import { dispose } from "../../../shared/dispose";
import { icons } from '../../assets/icons';

import { getMeshAddingOptions } from '../../utils/MeshAddingOptions';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
export class ElementsListControls {

    private clickedElement: HTMLElement | undefined = undefined
    private objectMap = new WeakMap<Object3D, HTMLElement>();
    private elementMap = new WeakMap<HTMLElement, Object3D>();
    private scene: Scene
    private listContainer: HTMLElement
    private devCamera: PerspectiveCamera
    private draggingElement: HTMLElement | null = null
    private draggingElementIndex: number = -1

    constructor(engineState: __DevEngine, container: HTMLElement) {
        this.scene = engineState.scene
        if(!engineState.devCamera) throw new Error('devCamera is null \n This Error should not happen')
        this.devCamera = engineState.devCamera
        const header = this.createListHeader()
        this.listContainer = document.createElement('div')
        container.appendChild(header)
        container.appendChild(this.listContainer)
        this.listContainer.classList.add('__wireframe-elements-list-controls-container')
        this.parseElements(this.scene.children, this.listContainer)
        this.initListeners(this.listContainer)
    }
    parseElements(children: Object3D[], element: HTMLElement, deep: boolean = true) {
        element.innerHTML = ''
        for(const obj of children as SceneFolder[]) {
            if(obj instanceof Object3D) {
                if(
                    obj instanceof WireframeMesh ||
                    obj instanceof Group ||
                    obj instanceof Light ||
                    obj instanceof Camera && obj.uuid !== '__wireframe-dev-camera__'
                ) {

                    const container = document.createElement("div")
                    container.classList.add('__wireframe-object-select')
                    this.addElement(obj, container)
                    element.appendChild(container)
                    container.addEventListener('click', () => {
                        this.clickedElement?.classList.remove('__wireframe-active')
                        container.classList.add('__wireframe-active')
                        this.clickedElement = container
                        ChangeDetector.clickedObject$.next(obj)
                    })
                    this.objectMap.set(obj, container)
                    this.elementMap.set(container, obj)
                    if(obj instanceof Group) {
                        this.addGroupCollapse(obj, container, deep)
                    }
                }
            }
        }
    }
    initListeners(element: HTMLElement) {
        ChangeDetector.clickedObject$.subscribe((obj: Object3D | WireframeMesh | null) => {
            if(obj) {
                const element = this.objectMap.get(obj)
                this.clickedElement?.classList.remove('__wireframe-active')
                element?.classList.add('__wireframe-active')
                this.clickedElement = element
            }
        })
        ChangeDetector.addedObject$.subscribe(() => this.parseElements(this.scene.children, element))
        ChangeDetector.removedObject$.subscribe((obj: Object3D) => {
            this.deleteObject(obj)
            this.parseElements(this.scene.children, element)
        })
        ChangeDetector.activeObjectUpdated$
            .pipe(filter(({changedPropertyName}) => changedPropertyName === 'name'))
            .subscribe(({target}) => {
                const el = this.clickedElement?.getElementsByClassName('__wireframe-object-text')[0]
                if(el instanceof HTMLElement) {
                    el.innerHTML = this.getElementText(target)
                }
            })
    }
    private createListHeader(): HTMLElement {
        const headerElement: HTMLElement = document.createElement('div')
        headerElement.classList.add('__wireframe-elements-header')
        // title
        const title = document.createElement('span')
        title.innerHTML = "Objects List"
        headerElement.appendChild(title)
        // buttons
        const buttonsRow = document.createElement('div')
        buttonsRow.classList.add('__wireframe-elements-buttons-row')
        headerElement.appendChild(buttonsRow)
        // group button
        const groupBtn = document.createElement('button')
        groupBtn.title = 'Add Group'
        const groupBtnImg: HTMLImageElement = document.createElement('img')
        groupBtnImg.src = icons.addGroup
        groupBtn.appendChild(groupBtnImg)
        groupBtn.addEventListener('click', () => {
            const group = new Group()
            group.name = 'New Group'
            this.scene.add(group)
            console.log(this.scene)
            ChangeDetector.addedObject$.next(group)
        })
        buttonsRow.appendChild(groupBtn)
        // object button
        const objectBtn = document.createElement('button')
        objectBtn.title = 'Add 3D Object'
        const objectBtnImg: HTMLImageElement = document.createElement('img')
        objectBtnImg.src = icons.addIcon
        objectBtn.appendChild(objectBtnImg)
        if(!this.devCamera) throw new Error('Dev camera is not defined')
        new WireframeDropdown(buttonsRow, objectBtn, getMeshAddingOptions(this.scene, this.devCamera))

        return headerElement
    }
    private addGroupCollapse(group: Group, container: HTMLElement, deep: boolean) {
        const dropDownContainer = document.createElement('div')
        dropDownContainer.classList.add('__wireframe-elements-group-dropdown')
        container.parentNode?.appendChild(dropDownContainer)
        dropDownContainer.appendChild(container)
        const childElementsContainer = document.createElement('div')
        dropDownContainer.appendChild(childElementsContainer)
        childElementsContainer.classList.add('__wireframe-elements-group-dropdown-children')
        childElementsContainer.classList.add('__wireframe-d-none')
        container.addEventListener('click', () => {
            childElementsContainer.classList.toggle('__wireframe-d-none')
        })
        if(deep) {
            this.parseElements(group.children, childElementsContainer)
        }
    }
    private addElement(obj: Object3D, container: HTMLElement) {
        const text = document.createElement('div')
        text.classList.add('__wireframe-object-text')
        text.innerHTML = this.getElementText(obj)
        container.draggable = true
        container.addEventListener('dragstart', (e) => {
            this.draggingElement = container
            const object = this.elementMap.get(container)
            this.draggingElementIndex = object?.parent?.children.indexOf(object) ?? -1
        })
        container.addEventListener('dragend', (e) => {
            this.draggingElement = null
        })
        container.addEventListener('dragenter', (e) => {
            e.preventDefault()
            container.classList.add('__wireframe-dragover')
        })
        container.addEventListener('dragleave', (e) => {
            e.preventDefault()
            container.classList.remove('__wireframe-dragover')
        })
        container.addEventListener('dragover', (e) => {
            e.preventDefault()
        })
        container.addEventListener('drop', (e) => {
            e.preventDefault()
            container.classList.remove('__wireframe-dragover')
            console.log(this.draggingElement, container)
            console.log(this.draggingElementIndex)
        })

        container.appendChild(text)
        const showButton = document.createElement("button")
        showButton.innerHTML = "👁"
        showButton.addEventListener("click", () => {
            if(obj.visible) {
                obj.visible = false
                showButton.innerText = "◡"
            } else {
                obj.visible = true
                showButton.innerText = "👁"
            }
        })

        const optionsButton = document.createElement("button")
        optionsButton.innerHTML = "⋮"
        new WireframeDropdown(container, optionsButton, [
            {
                name: "Delete",
                onclick: () => ChangeDetector.removedObject$.next(obj)
            }, {
                name: "Visibility",
                onclick: () => {
                    if(obj.visible) {
                        obj.visible = false
                        showButton.innerText = "◡"
                    } else {
                        obj.visible = true
                        showButton.innerText = "👁"
                    }
                }
            }, {
                name: "Change Name",
                onclick: () => {
                    const newName = prompt("Enter new name", obj.name)
                    if(newName) {
                        obj.name = newName
                        ChangeDetector.activeObjectUpdated$.next({
                            changedPropertyName: 'name',
                            value: newName,
                            target: obj
                        })
                    }
                }
            }
        ])

        container.appendChild(showButton)
        container.appendChild(optionsButton)
    }
    private getElementText(obj: Object3D): string {
        let iconText = '<img src="'
        if(obj instanceof Group) {
            iconText += icons.group
        } else if(obj instanceof Camera) {
            iconText += icons.camera
        } else if(obj instanceof Light) {
            if(obj instanceof AmbientLight) {
                iconText += icons.ambientLight
            } else if(obj instanceof PointLight) {
                iconText += icons.pointLight
            } else if(obj instanceof SpotLight) {
                iconText += icons.spotLight
            } else if(obj instanceof DirectionalLight) {
                iconText += icons.directionalLight
            } else {
                iconText += icons.hemisphereLight
            }
        } else if(obj instanceof WireframeMesh) {
            const geometry = obj.geometry
            if(geometry instanceof BoxGeometry) {
                iconText += icons.box
            } else if(geometry instanceof CircleGeometry) {
                iconText += icons.circle
            } else if(geometry instanceof ConeGeometry) {
                iconText += icons.cone
            } else if (geometry instanceof SphereGeometry) {
                iconText += icons.sphere
            } else if(geometry instanceof PlaneGeometry) {
                iconText += icons.plane
            } else if (geometry instanceof CylinderGeometry) {
                iconText += icons.cylinder
            } else if(geometry instanceof RingGeometry) {
                iconText += icons.ring
            } else if(geometry instanceof DodecahedronGeometry) {
                iconText += icons.dodecahedron
            } else if(geometry instanceof TextGeometry) {
                iconText += icons.text
            }
        }
        iconText += '" class="list-icon" /> '
        if(obj.name) {
            iconText += obj.name
        } else {
            if(obj instanceof WireframeMesh && obj.geometry) {
                iconText += obj.geometry.type.replace("Geometry", "")
            } else if(obj instanceof Light) {
                iconText += obj.type
            } else {
                iconText += obj.type
            }
        }
        return iconText
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