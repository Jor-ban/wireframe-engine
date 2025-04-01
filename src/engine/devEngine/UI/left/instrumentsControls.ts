import { __DevEngine } from '⚙️/devEngine/devEngine';
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {InstrumentsEnum} from "../../types/Instruments.enum";
import {MathUtils, Object3D} from "three";
import {ElementTracer} from "./utils/elementTracer";
import {ChangeDetector} from "../../changeDetector";
import {WMesh} from "⚙️/lib";
import {KeyEvent} from "../../shortcuts";

import pointerIconUrl from "../../assets/pointer_icon.svg"
import moveIconUrl    from '../../assets/move_icon.svg'
import rotateIconUrl  from '../../assets/rotate_icon.svg'
import scaleIconUrl   from '../../assets/scale_icon.svg'

export class InstrumentsControls {
    instrumentsElement: HTMLElement
    activeInstrument: InstrumentsEnum = InstrumentsEnum.pointer
    buttonsList: HTMLButtonElement[] = []
    private readonly tfControls: TransformControls
    private readonly elementTracer: ElementTracer

    constructor(engineState: __DevEngine, container: HTMLElement) {
        const {devCamera, canvas, scene, orbitControls} = engineState
        this.instrumentsElement = container
        this.instrumentsElement.classList.add('__wireframe-instruments')
        this.tfControls = new TransformControls(devCamera, canvas)
        this.elementTracer = new ElementTracer(engineState, this.tfControls.getRaycaster())
        if(orbitControls) {
            this.tfControls.addEventListener('dragging-changed', (event) => {
                orbitControls.enabled = !event.value;
                
                if(!event.value && this.elementTracer.activeObject) {
                    let changedPropertyName: keyof Object3D = 'position'
                    if(this.activeInstrument === InstrumentsEnum.rotation) {
                        changedPropertyName = 'rotation'
                    } else if(this.activeInstrument === InstrumentsEnum.scale) {
                        changedPropertyName = 'scale'
                    }
                    ChangeDetector.activeObjectUpdated$.next({
                        target: this.elementTracer.activeObject,
                        changedPropertyName,
                        value: null
                    })
                }
            })
        }
        scene.add(this.tfControls as unknown as Object3D)
        this.initListeners()
        this.addButtons()
    }
    initListeners() {
        ChangeDetector.clickedObject$.subscribe((object: WMesh | Object3D | null) => {
            if(object) {
                this.tfControls.attach(object)
            } else {
                this.tfControls.detach()
            }
        })
        KeyEvent.figureKey('Shift').subscribe((key: KeyboardEvent) => {
            if(key.type === 'keydown') {
                this.tfControls.setTranslationSnap(1)
                this.tfControls.setRotationSnap(MathUtils.degToRad(45))
                this.tfControls.setScaleSnap(0.5)
            } else {
                this.tfControls.setTranslationSnap(null)
                this.tfControls.setRotationSnap(null)
                this.tfControls.setScaleSnap(null)
            }
        })
        KeyEvent.figureKey('Alt').subscribe((key: KeyboardEvent) => {
            if(key.type === 'keydown') {
                this.tfControls.setSpace('local')
            } else {
                this.tfControls.setSpace('world')
            }
        })
        ChangeDetector.activeInstrument$.subscribe(this.onInstrumentChange.bind(this))
        ChangeDetector.activeInstrument$.next(InstrumentsEnum.pointer)
    }
    addButtons() {
        this.addButton(InstrumentsEnum.pointer, pointerIconUrl, 'Pointer [X]')
        this.addButton(InstrumentsEnum.move, moveIconUrl, 'Move [V]')
        this.addButton(InstrumentsEnum.rotation, rotateIconUrl, 'Rotate [R]')
        this.addButton(InstrumentsEnum.scale, scaleIconUrl, 'Scale [S]')
    }
    addButton(name: InstrumentsEnum, iconUrl: string, tooltipDescription: string = '') {
        const button = document.createElement('button')
        button.classList.add('__wireframe-instruments__button')
        button.classList.add(`__wireframe-instruments__button-${name}`)
        button.name = name
        this.buttonsList.push(button)
        button.addEventListener('click', () => {
            ChangeDetector.activeInstrument$.next(name)
        })
        this.instrumentsElement.appendChild(button)
        const icon = document.createElement('img')
        icon.src = iconUrl
        const tooltip = document.createElement('span')
        tooltip.classList.add('__wireframe-instruments__button__tooltip')
        tooltip.innerText = tooltipDescription
        button.appendChild(icon)
        button.appendChild(tooltip)
    }
    onInstrumentChange(instrument: InstrumentsEnum) {
        this.activeInstrument = instrument
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