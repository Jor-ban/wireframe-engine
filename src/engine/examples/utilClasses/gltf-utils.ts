// @ts-nocheck
import {AnimationAction, AnimationMixer} from "three";
import {TimeMachine} from "⚙️/services/timeMachine.service";
import {__AnimationFrameFactory} from "⚙️/services/animationFrame.service";

export class GLTFUtils {
    public activeAction: AnimationAction | null = null
    private _mixer: AnimationMixer | null = null
    private _actionCb: (dt: number) => void

    public playAnimation(indexOrName: number, dtMultiplier: number = 1) {
        if(typeof indexOrName === 'string') {
            const foundAnimation = this.animations.find(a => a.name === indexOrName)
            if(!foundAnimation) throw new Error(`GLTFUtils: Animation with name ${indexOrName} not found`)
            indexOrName = foundAnimation
        }
        if(!this.activeAction) {
            this._actionCb = (function(dt: number)  {
                this._mixer.update(dt / dtMultiplier)
            }).bind(this)
            TimeMachine.addListener(this._actionCb)
        }
        this.activeAction?.stop()
        this.activeAction = this.animationMixer.clipAction(this.animations[indexOrName])
        this.activeAction.play()
    }
    get animations() {
        if(!this.__object?.gltfData) throw new Error('GLTFUtils: Object is not a GLTFGroup')
        return this.__object.gltfData.animations
    }
    public get animationMixer(): AnimationMixer {
        if(!this._mixer) {
            this._mixer = new AnimationMixer(this.__object)
        }
        return this._mixer
    }
}