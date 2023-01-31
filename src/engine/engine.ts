import { EngineInterface } from './types/Engine.interface';
import { ProjectSettings } from './types/ProjectSetings.interface';

export class Engine {
    public static async create(selector: string = "#canvas", projectSettings: ProjectSettings = {}): Promise<EngineInterface> {
        const mode = this.getMode(projectSettings)
        const canvas = document.querySelector<HTMLCanvasElement>(selector)
        if(mode == 'dev') {
            return await import('./devEngine/devEngine').then(({__DevEngine}) => {
                return new __DevEngine(projectSettings)
            })
        } else if(mode == 'test') {
            if(!canvas) {
                throw new Error(`[Engine -> create]: no element found with selector "${selector}"`)
            }
            return await import('./testEngine/testEngine').then(({__TestEngine}) => {
                return new __TestEngine(canvas, projectSettings)
            })
        } else {
            if(!canvas) {
                throw new Error(`[Engine -> create]: no element found with selector "${selector}"`)
            }
            return await import('./prodEngine').then(({__ProdEngine}) => {
                return new __ProdEngine(canvas, projectSettings)
            })
        }
    }

    private static getMode(projectSettings: ProjectSettings): 'dev' | 'prod' | 'test' {
        const env = (import.meta as any)?.env?.NODE_ENV
        const mode = String(
            projectSettings.mode ??
            (
                window.location.search.includes('mode=test') ? 
                'test' : 
                (env?.NODE_ENV ?? 'dev')
            )
        ).toLowerCase() as 'dev' | 'prod' | 'test'
        if(mode !== 'prod') {
            console.log(`%c[Engine -> getMode]: running in ${mode} mode`, 'background-color: #28292E; color: white; padding: 10px; font-weight: bold')
        }
        return mode
    }
}
