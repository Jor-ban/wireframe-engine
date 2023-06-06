import { EngineInterface } from './types/Engine.interface';
import { ProjectSettings } from './types/ProjectSettings.interface';
import logoUrl from './shared/assets/wireframe-logo.svg?url'

export class Engine {
    public static async create(htmlElement: HTMLCanvasElement, projectSettings: ProjectSettings): Promise<EngineInterface>
    public static async create(selector: string, projectSettings: ProjectSettings): Promise<EngineInterface>
    public static async create(selectorOrElement: string | HTMLCanvasElement = "#canvas", projectSettings: ProjectSettings = {}): Promise<EngineInterface> {
        const mode = this.getMode(projectSettings)
        let canvas: HTMLCanvasElement
        if(typeof selectorOrElement === 'string') {
            const el = document.querySelector<HTMLCanvasElement>(selectorOrElement)
            if(!el)
                throw new Error(`[Engine -> create]: no element found with selector "${selectorOrElement}"`)
            else
                canvas = el
        } else {
            canvas = selectorOrElement
        }
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
            return await import('./devEngine/devEngine')
                .then(({__DevEngine}) => __DevEngine.create(projectSettings))
                .then(engine=> {
                    splitScreen.parentNode?.removeChild(splitScreen)
                    return engine
                })
        } else if(mode == 'test') {
            return await import('./testEngine/testEngine').then(({__TestEngine}) => {
                return __TestEngine.create(canvas, projectSettings)
            })
        } else {
            return await import('./prodEngine').then(({__ProdEngine}) => {
                return __ProdEngine.create(canvas, projectSettings)
            })
        }
    }

    private static getMode(projectSettings: ProjectSettings): 'dev' | 'prod' | 'test' {
        const env = import.meta.env
        const mode = String(
            projectSettings.mode ??
            (
                window.location.search.includes('mode=test') ? 
                'test' : 
                (env?.MODE ?? 'dev')
            )
        ).toLowerCase() as 'dev' | 'prod' | 'test'
        if(mode !== 'prod') {
            console.log(`%c[Engine -> getMode]: running in ${mode} mode`, 'background-color: #28292E; color: white; padding: 10px; font-weight: bold')
        }
        return mode
    }
}
