import { __DevEngine } from '../devEngine';
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
    public readonly rightControls !: RightControls
    public readonly leftControls !: LeftControls
    public readonly bottomControls !: BottomControls
    public readonly topBar !: TopBar
    constructor(engineData: __DevEngine) {
        const { devCamera, scene } = engineData
        this.rightControls = new RightControls(engineData)
        this.leftControls = new LeftControls(engineData)
        this.bottomControls = new BottomControls()
        this.topBar = new TopBar(devCamera, scene)
        DefinedShortcuts.init()
        hideContextMenu()
    }
}