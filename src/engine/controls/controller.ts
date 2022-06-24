import {
    ACESFilmicToneMapping,
    AxesHelper, CineonToneMapping, LinearToneMapping, NoToneMapping,
    OrthographicCamera, PerspectiveCamera, ReinhardToneMapping,
    Scene, WebGLRenderer,
} from "three";
import {CanvasProportion} from "../types/CanvasProportion.interface";
import {ElementTracer} from "./elementTracer";
import {BladeApi, FolderApi, Pane, TabPageApi} from "tweakpane";
import {Object3DControls} from "./utils/Object3DControls";
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import * as CameraKitPlugin from '@tweakpane/plugin-camerakit';
// @ts-ignore
import * as TweakpaneImagePlugin from 'tweakpane-image-plugin';
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation';
import {BladeController, View} from "@tweakpane/core";
import {CameraControls} from "./utils/CameraControls";
import './controls.css'
import {EngineState} from '../shared/engineState';

export const debugParams = {
    axesHelperLength: 5,
    envMapIntensity: 0,
}

export class Controller {
    public fpsGraph: BladeApi<BladeController<View>>
    private readonly scene: Scene
    private readonly camera: PerspectiveCamera | OrthographicCamera
    private renderer: WebGLRenderer
    private pane: Pane
    protected objectTab: TabPageApi
    protected sceneTab: TabPageApi
    protected statsTab: TabPageApi
    private readonly axesHelper: AxesHelper

    constructor(scene: Scene, camera: PerspectiveCamera | OrthographicCamera, renderer: WebGLRenderer) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.axesHelper = new AxesHelper( 5 );
        this.scene.add(this.axesHelper)
        this.setUpPane()
        const mainCameraFolder = Object3DControls.createFolder('Main Camera', this.sceneTab)
        CameraControls.addForCamera(this.camera, mainCameraFolder)
        this.addScene(this.sceneTab)
        this.logMemory(this.statsTab)
    }
    public initRayTracer(canvas: HTMLCanvasElement, canvasProp: CanvasProportion, camera: PerspectiveCamera | OrthographicCamera) {
        new ElementTracer(canvas, canvasProp, camera, this.scene)
            .initPaneControls(this.objectTab)
    }
    private setUpPane() {
        const container = document.createElement('div')
        const style = document.createElement('style')
        document.head.appendChild(style)
        container.classList.add('__wireframe-right-controls')
        document.body.appendChild(container)
        this.pane = new Pane({
            title: 'Wireframe Engine Gui',
            container,
        });
        this.pane.registerPlugin(EssentialsPlugin);
        this.pane.registerPlugin(RotationPlugin);
        this.pane.registerPlugin(CameraKitPlugin);
        this.pane.registerPlugin(TweakpaneImagePlugin)
        this.fpsGraph = this.pane.addBlade({
            view: 'fpsgraph',
            label: 'fpsgraph',
            lineCount: 2,
        });
        const folders = this.pane.addTab({
            pages: [
                {title: 'Element'},
                {title: 'Scene'},
                {title: 'Monitors'},
            ]
        })
        this.objectTab = folders.pages[0]
        this.sceneTab = folders.pages[1]
        this.statsTab = folders.pages[2]
    }
    private addScene(pane: FolderApi | TabPageApi) : void {
        pane.addInput(debugParams, 'axesHelperLength', {min: 0, max: 20})
            .on('change', ({value}) => {
                this.axesHelper.scale.set(value, value, value)
            });
        // env map
        pane.addInput(debugParams, 'envMapIntensity', {min: 0, max: 10, step: 0.01})
            .on('change', ({value}) => {
                debugParams.envMapIntensity = value
                Object3DControls.updateAllMaterials(this.scene)
            })
        // tone mapping
        pane.addInput({toneMapping: 0}, 'toneMapping', {
            options: {
                None: NoToneMapping,
                Linear: LinearToneMapping,
                Reinhard: ReinhardToneMapping,
                Uncharted2: ReinhardToneMapping,
                Cineon: CineonToneMapping,
                ACESFilmic: ACESFilmicToneMapping,
            }
        }).on('change', ({value}) => {
            this.renderer.toneMapping = Number(value)
            Object3DControls.updateAllMaterials(this.scene)
        })
        pane.addInput({ shadowMap: this.renderer.shadowMap.enabled }, 'shadowMap')
    }
    private logMemory(pane: FolderApi | TabPageApi): void {
        if(window.performance) {
            const perf = window.performance as unknown as {memory: {
                usedJSHeapSize: number,
                totalJSHeapSize: number,
                jsHeapSizeLimit: number,
            }} || null

            const usedMemory = pane.addMonitor({'Used Memory (MB)': perf.memory.usedJSHeapSize / Math.pow(1000, 2)},
                'Used Memory (MB)', {
                    view: 'graph',
                    interval: 3000,
                    min: 0,
                    max: 3900,
                }
            )
            const heap = pane.addMonitor({'Total Heap (MB)': perf.memory.totalJSHeapSize / Math.pow(1000, 2)},
                'Total Heap (MB)', {
                    view: 'graph',
                    interval: 5000,
                    min: 0,
                    max: 3900,
                }
            )
            const heapLimit = pane.addMonitor(
                {'Heap Limit (MB)': perf.memory.jsHeapSizeLimit / Math.pow(1000, 2)},
                'Heap Limit (MB)'
            )
            const triangles = pane.addMonitor(
                this.renderer.info.render, 'triangles', {
                    interval: 3000,
                }
            )
            EngineState
        }
    }
}