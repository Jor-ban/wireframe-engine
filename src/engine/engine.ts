import { EngineInterface } from './types/Engine.interface';
import { ProjectSettings } from './types/ProjectSettings.interface';
import logoUrl from './shared/assets/wireframe-logo.svg?url'

export class Engine {
    // @ts-ignore
    public static async create(selector: string = "#canvas", projectSettings: ProjectSettings = {}): Promise<EngineInterface> {
        const mode = this.getMode(projectSettings)
        const canvas = document.querySelector<HTMLCanvasElement>(selector)
        if(mode == 'dev') {
            const splitScreen = document.createElement('div')
            splitScreen.style.display = 'flex'
            splitScreen.style.alignItems = 'center'
            splitScreen.style.justifyContent = 'center'
            splitScreen.style.width = '100vw'
            splitScreen.style.height = '100vh'
            splitScreen.style.overflow = 'hidden'
            splitScreen.style.position = 'absolute'
            splitScreen.style.top = '0'
            splitScreen.style.left = '0'
            splitScreen.style.zIndex = '666'
            splitScreen.style.backgroundColor = '#28292E'
            const logo = document.createElement('img')
            logo.src = logoUrl
            logo.style.width = '500px'
            splitScreen.appendChild(logo)
            document.body.appendChild(splitScreen)
            return await import('./devEngine/devEngine').then(({__DevEngine}) => {
                const engine = new __DevEngine(projectSettings)
                splitScreen.parentNode?.removeChild(splitScreen)
                return engine
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
