import {BladeApi, Pane} from "tweakpane";
import {BladeController, View} from "@tweakpane/core";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import {WebGLRenderer} from "three";
import {logMemory} from "../devControls/utils/PerformanceMonitors";

export class TestControls {
    public fpsGraph: BladeApi<BladeController<View>>
    public pane: Pane
    constructor(tickFunction: Function, askedFPS: number, renderer: WebGLRenderer) {
        this.pane = new Pane({ title: 'Wireframe Engine Gui' });
        this.pane.registerPlugin(EssentialsPlugin);
        this.fpsGraph = this.pane.addBlade({
        	view: 'fpsgraph',
        	label: 'FPS',
        	lineCount: 1,
        });
        this.pane.addInput({'Play/Pause': 1}, 'Play/Pause', {
            view: 'radiogrid',
            groupName: 'Play/Pause',
            size: [2, 1],
            cells: (x: number, y: number) => ({
                title: x === 0 ? 'Play' : 'Pause',
                value: x === 0 ? 1 : 0,
            }),

        }).on('change', ({value}) => {
            tickFunction(value === 1 ? askedFPS : 0)
        });
        const others = this.pane.addFolder({title: 'Additional Monitors', expanded: false})
        logMemory(others, renderer)
    }
}