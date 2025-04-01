import { GLTFGroup } from "⚙️/lib/classes/gltfGroup";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { FolderApi, Pane, TabPageApi } from "tweakpane";
import { AnimationClip, AnimationMixer, Group } from "three";
import { TimeMachine, TimeMachineInterface } from "⚙️/services/timeMachine.service";

class GLTFControlsFactory {
    private gltfTimelinesMap: WeakMap<GLTF, Map<string, TimeMachineInterface>> = new WeakMap()
    public addForGltf(gltf: GLTFGroup | GLTF, pane: TabPageApi | Pane | FolderApi) {
        if(gltf instanceof Group) {
            gltf = gltf.gltfData
        }
        this.addAnimations(gltf, pane)
    }
    private addAnimations(gltf: GLTF, pane: TabPageApi | Pane | FolderApi) {
        if(!this.gltfTimelinesMap.has(gltf)) {
            this.gltfTimelinesMap.set(gltf, new Map())
        }
        const folder = pane.addFolder({ title: 'GLTF Animations', expanded: true })
        gltf.animations.forEach(a => this.addAnimation(a, gltf, folder))
    }
    private addAnimation(animation: AnimationClip, gltf: GLTF, folder: FolderApi) {
        const map = this.gltfTimelinesMap.get(gltf)
        let timeMachine: TimeMachineInterface | undefined
        if(!map?.has(animation.name)){
            timeMachine = TimeMachine.newInstance()
            map?.set(animation.name, timeMachine)
        } else {
            timeMachine = map.get(animation.name)
            timeMachine?.stop()
        }
        const animationPane = folder.addFolder({ title: animation.name, expanded: true })
        const animationElement = animationPane.element
        animationElement.innerHTML = ``
        animationElement.classList.add('__gltf-animation-container')
        const animationText = document.createElement('p')
        animationText.innerText = `${animation.name} (${animation.duration.toFixed(2)}s)`
        animationElement.appendChild(animationText)

        const controlsRow = document.createElement('div')
        controlsRow.classList.add('__gltf-animation-controls-row')
        animationElement.appendChild(controlsRow)

        const playBtn = document.createElement('button')
        playBtn.innerText = '►'
        controlsRow.appendChild(playBtn)
        const pauseBtn = document.createElement('button')
        pauseBtn.innerText = '❚❚'
        controlsRow.appendChild(pauseBtn)

        playBtn.addEventListener('click', () => {
            map?.forEach(t => t !== timeMachine ? t.pause() : null)
            timeMachine?.play()
        })
        pauseBtn.addEventListener('click', () => {
            timeMachine?.pause()
        })
        folder.addBinding({
            speed: timeMachine?.getTimeMultiplier() ?? 1
        }, 'speed', {
            min: 0,
            max: 10,
            step: 0.01
        }).on('change', ({ value }) => {
            timeMachine?.setTimeMultiplier(value)
        })
        folder.addBlade({ view: 'separator' })

        const mixer = new AnimationMixer(gltf.scene)
        const action = mixer.clipAction(animation)
        action.play()
        timeMachine?.addListener(deltaTime => {
            mixer.update(deltaTime / 1000)
        })
    }

    public dispose() {
        // todo
    }
}

export const GLTFControls = new GLTFControlsFactory()