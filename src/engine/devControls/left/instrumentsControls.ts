import {FolderApi, TabPageApi} from "tweakpane";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {InstrumentsEnum} from "../types/Instruments.enum";
import {EngineInterface} from "../../types/Engine.interface";
import {Object3D} from "three";
import {ElementTracer} from "./utils/elementTracer";
import {ChangeDetector} from "../shared/changeDetector/changeDetector";
import {WireframeMesh} from "../../lib";

const pointerIconUrl: string = require("../assets/pointer_icon.svg")
const moveIconUrl   : string = require('../assets/move_icon.svg')
const rotateIconUrl : string = require('../assets/rotate_icon.svg')
const scaleIconUrl  : string = require('../assets/scale_icon.svg')

export class InstrumentsControls {
    instrumentsFolder: FolderApi
    instrumentsElement: HTMLElement
    activeButton: InstrumentsEnum = InstrumentsEnum.pointer
    buttonsList: HTMLButtonElement[] = []
    private readonly tfControls: TransformControls
    private readonly elementTracer: ElementTracer

    constructor(pane: TabPageApi, engineState: EngineInterface) {
        const {mainCamera, canvas, scene, orbitControls} = engineState
        this.instrumentsFolder = pane.addFolder({title: '', expanded: true})
        this.instrumentsFolder.element.classList.add('__wireframe-invisible-folder')
        this.instrumentsElement = this.instrumentsFolder.element.children[1] as HTMLElement;
        this.instrumentsElement.classList.add('__wireframe-instruments')
        this.tfControls = new TransformControls(mainCamera, canvas)

        this.elementTracer = new ElementTracer(engineState, this.tfControls.getRaycaster())
        if(orbitControls) {
            this.tfControls.addEventListener('dragging-changed', (event) => {
                orbitControls.enabled = !event.value;
            })
        }
        scene.add(this.tfControls)
        this.addButtons()
        ChangeDetector.clickedObject$.subscribe((object: WireframeMesh | Object3D | null) => {
            if(object) {
                this.tfControls.attach(object)
            } else {
                this.tfControls.detach()
            }
        })
        ChangeDetector.activeInstrument$.subscribe(this.onInstrumentChange.bind(this))
        ChangeDetector.activeInstrument$.next(InstrumentsEnum.pointer)
    }
    addButtons() {
        this.addButton(InstrumentsEnum.pointer, pointerIconUrl)
        this.addButton(InstrumentsEnum.move, moveIconUrl)
        this.addButton(InstrumentsEnum.rotation, rotateIconUrl)
        this.addButton(InstrumentsEnum.scale, scaleIconUrl)
    }
    addButton(name: InstrumentsEnum, iconUrl: string, tooltipDescription: string = '') {
        const button = document.createElement('button')
        button.classList.add('__wireframe-instruments__button')
        button.classList.add(`__wireframe-instruments__button-${name}`)
        if(name === InstrumentsEnum.pointer) {
            button.classList.add('__wireframe-instruments__button-active')
        }
        button.name = name
        this.buttonsList.push(button)
        button.addEventListener('click', () => {
            ChangeDetector.activeInstrument$.next(name)
        })
        this.instrumentsElement.appendChild(button)
        const icon = document.createElement('img')
        icon.src = iconUrl
        button.appendChild(icon)
        const tooltip = document.createElement('span')
        tooltip.classList.add('__wireframe-instruments__button__tooltip')
        tooltip.innerText = tooltipDescription
        button.appendChild(tooltip)
        this.activeButton = name
    }
    onInstrumentChange(instrument: InstrumentsEnum) {
        this.activeButton = instrument
        this.buttonsList.forEach((button) => {
            if(button.name === instrument) {
                button.classList.add('__wireframe-instruments__button-active')
            } else {
                button.classList.remove('__wireframe-instruments__button-active')
            }
        })
        if(instrument !== InstrumentsEnum.pointer) {
            this.tfControls.size = 1
            this.tfControls.setMode(instrument as 'translate' | 'rotate' | 'scale')
        } else {
            this.tfControls.size = 0
        }
    }
}