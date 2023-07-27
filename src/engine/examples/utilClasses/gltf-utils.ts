// @ts-nocheck
import {AnimationAction, AnimationMixer} from "three";
import {TimeMachine} from "⚙️/services/timeMachine.service";
import {__AnimationFrameFactory} from "⚙️/services/animationFrame.service";

export class GLTFUtils {
    public activeAction: AnimationAction | null = null
    private _mixer: AnimationMixer | null = null
    private _actionCb: (dt: number) => void
    private dtMul = 1

    public playAnimation(indexOrName: number, dtMultiplier: number = 1) {
        this.dtMul = dtMultiplier
        if(typeof indexOrName === 'string') {
            const foundAnimation = this.animations.find(a => a.name === indexOrName)
            if(!foundAnimation) throw new Error(`GLTFUtils: Animation with name ${indexOrName} not found`)
            indexOrName = foundAnimation
        }
        if(!this._actionCb) {
            this._actionCb = (function(dt: number)  {
                this._mixer.update(dt / this.dtMul)
            }).bind(this)
            TimeMachine.addListener(this._actionCb)
        }
        const exAction = this.activeAction
        this.activeAction = this.animationMixer.clipAction(this.animations[indexOrName])
        this.activeAction.play()
        if(exAction !== this.activeAction) exAction?.stop()
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