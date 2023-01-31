import { __ProdEngine } from '../prodEngine';
import { ProjectSettings } from '../types/ProjectSetings.interface';
import { TestControls } from './testControls';

export class __TestEngine extends __ProdEngine {
    constructor(canvas: HTMLCanvasElement, projectSettings: ProjectSettings) {
        super(canvas, projectSettings)
        new TestControls(this.userAskedFPS, this.renderer)
    }
}