import {
    OrthographicCamera, PerspectiveCamera,
    Scene, WebGLRenderer,
} from "three";
import * as Stats from 'stats.js'
import {CanvasProportion} from "../types/CanvasProportion.interface";
import {ElementTracer} from "./elementTracer";

export const debugParams = {
    axesHelperLength: 5,
    envMapIntensity: 0,
}

export class Controller {
    public stats: null | Stats = null
    private readonly scene: Scene
    private camera: PerspectiveCamera | OrthographicCamera
    private renderer: WebGLRenderer
    public memoryIntervalId: NodeJS.Timer | null = null

    constructor(scene: Scene, camera: PerspectiveCamera | OrthographicCamera, renderer: WebGLRenderer) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        // memory checking
        this.logMemory()
        // Stats
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
    }
    public initRayTracer(canvas: HTMLCanvasElement, canvasProp: CanvasProportion, camera: PerspectiveCamera | OrthographicCamera) {
        new ElementTracer(canvas, canvasProp, camera, this.scene, this.renderer)
    }
    logMemory(): void {
        const perf = window.performance as unknown as {memory: {
                usedJSHeapSize: number,
                totalJSHeapSize: number,
                jsHeapSizeLimit: number,
            }} || null

        if(perf) {
            this.memoryIntervalId = setInterval(() => {
                console.log(` Performance.memory ::
            heap: ${perf.memory.usedJSHeapSize /Math.pow(1000, 2)} MB, 
            total: ${perf.memory.totalJSHeapSize /Math.pow(1000, 2)} MB, 
            limit: ${perf.memory.jsHeapSizeLimit /Math.pow(1000, 2)} MB`
                );
            }, 20000)
        }
    }
}