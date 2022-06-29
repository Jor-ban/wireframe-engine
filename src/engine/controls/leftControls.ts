import { BladeApi, FolderApi, Pane, TabPageApi } from 'tweakpane';
import { BladeController, View } from '@tweakpane/core';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { AmbientLight, AxesHelper, Group, Object3D, OrthographicCamera, PerspectiveCamera, Scene } from 'three';
import { RightControls } from './rightControls';
import { clickedObject$, hoveredObject$ } from './elementTracer';

export type SceneFolder = Object3D & {opened: boolean}

export class LeftControls {
	public fpsGraph: BladeApi<BladeController<View>>
	public leftPane: Pane
	private instrumentsTab: TabPageApi
	private objectsTab: TabPageApi
	private rightControls: RightControls
	private clickedElement: HTMLElement | null = null
	private objectMap: WeakMap<Object3D, HTMLElement> = new WeakMap()

	constructor(scene: Scene, rightControlsRef: RightControls) {
		this.setupPane()
		this.rightControls = rightControlsRef
		const folder = this.objectsTab.addFolder({title: '', expanded: true})
		this.parseScene(scene.children, folder)
		clickedObject$.subscribe(obj => {
			const element = this.objectMap.get(obj)
			this.clickedElement?.classList.remove('__wireframe-active')
			element?.classList.add('__wireframe-active')
			this.clickedElement = element
		})
	}

	setupPane() {
		const container = document.createElement('div')
		container.classList.add('__wireframe-left-controls', '__wireframe-controls')
		document.body.appendChild(container)
		this.leftPane = new Pane({
			title: 'Wireframe Engine Gui',
			container,
		});
		this.leftPane.registerPlugin(EssentialsPlugin);
		this.fpsGraph = this.leftPane.addBlade({
			view: 'fpsgraph',
			label: 'FPS',
			lineCount: 2,
		});
		const folders = this.leftPane.addTab({
			pages: [
				{title: 'Instruments'},
				{title: 'Objects'},
			]
		})
		this.instrumentsTab = folders.pages[0]
		this.objectsTab = folders.pages[1]
	}
	parseScene(children: Object3D[], folder: FolderApi) {
		folder.element.classList.add('__wireframe-objects-invisible-folder')
		const tab = folder.element.children[1] as HTMLDivElement
		tab.innerHTML = ''
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
					const div = document.createElement("div")
					div.classList.add('__wireframe-object-select')
					const text = document.createElement('div')
					text.classList.add('__wireframe-object-text')
					text.innerText = obj.name || obj.type
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
					deleteButton.addEventListener("click", () => {
						if(window.confirm(`Are you sure you want to delete ${obj.name}?`)) {
							obj.parent.remove(obj)
						}
					})
					div.appendChild(text)
					div.appendChild(showButton)
					div.appendChild(deleteButton)

					tab.appendChild(div)
					div.addEventListener('mouseover', () => {
						hoveredObject$.next(obj)
					})
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
}