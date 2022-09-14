import './shared/memoryCleaner'
import { ProjectSettings } from "./types/ProjectSetings.interface";
import { CanvasProportion } from "./parsers/types/CanvasProportion.interface";
import {
    AmbientLight,
    Camera,
    Light,
    Object3D,
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";
import { CameraParser } from "./parsers/cameraParser";
import { CustomCamera } from "./parsers/types/CustomCamera.interface";
import { CustomScene } from "./parsers/types/CustomScene.interface";
import { SceneParser } from "./parsers/sceneParser";
import { CustomRenderer } from "./parsers/types/CustomRenderer.interface";
import { RendererParser } from "./parsers/rendererParser";
import { CustomAmbientLight, CustomLight } from "./parsers/types/CustomLight.interface";
import { LightParser } from "./parsers/lightParser";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Controller } from "./devControls/controller";
import { MeshParser } from "./parsers/MeshParser";
import { EngineState } from './shared/engineState';
import { EngineInterface } from './types/Engine.interface';
import { TestControls } from "./testControls/testControls";
import {
    bottomControlsHeight,
    leftControlsWidth,
    rightControlsWidth,
    topBarHeight
} from "./shared/consts/controlsStyles";

export class WireframeEngine implements EngineInterface {
    public canvasProportion !: CanvasProportion;
    public readonly canvas: HTMLCanvasElement
    public renderer !: WebGLRenderer
    public controller !: Controller
    public mainCamera !: PerspectiveCamera | OrthographicCamera
    public scene !: Scene
    public fpsGraph: any | null = null
    public orbitControls !: OrbitControls
    public ambientLight !: AmbientLight

    private tickIntervalId : NodeJS.Timeout | null = null
    private animationFrameId: number | null = null
    private userAskedFPS: number = 60
    private mode: string | undefined = 'dev'

    constructor(selector: string = "#canvas", projectSettings: ProjectSettings = {}) {
        this.canvas = document.querySelector(selector) as HTMLCanvasElement
        if(!this.canvas) {
            throw new Error('[Engine -> constructor]: selector is wrong, webgl will not render')
        }
        this.bootstrap(projectSettings)
    }

    private bootstrap(projectSettings: ProjectSettings): void {
        this.mode = projectSettings.mode || window.location.search.includes('mode=test') ? 'test' : process.env.NODE_ENV
        if(this.mode === 'test') {
            this.setCanvasSizes(projectSettings.canvasSizes)
            this.setScene(projectSettings.scene)
            this.setMainCamera(projectSettings.camera)
            this.setRenderer(projectSettings.renderer)
            this.setAmbientLight(projectSettings.ambientLight)
            if(projectSettings.objects?.length) {
                this.add(...projectSettings.objects.map(o => MeshParser.parse(o)))
            }
            if(projectSettings.lights?.length) {
                this.add(...projectSettings.lights.map((light: CustomLight | Light) => LightParser.parse(light)))
            }
            this.setOrbitControls(projectSettings.orbitControls)
            this.renderer.render(this.scene, this.mainCamera)
            this.initTick(projectSettings.maxFPS)
            this.enableTestControls()
        } else if(this.mode === 'dev' || this.mode === 'development') {
            this.setDevCanvas()
            this.setScene(projectSettings.scene)
            this.setMainCamera()
            this.setRenderer()
            this.setAmbientLight(projectSettings.ambientLight)
            if(projectSettings.objects?.length) {
                this.add(...projectSettings.objects.map(o => MeshParser.parse(o)))
            }
            if(projectSettings.lights?.length) {
                this.add(...projectSettings.lights.map((light: CustomLight | Light) => LightParser.parse(light)))
            }
            this.setOrbitControls(true)
            this.renderer.render(this.scene, this.mainCamera)
            this.initTick()
            this.enableDevControls()
        }
        window.addEventListener('load', this.tick.bind(this))
    }

    public setCanvasSizes(canvasSizes ?: CanvasProportion): WireframeEngine {
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
                if(this.mainCamera instanceof PerspectiveCamera) {
                    this.mainCamera.aspect = window.innerWidth / window.innerHeight
                }
                this.mainCamera.updateProjectionMatrix()
                // Update renderer
                this.renderer?.setSize(window.innerWidth, window.innerHeight)
            })
        }
        return this
    }
    private setDevCanvas(): void {
        this.canvas.classList.add('__wireframe-dev-canvas')
        this.canvas.style.marginLeft = `${leftControlsWidth}px`
        this.canvasProportion = {
            width: window.innerWidth - leftControlsWidth - rightControlsWidth,
            height: window.innerHeight - topBarHeight - bottomControlsHeight
        }
        window.addEventListener('resize', () => {
            const newCanvasWidth = window.innerWidth - leftControlsWidth - rightControlsWidth
            const newCanvasHeight = window.innerHeight - topBarHeight - bottomControlsHeight
            this.canvasProportion.width = newCanvasWidth
            this.canvasProportion.height = newCanvasHeight
            // Update camera
            if(this.mainCamera instanceof PerspectiveCamera) {
                this.mainCamera.aspect = newCanvasWidth / newCanvasHeight
            }
            this.mainCamera.updateProjectionMatrix()
            // Update renderer
            this.renderer?.setSize(newCanvasWidth, newCanvasHeight)
        })
    }
    private setOrbitControls(orbitControls ?: boolean) {
        if(orbitControls) {
            this.orbitControls = new OrbitControls(this.mainCamera, this.canvas)
            this.orbitControls.enableDamping = true
            this.orbitControls.enablePan = true
            this.orbitControls.enableZoom = true
        }
    }
    private initTick(maxFPS: number = 60) {
        this.userAskedFPS = maxFPS
        this.setFPS(maxFPS)
    }
    public setFPS(maxFPS: number) {
        if(this.tickIntervalId !== null) {
            clearInterval(this.tickIntervalId)
        } else if(this.animationFrameId !== null) {
            window.cancelAnimationFrame(this.animationFrameId)
        }
        if(maxFPS <= 0) { // if maxFPS is 0 or less, render once
            this.tick()
        } else if(maxFPS === Infinity) { // if maxFPS is Infinity, render as often as possible
            this.tickIntervalId = setInterval(this.tick.bind(this))
            EngineState.addIntervalId(this.tickIntervalId)
        } else if(maxFPS === 60) { // if maxFPS is - 60, render in max comfort mode
            const frame = () => {
                this.tick()
                this.animationFrameId = window.requestAnimationFrame(frame) // TODO make own requestAnimationFrame service for better performance and better control & animations
            }
            frame()
        } else {
            this.tickIntervalId = setInterval(this.tick.bind(this), 1000 / maxFPS)
            EngineState.addIntervalId(this.tickIntervalId)
        }
    }
    private tick() {
        this.fpsGraph?.begin()
        this.renderer.render(this.scene, this.mainCamera)
        this.fpsGraph?.end()
    }
    public setAmbientLight(ambientLight ?: AmbientLight | CustomAmbientLight): WireframeEngine {
        if(this.ambientLight) {
            this.scene.remove(this.ambientLight)
        }
        this.ambientLight = LightParser.parseAmbientLight(ambientLight || {})
        this.scene.add(this.ambientLight)
        return this
    }
    public setScene(scene ?: Scene | CustomScene): WireframeEngine {
        this.scene = SceneParser.parse(scene)
        return this
    }
    public add(...objects: Object3D[]): WireframeEngine {
        this.scene.add(...objects)
        return this
    }
    public setRenderer(renderer?: WebGLRenderer | CustomRenderer): WireframeEngine {
        this.renderer = RendererParser.parse(this.canvas, this.canvasProportion, renderer)
        return this
    }
    private enableDevControls() {
        const controller = new Controller({
            mainCamera: this.mainCamera,
            renderer: this.renderer,
            ambientLight: this.ambientLight,
            scene: this.scene,
            canvas: this.canvas,
            canvasProportion: this.canvasProportion,
        })
        this.fpsGraph = controller.fpsGraph
        this.controller = controller
    }
    private enableTestControls() {
        const testController = new TestControls(this.setFPS.bind(this), this.userAskedFPS, this.renderer)
        this.fpsGraph = testController.fpsGraph
    }
    public setMainCamera(camera?: Camera | CustomCamera | 'perspectiveCamera' | 'orthographicCamera' | undefined): WireframeEngine {
        if(this.mainCamera) {
            this.scene.remove(this.mainCamera)
        }
        this.mainCamera = CameraParser.parse(this.canvasProportion, camera)
        this.mainCamera.position.set(1, 0.5, 3)
        this.scene.add(this.mainCamera)
        return this
    }
}