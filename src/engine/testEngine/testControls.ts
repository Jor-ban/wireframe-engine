import { AnimationFrame } from '../services/animationFrame.service';
import {Pane} from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import {WebGLRenderer} from "three";
import {logMemory} from "⚙️/shared/PerformanceMonitors";
import {TestBottomControls} from "⚙️/testEngine/UI/testBottomControls";
import "./testStyles.css"

export class TestControls {
    public pane: Pane
    constructor(askedFPS: number, renderer: WebGLRenderer) {
        AnimationFrame.run()
        this.pane = new Pane({ title: 'Wireframe Engine Gui' });
        this.pane.element.classList.add('__wireframe-controls')
        new TestBottomControls()
        this.pane.registerPlugin(EssentialsPlugin);
        this.addFpsMeter()
        this.pane.addInput({'Play/Pause': 1}, 'Play/Pause', {
            view: 'radiogrid',
            groupName: 'Play/Pause',
            size: [2, 1],
            cells: (x: number, _y: number) => ({
                title: x === 0 ? 'Play' : 'Pause',
                value: x === 0 ? 1 : 0,
            }),

        }).on('change', ({value}) => {
            if(value === 1) {
                AnimationFrame.setFPS(askedFPS)
            } else {
                AnimationFrame.setFPS(0)
            }
        });
        const others = this.pane.addFolder({title: 'Additional Monitors', expanded: false})
        logMemory(others, renderer)
    }

    private addFpsMeter() {
        const fpsGraph = this.pane.addBlade({
            view: 'fpsgraph',
            label: 'FPS',
            lineCount: 1,
        });
        AnimationFrame.addListener(() => {
            // @ts-ignore
            fpsGraph.begin()
        }, true)
        AnimationFrame.addListener(() => {
            // @ts-ignore
            fpsGraph.end()
        })
    }
}