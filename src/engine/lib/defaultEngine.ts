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
import {AmbientLightJson, LightJson} from "./parsers/types/LightJson.type";
import { LightParser } from "./parsers/lightParser";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EngineInterface } from '../types/Engine.interface';
import { MeshJson } from "⚙️/lib/parsers/types/MeshJson.type";
import { MeshParser } from "⚙️/lib/parsers/MeshParser";
import { ParserDataType } from "⚙️/lib/guards/parser-data-type";
import { TimeMachine } from "⚙️/services/timeMachine.service";

export class __DefaultEngine implements EngineInterface {
    public canvasProportion !: CanvasProportion;
    public readonly canvas: HTMLCanvasElement
    public renderer !: WRenderer
    public camera !: PerspectiveCamera | OrthographicCamera
    public scene !: Scene
    public orbitControls !: OrbitControls
    public ambientLight !: AmbientLight
    public mode: EngineInterface['mode'] = 'dev'

    protected userAskedFPS: number = 60
    protected timMachine = TimeMachine
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
        this.timMachine.run(this.userAskedFPS)
        this.renderFunction = () => {
            this.renderer.render(this.scene, renderCamera)
        }
        this.timMachine.addListener(this.renderFunction)
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
    public add(...objects: (Object3D | MeshJson | LightJson)[]): Promise<EngineInterface> {
        const els = objects.map(obj => {
            if(obj instanceof Object3D)
                return obj
            else if(ParserDataType.isLightJson(obj))
                return LightParser.parse(obj)
            else
                return MeshParser.parse(obj)
        })
        return Promise.all(els).then(obj3ds => {
            this.scene.add(...obj3ds)
            return Promise.resolve(this)
        })
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
        this.camera.position.set(1, 0.5, 3)
        this.camera.name = 'mainCamera'
        return this
    }
    protected setRenderCamera(camera: PerspectiveCamera | OrthographicCamera): void {
        this.renderCamera = camera
    }
    public dispose(removeHTMLElement: boolean = false, contextLoss: boolean = true): void {
        this.timMachine.removeListener(this.renderFunction)
        if(removeHTMLElement)
            this.renderer.domElement.parentNode?.removeChild(this.renderer.domElement)
        this.renderer.dispose()
        if(contextLoss)
            this.renderer.forceContextLoss()
        this.orbitControls?.dispose()
    }
}