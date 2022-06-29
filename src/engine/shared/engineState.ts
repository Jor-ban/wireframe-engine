import { nativeClearInterval } from './memoryCleaner';

class EngineStateClass {
	intervalIds: NodeJS.Timer[] = []
	monitors: any[] = []

	constructor() {
		window.onbeforeunload = () => {
			for(let i = 0; i < this.intervalIds.length; i++) {
				nativeClearInterval(this.intervalIds[i])
			}
			for(let i = 0; i < this.monitors.length; i++) {
				this.monitors[i].disabled = true
				this.monitors[i].dispose()
			}
		}
	}

	addIntervalId(...id: NodeJS.Timer[]) {
		this.intervalIds.push(...id)
	}
	addMonitor(...monitor: any[]) {
		this.monitors.push(...monitor)
	}
}

export const EngineState = new EngineStateClass()