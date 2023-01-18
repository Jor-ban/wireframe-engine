import { Clock } from "three";
import { EngineState } from "../shared/engineState";

class AnimationFrameFactory {
    public isRunning: boolean = false;
    private _callbacks: Array<(deltaTime: number) => void> = [];
    private _tickIntervalId : NodeJS.Timeout | null = null
    private _animationFrameId: number | null = null
    private clock !: Clock
    private maxFPS: number = 60

    public run(maxFps ?: number) {
        this.clock = new Clock(true)
        this.isRunning = true;
        this.setFPS(maxFps ?? this.maxFPS)
        return this
    }
    public stop() {
        this.isRunning = false;
        this.setFPS(0)
        return this
    }
    public addListener(listener: (deltaTime: number) => void, runInBeginning ?: boolean) {
        if(runInBeginning) {
            this._callbacks.unshift(listener)
        } else {
            this._callbacks.push(listener)
        }
        return this
    }
    public removeListener(listener: () => void) {
        this._callbacks.splice(this._callbacks.findIndex(listener), 1)
        return this
    }
    public setFPS(maxFPS: number = 60) {
        this.maxFPS = maxFPS
        // removing previous interval or animationFrame
        if(this._tickIntervalId !== null) {
            clearInterval(this._tickIntervalId)
        } else if(this._animationFrameId !== null) {
            window.cancelAnimationFrame(this._animationFrameId)
        }
        if(maxFPS <= 0) { // if maxFPS is 0 or less, render once
            this.runListeners()
        } else if(maxFPS === Infinity) { // if maxFPS is Infinity, render as often as possible
            this._tickIntervalId = setInterval(this.runListeners.bind(this))
            EngineState.addIntervalId(this._tickIntervalId)
        } else if(maxFPS === 60) { // if maxFPS is - 60, render in max comfort mode
            const frame = () => {
                this.runListeners()
                this._animationFrameId = window.requestAnimationFrame(frame) // TODO make own requestAnimationFrame service for better performance and better control & animations
            }
            frame()
        } else {
            this._tickIntervalId = setInterval(this.runListeners.bind(this), 1000 / maxFPS)
            EngineState.addIntervalId(this._tickIntervalId)
        }
        return this
    }
    private runListeners() {
        const deltaTime = this.clock.getDelta()
        for(let i = 0; i < this._callbacks.length; i++) {
            this._callbacks[i](deltaTime)
        }
    }
}

export const AnimationFrame = new AnimationFrameFactory();