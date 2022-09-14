import {BladeApi} from "tweakpane";
import {BladeController, View} from "@tweakpane/core";
import { RightControls } from './right/rightControls';
import { ElementTracer } from './elementTracer';
import { LeftControls } from './left/leftControls';
import { BottomControls } from './bottom/bottomControls';
import { EngineInterface } from '../types/Engine.interface';
import {Shortcuts} from "./shortcuts";
import {hideContextMenu} from "./utils/hideContextMenu";
import {TopBar} from "./topBar/topBar";

export const debugParams = {
    axesHelperLength: 5,
    envMapIntensity: 0,
}

export class Controller {
    public fpsGraph: BladeApi<BladeController<View>> | null
    private readonly rightControls: RightControls
    private readonly bottomControls: BottomControls
    private leftControls: LeftControls
    private elementTracer !: ElementTracer

    constructor({scene, renderer, mainCamera, ambientLight, canvas, canvasProportion}: EngineInterface) {
        require('./controls.css')
        this.rightControls = new RightControls(scene, renderer, mainCamera, ambientLight)
        this.leftControls = new LeftControls(scene, this.rightControls)
        this.fpsGraph = this.leftControls.fpsGraph
        this.bottomControls = new BottomControls()
        this.elementTracer = new ElementTracer(canvas, canvasProportion, mainCamera, scene)
        new TopBar()
        Shortcuts.init()
        hideContextMenu()
    }
}