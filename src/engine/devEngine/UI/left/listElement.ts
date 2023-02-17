import { ObjectsContainer } from './objectsContainer';
import { Camera, Group, Light, Object3D } from 'three';
import { WireframeMesh } from '⚙️/lib';
import { ChangeDetector } from '../../changeDetector';
import { WireframeDropdown } from '../../utils/dropdown';
import { DraggingService } from './utils/dragging.service';
import { getElementText } from './utils/getObjectIcon';
import { GroupService } from './utils/group.service';

export class ListElement {
    public container: HTMLElement

    constructor(
        public object: Object3D,
        public parentElement: HTMLElement,
        private objectsContainer: ObjectsContainer
    ) {
        this.container = document.createElement("div")
        if(
            this.object instanceof WireframeMesh ||
            this.object instanceof Group ||
            this.object instanceof Light ||
            this.object instanceof Camera && this.object.uuid !== '__wireframe-dev-camera__'
        ) {
            this.container.classList.add('__wireframe-object-select')
            this.parentElement.appendChild(this.container)
            this.update()
            DraggingService.addEvents(this)
            if(this.object instanceof Group) {
                GroupService.addCollapse(this.object, this.container)
            }
        }
    }
    private update() {
        const text = document.createElement('div')
        text.classList.add('__wireframe-object-text')
        text.innerHTML = getElementText(this.object)
        this.container.draggable = true
        if(this.object instanceof Group) {
            this.container.addEventListener('click', () => {
                text.innerHTML = getElementText(this.object)
            })
        }

        this.container.appendChild(text)
        const showButton = document.createElement("button")
        showButton.innerHTML = "👁"
        showButton.addEventListener("click", () => {
            if(this.object.visible) {
                this.object.visible = false
                showButton.innerText = "◡"
            } else {
                this.object.visible = true
                showButton.innerText = "👁"
            }
        })

        const optionsButton = document.createElement("button")
        optionsButton.innerHTML = "⋮"
        new WireframeDropdown(this.container, optionsButton, [
            {
                name: `<span class="__wireframe-dropdown-text-delete"> Delete </span>`,
                onclick: () => ChangeDetector.removedObject$.next(this.object)
            }, {
                name: "Visibility",
                onclick: () => {
                    if(this.object.visible) {
                        this.object.visible = false
                        showButton.innerText = "◡"
                    } else {
                        this.object.visible = true
                        showButton.innerText = "👁"
                    }
                }
            }, {
                name: "Change Name",
                onclick: () => {
                    const newName = prompt("Enter new name", this.object.name)
                    if(newName) {
                        this.object.name = newName
                        ChangeDetector.activeObjectUpdated$.next({
                            changedPropertyName: 'name',
                            value: newName,
                            target: this.object
                        })
                    }
                }
            }
        ])
        this.container.appendChild(showButton)
        this.container.appendChild(optionsButton)
    }
    updateParent() {
        this.objectsContainer.update()
    }
}