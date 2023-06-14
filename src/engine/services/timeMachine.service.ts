import {__AnimationFrameFactory, AnimationFrameServiceInterface} from "⚙️/services/animationFrame.service";

export interface TimeMachineInterface extends AnimationFrameServiceInterface {
    newInstance(): TimeMachineInterface
    setTimeMultiplier(timeMultiplier: number): TimeMachineInterface
    getTimeMultiplier(): number
    doPerFrame(callback: (deltaTime: number) => void, highPriority ?: boolean): TimeMachineInterface
    pause(): TimeMachineInterface
    play(multiplier ?: number): TimeMachineInterface
}

class TimeMachineService extends __AnimationFrameFactory {
    private defaultMultiplier: number = 1
    /**
     * @returns new instance of TimeMachine
     */
    public newInstance(): TimeMachineService {
        return new TimeMachineService()
    }

    /**
     * Sets multiplier for deltaTime in every frame
     * @param timeMultiplier: number
     */
    public setTimeMultiplier(timeMultiplier: number): TimeMachineService {
        this._timeMultiplier = timeMultiplier
        this.defaultMultiplier = timeMultiplier
        return this
    }

    /**
     * @returns current multiplier for deltaTime in every frame
     */
    public getTimeMultiplier() {
        return this._timeMultiplier
    }
    public doPerFrame(callback: (deltaTime: number) => void, highPriority ?: boolean): TimeMachineService {
        this.addListener(callback, highPriority)
        return this
    }
    public pause(): TimeMachineService {
        this._timeMultiplier = 0
        return this
    }
    public play(multiplier ?: number): TimeMachineService {
        this._timeMultiplier = multiplier ?? this.defaultMultiplier
        this.run()
        return this
    }
}

export const TimeMachine = new TimeMachineService()