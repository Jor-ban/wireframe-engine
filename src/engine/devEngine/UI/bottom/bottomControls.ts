import { Pane, TabPageApi } from 'tweakpane';
import { errorsCount, Logger, warnsCount } from './logger';
import { AssetsManager } from "./assetsManager";
import { bottomControlsHeight, leftControlsWidth, rightControlsWidth } from "⚙️/shared/consts/controlsStyles";

export class BottomControls {
	pane: Pane
	assetsTab: TabPageApi
	logsTab: TabPageApi
	tabsButtonElement !: Element
	constructor() {
		const container = document.createElement('div')
		container.classList.add('__wireframe-bottom-controls', '__wireframe-controls')
		container.style.height = bottomControlsHeight + 'px'
		container.style.width = `calc(100vw - ${leftControlsWidth}px - ${rightControlsWidth}px)`
		container.style.left = leftControlsWidth + 'px'
		document.body.appendChild(container)
		this.pane = new Pane({ title: 'Wireframe Engine', container })
		const tabs = this.pane.addTab({
			pages: [
				{ title: 'Explorer' },
				{ title: 'Logs' }
			]
		})
		this.tabsButtonElement = tabs.element.children[0].children[1].children[0].children[0]
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
		this.assetsTab = tabs.pages[0]
		this.logsTab = tabs.pages[1]
		new Logger(this.logsTab)
		new AssetsManager(this.assetsTab)
	}
	private editLogsTile(warnsNum: number, errorsNum: number) {
		this.tabsButtonElement.innerHTML = `
			Logs 
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
}