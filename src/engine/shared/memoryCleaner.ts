import { EngineState } from "./engineState";

const nativeInterval = setInterval;
// @ts-ignore
window.setInterval = function(callback: () => any, delay: number | undefined) {
	const interval = nativeInterval(callback, delay);
	EngineState.addIntervalId(interval);
	return interval;
}

export const nativeClearInterval = clearInterval;
// @ts-ignore
window.clearInterval = function(interval: NodeJS.Timer) {
	const index = EngineState.intervalIds.indexOf(interval)
	if(index !== -1) {
		EngineState.intervalIds.splice(index, 1);
	}
	nativeClearInterval(interval);
}