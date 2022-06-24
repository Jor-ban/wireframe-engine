class EngineStateClass {
	intervalIds: NodeJS.Timer[] = []
	timeoutIds: NodeJS.Timer[] = []
	monitors: any[] = []

	constructor() {
		window.onbeforeunload = () => {
			for(let id of this.intervalIds) {
				clearInterval(id)
			}
			for(let id of this.timeoutIds) {
				clearTimeout(id)
			}
			for(let monitor of this.monitors) {
				monitor.disabled = true
				monitor.dispose()
			}
		}
	}

	addIntervalId(...id: NodeJS.Timer[]) {
		this.intervalIds.push(...id)
	}
	addTimeoutId(...id: NodeJS.Timer[]) {
		this.timeoutIds.push(...id)
	}
	addMonitor(...monitor: any[]) {
		this.monitors.push(...monitor)
	}
}

export const EngineState =  new EngineStateClass()