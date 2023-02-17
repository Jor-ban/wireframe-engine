import { __DevEngine } from "⚙️/devEngine/devEngine"
import {ElementsListControls} from "./elementsListControls";
import {InstrumentsControls} from "./instrumentsControls";
import {
	leftControlsWidth,
	topBarHeight
} from "⚙️/shared/consts/controlsStyles";

export class LeftControls {
	instrumentsElement !: HTMLDivElement
	objectsElement !: HTMLDivElement
	constructor(engineState: __DevEngine) {
		const leftBar = document.createElement('div')
		leftBar.classList.add('__wireframe-left-controls', '__wireframe-controls')
		leftBar.style.height = `calc(100vh - ${topBarHeight}px)`
		leftBar.style.width = leftControlsWidth + 'px'
		leftBar.style.top = topBarHeight + 'px'
		document.body.appendChild(leftBar)

		this.instrumentsElement = document.createElement('div')
		this.instrumentsElement.classList.add('__wireframe-left__instruments-controls', '__wireframe-controls')
		this.objectsElement = document.createElement('div')
		this.objectsElement.classList.add('__wireframe-left__objects-list-controls', '__wireframe-controls')
		leftBar.appendChild(this.instrumentsElement)
		leftBar.appendChild(this.objectsElement)

		new InstrumentsControls(engineState, this.instrumentsElement)
		new ElementsListControls(engineState, this.objectsElement)
	}
}