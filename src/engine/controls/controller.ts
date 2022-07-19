import {BladeApi} from "tweakpane";
import {BladeController, View} from "@tweakpane/core";
import './controls.css'
import { RightControls } from './right/rightControls';
import { ElementTracer } from './elementTracer';
import { LeftControls } from './left/leftControls';
import { BottomControls } from './bottom/bottomControls';
import { WireframeEngine } from '../engine';
import { EngineInterface } from '../types/Engine.interface';

export const debugParams = {
    axesHelperLength: 5,
    envMapIntensity: 0,
}

export class Controller {
    public fpsGraph: BladeApi<BladeController<View>>
    private readonly rightControls: RightControls
    private readonly bottomControls: BottomControls
    private leftControls: LeftControls
    private elementTracer !: ElementTracer

    constructor({scene, renderer, mainCamera, ambientLight, canvas, canvasProportion}: EngineInterface) {
        this.rightControls = new RightControls(scene, renderer, mainCamera, ambientLight)
        this.leftControls = new LeftControls(scene, this.rightControls)
        this.fpsGraph = this.leftControls.fpsGraph
        this.bottomControls = new BottomControls()
        this.elementTracer = new ElementTracer(canvas, canvasProportion, mainCamera, scene)
    }
}