import { ProjectSettings } from "./types/ProjectSettings.interface";
import { MeshParser } from "./lib/parsers/MeshParser";
import { __DefaultEngine } from './lib/defaultEngine';
import { EngineInterface } from "⚙️/types/Engine.interface";
import { OrbitControlsParser } from "⚙️/lib/parsers/OrbitControlsParser";

export class __ProdEngine extends __DefaultEngine {
    private constructor(canvas: HTMLCanvasElement, projectSettings: ProjectSettings) {
        super(canvas)
        this.setCanvasSizes(projectSettings.canvasSizes)
        this.setScene(projectSettings.scene)
        this.setCamera(projectSettings.camera)
        this.setRenderer(projectSettings.renderer)
        this.setAmbientLight(projectSettings.ambientLight)
        if(projectSettings.extensions)
            super.extensionsList = projectSettings.extensions
        if(projectSettings.orbitControls)
            this.orbitControls = OrbitControlsParser.parse(projectSettings.orbitControls, this.camera, canvas)
        this.renderer.render(this.scene, this.camera)
        this.initTick(projectSettings.maxFPS, this.camera)
    }

    public static create(canvas: HTMLCanvasElement, projectSettings: ProjectSettings = {}): Promise<EngineInterface> {
        let eng = new __ProdEngine(canvas, projectSettings)
        if(projectSettings.scene?.children?.length)
            return MeshParser.parseAll(projectSettings.scene.children).then(obj3ds => eng.add(...obj3ds))
                .then(async () => {
                    eng.extensionsList.forEach(async (ext) => {
                        const res = await ext(eng)
                        if(res && res instanceof __ProdEngine) eng = res
                    })
                    return eng
                })
        else
            return Promise.resolve(eng)
    }
}