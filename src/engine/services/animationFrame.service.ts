import { Clock } from "three";
import { EngineState } from "⚙️/shared/engineState";


class AnimationFrameFactory {
    public isRunning: boolean = false;
    private _callbacks: Array<(deltaTime: number) => void> = [];
    private _tickIntervalId : NodeJS.Timer | number | null = null
    private _animationFrameId: number | null = null
    private _clock !: Clock
    private _maxFPS: number = 60

    /**
     * method to set max fps to run at for whole app
     * @param maxFps - max fps to run at, if not provided, will run at 60 fps
     * @returns AnimationFrame service
     * @example
     * import { AnimationFrame } from './services/animationFrame.service';
     * AnimationFrame.runAt(60)
     * // do something
     * AnimationFrame.addListener((deltaTime) => {
     *    // do something with deltaTime
     * })
     */
    public run(maxFps ?: number) {
        this._clock = new Clock(true)
        this.isRunning = true;
        this.setFPS(maxFps ?? this._maxFPS)
        return this
    }
    /**
     * method to stop running at max fps
     * @returns AnimationFrame service
     * @example
     * import { AnimationFrame } from './services/animationFrame.service';
     * AnimationFrame.runAt(60)
     * // do something
     * AnimationFrame.stop()
     * // do something else
     * AnimationFrame.runAt(60)
    **/
    public stop() {
        this.isRunning = false;
        this.setFPS(0)
        return this
    }
    /**
     * method to add listener to be called on every frame
     * @param listener - function to be called on every frame
     * @param runInBeginning - if true, will run listener in the beginning of the frame, if false, will run in the end of the frame
     * @returns AnimationFrame service
     * @example
     * import { AnimationFrame } from './services/animationFrame.service';
     * // do something
     * AnimationFrame.addListener((deltaTime) => {
     *   // do something with deltaTime
     * })
     **/
    public addListener(listener: (deltaTime: number) => void, runInBeginning ?: boolean) {
        if(runInBeginning) {
            this._callbacks.unshift(listener)
        } else {
            this._callbacks.push(listener)
        }
        return this
    }
    /**
     * method to remove listener from being called on every frame
     * @param listener - function to be removed from being called on every frame
     * @returns AnimationFrame service
     * @example
     * import { AnimationFrame } from './services/animationFrame.service';
     * // do something
     * const listener = (deltaTime) => {
     *  // do something with deltaTime
     * }
     * AnimationFrame.addListener(listener)
     * // do something else
     * AnimationFrame.removeListener(listener)
     **/
    public removeListener(listener: (...args: any) => void) {
        this._callbacks.splice(this._callbacks.findIndex(listener), 1)
        return this
    }
    /**
     * method to set max fps to run at for whole app
     * @param maxFPS - max fps to run at, if not provided, will run at 60 fps
     * @returns AnimationFrame service
     * @example
     * import { AnimationFrame } from './services/animationFrame.service';
     * settingsFpsButton.onclick = () => {
     *   AnimationFrame.setFPS(30)
     * }
     **/
    public setFPS(maxFPS: number = 60) {
        this._maxFPS = maxFPS
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
                this._animationFrameId = window.requestAnimationFrame(frame)
            }
            frame()
        } else {
            this._tickIntervalId = setInterval(this.runListeners.bind(this), 1000 / maxFPS)
            EngineState.addIntervalId(this._tickIntervalId)
        }
        return this
    }
    private runListeners() {
        const deltaTime = this._clock.getDelta()
        for(let i = 0; i < this._callbacks.length; i++) {
            this._callbacks[i](deltaTime)
        }
    }
}
/**
 * AnimationFrame - service for browserAnimationFrames
 * @example
 * import { AnimationFrame } from './services/animationFrame.service';
 * // needs to be started once (engine does this automatically)
 * AnimationFrame.addListener(() => {
 *    // do something
 * })
 */
export const AnimationFrame = new AnimationFrameFactory();