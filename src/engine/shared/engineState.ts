import { nativeClearInterval } from './memoryCleaner';

class EngineStateFactory {
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
	clearInterval(id: NodeJS.Timer) {
		const index = this.intervalIds.indexOf(id)
		if(index !== -1) {
			this.intervalIds.splice(index, 1)
		}
		nativeClearInterval(id)
	}
}

export const EngineState = new EngineStateFactory()