import { RightControls } from './UI/right/rightControls';
import { LeftControls } from './UI/left/leftControls';
import { BottomControls } from './UI/bottom/bottomControls';
import { EngineInterface } from '../types/Engine.interface';
import { DefinedShortcuts } from "./shortcuts/DefinedShortcuts";
import {hideContextMenu} from "./utils/hideContextMenu";
import {TopBar} from "./UI/topBar/topBar";

export const debugParams = {
    axesHelperLength: 5,
    envMapIntensity: 0,
}

export class Controller {
    constructor(engineData: EngineInterface) {
        import('./controls.css')
        const { devCamera, scene } = engineData
        new RightControls(engineData)
        new LeftControls(engineData)
        new BottomControls()
        if(!devCamera) throw new Error('devCamera is null')
        new TopBar(devCamera, scene)
        DefinedShortcuts.init()
        hideContextMenu()
    }
}