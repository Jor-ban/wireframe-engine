import { __DevEngine } from './../devEngine';
import { RightControls } from './right/rightControls';
import { LeftControls } from './left/leftControls';
import { BottomControls } from './bottom/bottomControls';
import { DefinedShortcuts } from "../shortcuts/DefinedShortcuts";
import {hideContextMenu} from "../utils/hideContextMenu";
import {TopBar} from "./topBar/topBar";

export const debugParams = {
    axesHelperLength: 5,
    envMapIntensity: 0,
}

export class __DevController {
    constructor(engineData: __DevEngine) {
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