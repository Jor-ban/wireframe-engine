import { DraggingService } from './utils/dragging.service';
import { ObjectsContainer } from './objectsContainer';
import { __DevEngine } from '⚙️/devEngine/devEngine';
import { WireframeDropdown } from '⚙️/devEngine/utils/dropdown';
import { Group, PerspectiveCamera, Scene } from "three";
import { ChangeDetector } from "../../changeDetector";
import { icons } from '../../assets/icons';

import { getMeshAddingOptions } from '../../utils/MeshAddingOptions';
export class ElementsListControls {
    private scene: Scene
    private rootContainerElement: HTMLElement
    private devCamera: PerspectiveCamera
    private rootContainer: ObjectsContainer

    constructor(engineState: __DevEngine, container: HTMLElement) {
        this.scene = engineState.scene
        this.devCamera = engineState.devCamera
        const header = this.createListHeader()
        this.rootContainerElement = container
        container.appendChild(header)
        const elementsContainer = document.createElement('div')
        this.rootContainerElement.appendChild(elementsContainer)
        this.rootContainer = new ObjectsContainer(this.scene.children, elementsContainer)
        this.createEmptyFieldBottom()
    }
    private createEmptyFieldBottom() {
        this.createEmptyField().addEventListener('drop', (e) => {
            e.preventDefault()
            DraggingService.dropTo(this.scene)
            this.rootContainer.update()
        })
    }
    private createEmptyField(): HTMLElement {
        const emptyFieldContainer = document.createElement('div')
        emptyFieldContainer.classList.add('__wireframe-empty-fields-container', '__wireframe-object-select')
        this.rootContainerElement.appendChild(emptyFieldContainer)
        const emptyFieldText = document.createElement('div')
        emptyFieldText.classList.add('__wireframe-object-text')
        emptyFieldContainer.appendChild(emptyFieldText)
        emptyFieldContainer.addEventListener('dragenter', (e) => {
            e.preventDefault()
            if(DraggingService.draggingElement) {
                emptyFieldContainer.classList.add('__wireframe-dragover')
            }
        })
        emptyFieldContainer.addEventListener('dragover', (e) => {
            e.preventDefault()
        })
        emptyFieldContainer.addEventListener('dragleave', (e) => {
            e.preventDefault()
            emptyFieldContainer.classList.remove('__wireframe-dragover')
        })
        emptyFieldContainer.addEventListener('drop', (e) => {
            e.preventDefault()
            emptyFieldContainer.classList.remove('__wireframe-dragover')
        })
        return emptyFieldContainer
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
}