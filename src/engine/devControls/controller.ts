import {BladeApi} from "tweakpane";
import {BladeController, View} from "@tweakpane/core";
import { RightControls } from './right/rightControls';
import { ElementTracer } from './left/utils/elementTracer';
import { LeftControls } from './left/leftControls';
import { BottomControls } from './bottom/bottomControls';
import { EngineInterface } from '../types/Engine.interface';
import {Shortcuts} from "./shortcuts";
import {hideContextMenu} from "./shared/utils/hideContextMenu";
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
    // private elementTracer !: ElementTracer

    constructor(engineData: EngineInterface) {
        require('./controls.css')
        const { mainCamera, scene } = engineData
        this.rightControls = new RightControls(engineData)
        this.leftControls = new LeftControls(engineData)
        this.fpsGraph = this.leftControls.fpsGraph
        this.bottomControls = new BottomControls()
        // this.elementTracer = new ElementTracer(engineData)
        new TopBar(mainCamera, scene)
        Shortcuts.init()
        hideContextMenu()
    }
}