import { InstrumentsEnum } from '../../types/Instruments.enum';
import { icons } from '../../assets/icons';
import { ChangeDetector } from '../../changeDetector';
import { Group, Object3D, PerspectiveCamera, Scene } from "three";
import { WireframeDropdown } from "../../utils/dropdown";
import { getMeshAddingOptions } from "../../utils/MeshAddingOptions";

import logoUrl from '⚙️/shared/assets/wireframe-logo.svg?url'
import { HiddenMenuOption } from "../../utils/hiddenMenu";

export class TopBar {
    bar: HTMLElement;
    devCamera: PerspectiveCamera;
    scene: Scene;
    activeObject: Object3D | null = null; 

    constructor(devCamera: PerspectiveCamera, scene: Scene) {
        this.devCamera = devCamera;
        this.scene = scene;
        this.bar = document.createElement("div")
        this.bar.classList.add("__wireframe-top-bar", '__wireframe-controls')
        document.body.appendChild(this.bar)
        this.addLogo()
        this.addDropdowns()
        this.addTestPlayButton()
        ChangeDetector.clickedObject$.subscribe(object => {
            this.activeObject = object
        })
    }
    private addLogo(): void {
        const logo = document.createElement("img")
        logo.src = logoUrl
        logo.classList.add("__wireframe-logo")
        this.bar.appendChild(logo)
    }
    private addTestPlayButton() {
        const button = document.createElement("a")
        button.href = window.location.href + '?mode=test'
        button.target = '_blank'
        button.classList.add("__wireframe-test-play-button")
        button.innerHTML = "▶ Run in test mode"
        button.style.marginLeft = 'auto'
        this.bar.appendChild(button)
    }
    private addDropdowns() {
        this.addInstrumentsDropdown()
        this.addElementsListDropdowns()
    }
    private addElementsListDropdowns() {
        const elementsListButton = document.createElement("button")
        elementsListButton.innerHTML = `Objects List ▾ `
        const groupAddingOption: HiddenMenuOption = {
            name: `<img src="${icons.addGroup}" class="list-icon" /> Add Group`,
            onclick: () => {
                let place: Scene | Object3D = this.scene
                if(this.activeObject instanceof Group) {
                    place = this.activeObject
                } else if(this.activeObject?.parent) {
                    place = this.activeObject.parent
                }
                const group = new Group()
                place.add(group)
                ChangeDetector.addedObject$.next(group)
            }
        }
        const activeObjectDropdown: HiddenMenuOption = {
            name: `Active Object ▸`,
            subOptions: [
                {
                    name: `<span class="__wireframe-dropdown-text-delete"> Delete </span>`,
                    onclick: () => {
                        if (this.activeObject) {
                            ChangeDetector.removedObject$.next(this.activeObject)
                        }
                    }
                }, {
                    name: 'Visibility',
                    onclick: () => {
                        if (this.activeObject) {
                            ChangeDetector.activeObjectUpdated$.next({
                                target: this.activeObject,
                                changedPropertyName: 'visible',
                                value: !this.activeObject.visible
                            })
                        }
                    }
                }
            ],
        }
        new WireframeDropdown(this.bar, elementsListButton, [
            activeObjectDropdown,
            {
                name: "Add ▸",
                subOptions: [
                    groupAddingOption, 
                    ...getMeshAddingOptions(this.scene, this.devCamera)
                ]
            },
        ])
    }
    private addInstrumentsDropdown() {
        const instrumentsButton = document.createElement("button");
        instrumentsButton.innerHTML = "Instruments ▾ "
        new WireframeDropdown(this.bar, instrumentsButton, [
            {
                name: "Pointer",
                onclick: () => {
                    ChangeDetector.activeInstrument$.next(InstrumentsEnum.pointer)
                }
            }, {
                name: "Move",
                onclick: () => {
                    ChangeDetector.activeInstrument$.next(InstrumentsEnum.move)
                }
            }, {
                name: "Rotate",
                onclick: () => {
                    ChangeDetector.activeInstrument$.next(InstrumentsEnum.rotation)
                }
            }, {
                name: "Scale",
                onclick: () => {
                    ChangeDetector.activeInstrument$.next(InstrumentsEnum.scale)
                }
            }
        ])
    }
}