import { __ProdEngine } from '../prodEngine';
import { ProjectSettings } from '../types/ProjectSettings.interface';
import { TestControls } from './testControls';
import { EngineInterface } from "⚙️/types/Engine.interface";

export class __TestEngine {
    public static create(canvas: HTMLCanvasElement, projectSettings: ProjectSettings = {}): Promise<EngineInterface> {
        return __ProdEngine.create(canvas, projectSettings)
            .then(engine => {
                new TestControls(60, engine.renderer)
                return engine
            })
    }
}