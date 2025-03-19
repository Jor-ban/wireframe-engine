import { __ProdEngine } from '../prodEngine';
import { ProjectSettings } from '@/engine';
import { TestControls } from './testControls';
import { EngineInterface } from "⚙️/types/Engine.interface";
import { WRenderer } from "⚙️/lib";

export class __TestEngine {
    public static async create(canvas: HTMLCanvasElement, projectSettings: ProjectSettings = {}): Promise<EngineInterface> {
        const engine = await __ProdEngine.create(canvas, {...projectSettings, mode: 'test'});
        const testControls = new TestControls(60, engine.renderer as WRenderer);
        engine['testControls'] = testControls
        engine.addTweak = testControls.addTweak.bind(testControls);
        return engine;
    }
}