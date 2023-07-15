import { __ProdEngine } from '../prodEngine';
import { ProjectSettings } from '../types/ProjectSettings.interface';
import { TestControls } from './testControls';
import { EngineInterface } from "⚙️/types/Engine.interface";
import { WRenderer } from "⚙️/lib";

export class __TestEngine {
    public testControls: TestControls
    public static create(canvas: HTMLCanvasElement, projectSettings: ProjectSettings = {}): Promise<EngineInterface> {
        return __ProdEngine.create(canvas, {...projectSettings, mode: 'test'})
            .then(engine => {
                engine['testControls'] = new TestControls(60, engine.renderer as WRenderer)
                return engine
            })
    }
}