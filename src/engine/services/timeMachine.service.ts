import { __AnimationFrameFactory } from "⚙️/services/animationFrame.service";

class TimeMachineService extends __AnimationFrameFactory {
    /**
     * @returns new instance of TimeMachine
     */
    newInstance(): TimeMachineService {
        return new TimeMachineService()
    }

    /**
     * Sets multiplier for deltaTime in every frame
     * @param timeMultiplier: number
     */
    setTimeMultiplier(timeMultiplier: number) {
        this._timeMultiplier = timeMultiplier
        this.run()
    }

    /**
     * @returns current multiplier for deltaTime in every frame
     */
    getTimeMultiplier() {
        return this._timeMultiplier
    }
    doPerFrame(callback: (deltaTime: number) => void, highPriority ?: boolean) {
        this.addListener(callback, highPriority)
    }
}

export const TimeMachine = new TimeMachineService()