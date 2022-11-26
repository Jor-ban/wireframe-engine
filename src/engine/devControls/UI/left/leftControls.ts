import { BladeApi, Pane, TabPageApi } from 'tweakpane';
import { BladeController, View } from '@tweakpane/core';
import { Object3D } from 'three';
import {ElementsListControls} from "./elementsListControls";
import {InstrumentsControls} from "./instrumentsControls";
import {
	leftControlsWidth,
	topBarHeight
} from "../../shared/consts/controlsStyles";
import {EngineInterface} from "../../types/Engine.interface";

export type SceneFolder = Object3D & {opened: boolean}

export class LeftControls {
	public fpsGraph !: BladeApi<BladeController<View>>
	public leftTopPane !: Pane
	public leftBottomPane !: Pane
	private instrumentsTab !: TabPageApi
	private objectsTab !: TabPageApi

	constructor(engineState: EngineInterface) {
		this.setupPane()
		const objectsFolder = this.objectsTab.addFolder({title: '', expanded: true})
		new ElementsListControls(engineState.scene, objectsFolder)
		new InstrumentsControls(this.instrumentsTab, engineState)
	}

	setupPane() {
		const topContainer = document.createElement('div')
		topContainer.classList.add('__wireframe-left-top-controls', '__wireframe-controls')
		topContainer.style.width = leftControlsWidth + 'px'
		topContainer.style.height = `calc(50vh - ${topBarHeight})`
		topContainer.style.top = topBarHeight + 'px'
		document.body.appendChild(topContainer)
		this.leftTopPane = new Pane({
			title: 'Wireframe Engine Gui',
			container: topContainer,
		});
		const topFolders = this.leftTopPane.addTab({
			pages: [
				{title: 'Instruments'},
			]
		})
		this.instrumentsTab = topFolders.pages[0]

		const bottomContainer = document.createElement('div')
		bottomContainer.style.width = leftControlsWidth + 'px'
		document.body.appendChild(bottomContainer)
		bottomContainer.classList.add('__wireframe-left-bottom-controls', '__wireframe-controls')
		this.leftBottomPane = new Pane({
			title: 'Wireframe Engine Gui',
			container: bottomContainer,
		});
		const bottomFolders = this.leftBottomPane.addTab({
			pages: [
				{ title: 'Objects' }
			]
		})
		this.objectsTab = bottomFolders.pages[0]
	}
}