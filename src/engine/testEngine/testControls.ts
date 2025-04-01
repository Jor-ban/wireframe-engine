import { Pane} from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { WebGLRenderer } from "three";
import { logMemory } from "⚙️/shared/PerformanceMonitors";
import { TestBottomControls } from "⚙️/testEngine/UI/testBottomControls";
import "./testStyles.css"
import { TimeMachine } from "⚙️/services/timeMachine.service";
import {BindingParams} from "@tweakpane/core/src/blade/common/api/params";

export class TestControls {
    public pane: Pane
    constructor(askedFPS: number, renderer: WebGLRenderer) {
        this.pane = new Pane({ title: 'Wireframe Engine Gui' });
        this.pane.element.classList.add('__wireframe-controls')
        this.pane.element.parentElement.style.zIndex = '667'
        new TestBottomControls()
        this.pane.registerPlugin(EssentialsPlugin);
        this.addFpsMeter()
        this.pane.addBinding({'Play/Pause': 1}, 'Play/Pause', {
            view: 'radiogrid',
            groupName: 'Play/Pause',
            size: [2, 1],
            cells: (x: number, _y: number) => ({
                title: x === 0 ? 'Play' : 'Pause',
                value: x === 0 ? 1 : 0,
            }),

        }).on('change', ({value}) => {
            if(value === 1) {
                TimeMachine.setFPS(askedFPS)
            } else {
                TimeMachine.setFPS(0)
            }
        });
        const others = this.pane.addFolder({title: 'Additional Monitors', expanded: false})
        logMemory(others, renderer)
    }

    public addTweak<K extends object>(obj: K, key: keyof K, params ?: BindingParams & {onChangeFn: (value: K[keyof K]) => void}): void {
        this.pane.addBinding(obj, key, params).on('change', ({ value }) => {
            params?.onChangeFn?.(value)
        });
    }

    private addFpsMeter() {
        const fpsGraph = this.pane.addBlade({
            view: 'fpsgraph',
            label: 'FPS',
            lineCount: 1,
        });
        TimeMachine.addListener(() => {
            // @ts-ignore
            fpsGraph.begin()
        }, true)
        TimeMachine.addListener(() => {
            // @ts-ignore
            fpsGraph.end()
        })
    }
}