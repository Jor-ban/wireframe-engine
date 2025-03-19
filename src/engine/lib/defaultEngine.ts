import { WRenderer } from './classes/WRenderer';
import '../shared/memoryCleaner'
import { CanvasProportion } from "./parsers/types/CanvasProportion.interface";
import {
    AmbientLight,
    Camera,
    Object3D,
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { CameraParser } from "./parsers/cameraParser";
import { CameraJson } from "./parsers/types/CameraJson.type";
import { SceneJson } from "./parsers/types/SceneJson.type";
import { SceneParser } from "./parsers/sceneParser";
import { RendererJson } from "./parsers/types/RendererJson.type";
import { RendererParser } from "./parsers/rendererParser";
import { AmbientLightJson, LightJson } from "./parsers/types/LightJson.type";
import { LightParser } from "./parsers/lightParser";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EngineInterface } from '@/engine';
import { MeshJson } from "⚙️/lib/parsers/types/MeshJson.type";
import { TimeMachine } from "⚙️/services/timeMachine.service";
import { EnginePluginInterface } from "⚙\uFE0F/types/EnginePluginInterface";
import { ParsingManager } from "⚙️/lib/parsers/ParsingManager";

export class __DefaultEngine implements EngineInterface {
    public canvasProportion !: CanvasProportion;
    public readonly canvas: HTMLCanvasElement
    public renderer !: WRenderer
    public camera !: PerspectiveCamera | OrthographicCamera
    public scene !: Scene
    public orbitControls !: OrbitControls
    public ambientLight !: AmbientLight
    public mode: EngineInterface['mode'] = 'dev'
    public extensionsList: EnginePluginInterface[] = []
    public parsingManager = new ParsingManager()

    protected userAskedFPS: number = 60
    protected timeMachine = TimeMachine.newInstance()
    protected renderCamera = this.camera

    private renderFunction: (deltaTime: number) => void = () => {}

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
    }

    public setCanvasSizes(canvasSizes ?: CanvasProportion): EngineInterface {
        if(canvasSizes?.width && canvasSizes?.height) {
            this.canvasProportion = canvasSizes
        } else {
            this.canvasProportion = {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
        if(!canvasSizes?.disableResizeUpdate) {
            window.addEventListener('resize', () => {
                this.canvasProportion.width = window.innerWidth
                this.canvasProportion.height = window.innerHeight
                // Update camera
                if(this.camera instanceof PerspectiveCamera) {
                    this.camera.aspect = window.innerWidth / window.innerHeight
                    this.camera.updateProjectionMatrix()
                }
                this.camera.updateProjectionMatrix()
                // Update renderer
                this.renderer?.setSize(window.innerWidth, window.innerHeight)
                if(canvasSizes?.updateStyle !== false) {
                    this.canvas.style.width = `${window.innerWidth}px`
                    this.canvas.style.height = `${window.innerHeight}px`
                }
            })
        }
        if(canvasSizes?.updateStyle !== false) {
            this.canvas.style.width = `${this.canvasProportion.width}px`
            this.canvas.style.height = `${this.canvasProportion.height}px`
        }
        return this
    }
    
    protected initTick(askedFps: number = 60, renderCamera: PerspectiveCamera | OrthographicCamera): void {
        this.userAskedFPS = askedFps
        this.timeMachine.run(this.userAskedFPS)
        this.renderFunction = () => {
            this.renderer.render(this.scene, renderCamera)
        }
        this.timeMachine.addListener(this.renderFunction)
    }
    public setAmbientLight(ambientLight ?: AmbientLight | AmbientLightJson): EngineInterface {
        if(this.ambientLight) {
            this.scene.remove(this.ambientLight)
        }
        this.ambientLight = LightParser.parseAmbientLight(ambientLight || {})
        this.scene.add(this.ambientLight)
        return this
    }
    public setScene(scene ?: Scene | SceneJson): EngineInterface {
        this.scene = SceneParser.parse(scene)
        return this
    }
    public async add(...objects: (Object3D | MeshJson | LightJson)[]): Promise<EngineInterface> {
        const els = objects.map(obj => {
            return this.parsingManager.parse(obj)
        })
        const obj3ds = await Promise.all(els);
        this.scene.add(...obj3ds);
        return this;
    }
    public remove(...objects: Object3D[]): EngineInterface {
        this.scene.remove(...objects);
        return this
    }

    public setRenderer(renderer?: WebGLRenderer | RendererJson): EngineInterface {
        if(renderer instanceof WebGLRenderer) {
            this.renderer = WRenderer.from(renderer)
        } else {
            this.renderer = RendererParser.parse(this.canvas, this.canvasProportion, renderer)
        }
        return this
    }
    public setCamera(camera?: Camera | CameraJson | 'perspectiveCamera' | 'orthographicCamera' | undefined): EngineInterface {
        if(this.camera) {
            this.scene.remove(this.camera)
        }

        this.camera = CameraParser.parse(this.canvasProportion, camera)
        this.scene.add(this.camera)
        this.camera.name = 'mainCamera'
        return this
    }
    protected setRenderCamera(camera: PerspectiveCamera | OrthographicCamera): void {
        this.renderCamera = camera
    }
    public dispose(removeHTMLElement: boolean = false, contextLoss: boolean = true): void {
        this.timeMachine.removeListener(this.renderFunction)
        if(removeHTMLElement)
            this.renderer.domElement.parentNode?.removeChild(this.renderer.domElement)
        this.renderer.dispose()
        if(contextLoss)
            this.renderer.forceContextLoss()
        this.orbitControls?.dispose()
    }
    public use(extension: EnginePluginInterface): EngineInterface {
        this.extensionsList.push(extension)
        return this
    }
    public setProperty<T>(property: string, value: T): EngineInterface {
        // @ts-ignore
        this[property] = value
        return this
    }
    public getProperty<T>(property: string): T {
        // @ts-ignore
        return this[property]
    }

    public addTweak() {
        // NOOP
        console.log('noop')
    }
}