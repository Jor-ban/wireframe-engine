import { Pane, TabPageApi } from 'tweakpane';
import { errorsCount, Logger, warnsCount } from './logger';
import { AssetsManager } from "./assetsManager";
import {
	bottomControlsHeight,
	leftControlsWidth,
	rightControlsWidth,
	updateBottomControlsHeight
} from "⚙️/shared/consts/controlsStyles";
import { KeyEvent } from "⚙️/devEngine/shortcuts";
import { Console } from "./console";

export class BottomControls {
	pane: Pane
	assetsTab: TabPageApi
	logsTab: TabPageApi
	tabsButtonElement !: Element
	initialHeight: number
	constructor() {
		const container = document.createElement('div')
		container.classList.add('__wireframe-bottom-controls', '__wireframe-controls')
		this.initialHeight = bottomControlsHeight
		container.style.height = this.initialHeight + 'px'
		container.style.width = `calc(100vw - ${leftControlsWidth}px - ${rightControlsWidth}px)`
		container.style.left = leftControlsWidth + 'px'
		document.body.appendChild(container)

		this.pane = new Pane({ title: 'Wireframe Engine', container })
		const tabs = this.pane.addTab({
			pages: [
				{ title: 'Explorer' },
				{ title: 'Console' },
				{ title: 'Time' },
				{ title: 'Camera Render' }
			]
		})
		this.tabsButtonElement = tabs.element.children[0].children[1].children[0].children[0]
		this.assetsTab = tabs.pages[0]
		this.logsTab = tabs.pages[1]
		const console = new Console(this.logsTab)
		const logger = new Logger(this.logsTab)
		console.addInputListener(logger.inputLog.bind(logger))
		new AssetsManager(this.assetsTab)
		this.initHideBottomMenuBtn(container)
		this.initErrorsNWarns()
	}
	private editLogsTile(warnsNum: number, errorsNum: number) {
		this.tabsButtonElement.innerHTML = `
			Console 
		`
		if(warnsNum > 0) {
			this.tabsButtonElement.innerHTML += `
				<span class="__wireframe_warn-icon">⚠️(${warnsNum})</span>
			`
		}
		if(errorsNum > 0) {
			this.tabsButtonElement.innerHTML += `
				<span class="__wireframe-error-icon">🛑[${errorsNum}] </span>
			`
		}
	}
	initErrorsNWarns() {
		let warnsNum = 0
		let errorsNum = 0
		errorsCount.subscribe((count: number) => {
			errorsNum = count
			this.editLogsTile(warnsNum, errorsNum)
		})
		warnsCount.subscribe((count: number) => {
			warnsNum = count
			this.editLogsTile(warnsNum, errorsNum)
		})
	}
	private initHideBottomMenuBtn(container: HTMLElement) {
		let expanded = false
		const button = document.createElement('button')
		button.classList.add('__wireframe-hide-bottom-menu-btn')
		button.style.right = rightControlsWidth + 'px'
		document.body.appendChild(button)
		const onClick = () => {
			expanded = !expanded
			if(expanded) {
				container.style.height = this.initialHeight + 'px'
				button.style.bottom = this.initialHeight + 'px'
				updateBottomControlsHeight(this.initialHeight, container)
				button.innerHTML = 'ᐁ'
			} else {
				container.style.height = '0px'
				button.style.bottom = '0px'
				updateBottomControlsHeight(0, container)
				button.innerHTML = 'ᐃ'
			}
		}
		onClick()
		KeyEvent.key('~').subscribe(onClick)
		button.addEventListener('click', onClick)
	}
}