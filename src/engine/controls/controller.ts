import {
    AmbientLight,
    OrthographicCamera, PerspectiveCamera,
    Scene, WebGLRenderer,
} from 'three';
import {BladeApi} from "tweakpane";

import {BladeController, View} from "@tweakpane/core";
import './controls.css'
import { RightControls } from './rightControls';
import { CanvasProportion } from '../types/CanvasProportion.interface';
import { ElementTracer } from './elementTracer';
import { LeftControls } from './leftControls';

export const debugParams = {
    axesHelperLength: 5,
    envMapIntensity: 0,
}

export class Controller {
    public fpsGraph: BladeApi<BladeController<View>>
    private readonly scene: Scene
    private readonly rightControls: RightControls
    private leftControls: LeftControls
    private elementTracer: ElementTracer

    constructor(scene: Scene, camera: PerspectiveCamera | OrthographicCamera, renderer: WebGLRenderer, ambientLight: AmbientLight) {
        this.scene = scene
        this.rightControls = new RightControls(scene, renderer, camera, ambientLight)
        this.leftControls = new LeftControls(scene, this.rightControls)
        this.fpsGraph = this.leftControls.fpsGraph
    }
    public initRayTracer(canvas: HTMLCanvasElement, canvasProp: CanvasProportion, camera: PerspectiveCamera | OrthographicCamera) {
        this.elementTracer = new ElementTracer(canvas, canvasProp, camera, this.scene)
    }
}