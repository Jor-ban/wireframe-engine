import { ProjectSettings } from "./types/ProjectSettings.interface";
import { __DefaultEngine } from './lib/defaultEngine';
import { EngineInterface } from "⚙️/types/Engine.interface";
import { OrbitControlsParser } from "⚙️/lib/parsers/OrbitControlsParser";

export class __ProdEngine extends __DefaultEngine implements EngineInterface {
    private constructor(canvas: HTMLCanvasElement, projectSettings: ProjectSettings) {
        super(canvas)
        super.mode = projectSettings.mode || 'prod'
        this.setCanvasSizes(projectSettings.canvasSizes)
        this.setScene(projectSettings.scene)
        this.setCamera(projectSettings.camera)
        this.setRenderer(projectSettings.renderer)
        this.setAmbientLight(projectSettings.ambientLight)
        if(projectSettings.extensions) {
            super.extensionsList = projectSettings.extensions
            projectSettings.extensions.forEach(ext => {
                if(ext.beforeCreate) ext.beforeCreate(projectSettings)
            })
        }
        if(projectSettings.orbitControls)
            this.orbitControls = OrbitControlsParser.parse(projectSettings.orbitControls, this.camera, canvas)
        this.renderer.render(this.scene, this.camera)
        this.initTick(projectSettings.maxFPS, this.camera)
    }

    public static create(canvas: HTMLCanvasElement, projectSettings: ProjectSettings = {}): Promise<EngineInterface> {
        let eng = new __ProdEngine(canvas, projectSettings)
        eng.extensionsList.forEach(ext => {
            if(ext.afterCreate) ext.afterCreate(eng)
        })
        if(projectSettings.scene?.children?.length)
            return eng.add(...projectSettings.scene?.children)
                .then(async () => {
                    for (const ext of eng.extensionsList) {
                        if(ext.onInit) {
                            const res = await ext.onInit(eng)
                            if(res && res instanceof __ProdEngine) eng = res
                        }
                    }
                    return eng
                })
        else
            return Promise.resolve(eng)
    }
    public override dispose(removeHTMLElement: boolean = false, contextLoss: boolean = true) {
        super.dispose(removeHTMLElement, contextLoss);
        this.extensionsList.forEach(ext => {
            if(ext.beforeDestroy) ext.beforeDestroy(this)
        })
    }
}