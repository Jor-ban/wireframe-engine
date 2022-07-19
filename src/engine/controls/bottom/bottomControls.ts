import { Pane, TabPageApi } from 'tweakpane';
import { Logger } from './logger';
import { FilesViewer } from './filesViewer';

export class BottomControls {
	pane: Pane
	assetsTab: TabPageApi
	logsTab: TabPageApi
	constructor() {
		const container = document.createElement('div')
		container.classList.add('__wireframe-bottom-controls', '__wireframe-controls')
		document.body.appendChild(container)
		this.pane = new Pane({ title: 'Wireframe Engine', container })
		const tabs = this.pane.addTab({
			pages: [
				{ title: 'Assets' },
				{ title: 'Logs' }
			]
		})
		this.assetsTab = tabs.pages[0]
		this.logsTab = tabs.pages[1]
		new Logger(this.logsTab)
		new FilesViewer()
	}
}