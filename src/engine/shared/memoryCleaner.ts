import { EngineState } from "./engineState";

const nativeInterval = setInterval;
// @ts-ignore
setInterval = function(callback, delay) {
	const interval = nativeInterval(callback, delay);
	EngineState.addIntervalId(interval);
	return interval;
}

export const nativeClearInterval = clearInterval;
// @ts-ignore
clearInterval = function(interval) {
	EngineState.intervalIds.splice(EngineState.intervalIds.indexOf(interval), 1);
	nativeClearInterval(interval);
}