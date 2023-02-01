import {FolderApi, Pane, TabPageApi} from "tweakpane";
import {EngineState} from "./engineState";
import {WebGLRenderer} from "three";

export function logMemory(statsTab: TabPageApi | Pane | FolderApi, renderer: WebGLRenderer): void {
    if(window.performance) {
        const perf = window.performance as unknown as {memory: {
                usedJSHeapSize: number,
                totalJSHeapSize: number,
                jsHeapSizeLimit: number,
            }} || null

        if(!perf.memory) {
            const folder = statsTab.addFolder({ title: '[WIREFRAME ERROR]' })
            folder.element.innerHTML = `
                    <h3 style="color: palevioletred">
                    Your browser does not support memory checking, <br>  
                    please use chromium-based browser <br>
                    (for ex. <a href="https://www.google.com/intl/en/chrome/" style="color: white">chrome</a>)
                    </h3>`
            return ;
        }
        const usedMemory = statsTab.addMonitor({'Used Memory (MB)': perf.memory.usedJSHeapSize / Math.pow(1000, 2)},
            'Used Memory (MB)', {
                view: 'graph',
                interval: 3000,
                min: 0,
                max: 3900,
            }
        )
        const heap = statsTab.addMonitor({'Total Heap (MB)': perf.memory.totalJSHeapSize / Math.pow(1000, 2)},
            'Total Heap (MB)', {
                view: 'graph',
                interval: 5000,
                min: 0,
                max: 3900,
            }
        )
        const heapLimit = statsTab.addMonitor(
            {'Heap Limit (MB)': perf.memory.jsHeapSizeLimit / Math.pow(1000, 2)},
            'Heap Limit (MB)'
        )
        const triangles = statsTab.addMonitor(
            renderer.info.render, 'triangles', {
                interval: 3000,
            }
        )
        EngineState.addMonitor(usedMemory, heap, heapLimit, triangles)
    } else {
        console.warn('[Engine -> Controls] Your browser does not support memory checking, please use chromium-based browser')
    }
}