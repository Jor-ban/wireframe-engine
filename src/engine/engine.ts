import { AnimationFrame } from './services/animationFrame.service';
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
import { MeshParser } from "./parsers/MeshParser";
import { EngineInterface } from './types/Engine.interface';
import {
    bottomControlsHeight,
    leftControlsWidth,
    rightControlsWidth,
    topBarHeight
} from "./shared/consts/controlsStyles";
import { LightWithHelper } from "./lib/lightsWithHelper";
import { CustomOrbitControls } from './parsers/types/CustomOrbitControls.interface';
import {CameraWithHelper, OrthographicCameraWithHelper } from './lib/camerasWithHelper';

export class WireframeEngine implements EngineInterface {
    public canvasProportion !: CanvasProportion;
    public readonly canvas: HTMLCanvasElement
    public renderer !: WebGLRenderer
    public controller !: unknown
    public camera !: CameraWithHelper | OrthographicCameraWithHelper | PerspectiveCamera | OrthographicCamera
    public scene !: Scene
    public orbitControls !: OrbitControls
    public ambientLight !: AmbientLight
    public devCamera: PerspectiveCamera | null = null

    private userAskedFPS: number = 60
    private mode: string | undefined = 'dev'
    private animationMachine = AnimationFrame

    constructor(selector: string = "#canvas", projectSettings: ProjectSettings = {}) {
        const canvas = document.querySelector<HTMLCanvasElement>(selector)
        if(!canvas) {
            throw new Error('[Engine -> constructor]: selector is wrong, webgl will not render')
        }
        this.canvas = canvas
        this.setMode(projectSettings.mode)
        this.bootstrap(projectSettings)
    }

    private bootstrap(projectSettings: ProjectSettings): void {
        if(this.mode === 'test' || this.mode === 'prod') {
            this.setCanvasSizes(projectSettings.canvasSizes)
            this.setScene(projectSettings.scene)
            this.setProdCamera(projectSettings.camera)
            this.setRenderer(projectSettings.renderer)
            this.setAmbientLight(projectSettings.ambientLight)
            if(projectSettings.objects?.length) {
                this.add(...projectSettings.objects.map(o => MeshParser.parse(o)))
            }
            if(projectSettings.lights?.length) {
                this.add(...projectSettings.lights.map((light: CustomLight | Light) => LightParser.parse(light)))
            }
            this.setOrbitControls(projectSettings.orbitControls)
            this.renderer.render(this.scene, this.camera)
            this.initTick(projectSettings.maxFPS)
            if(this.mode !== 'prod') {
                this.enableTestControls()
            }
        } else if(this.mode === 'dev' || this.mode === 'development') {
            this.setDevCanvas()
            this.setScene(projectSettings.scene)
            this.setProdCamera()
            this.setDevCamera()
            this.setRenderer()
            this.setAmbientLight(projectSettings.ambientLight)
            if(projectSettings.objects?.length) {
                this.add(...projectSettings.objects.map(o => MeshParser.parse(o)))
            }
            if(projectSettings.lights?.length) {
                projectSettings.lights.forEach((light: CustomLight | Light) => {
                    const parsedLight = LightParser.parse(light)
                    const lightWithHelper = LightWithHelper.from(parsedLight)
                    if(lightWithHelper instanceof AmbientLight) {
                        this.add(lightWithHelper)
                    } else if(lightWithHelper) { // no undefined
                        lightWithHelper.addToScene(this.scene)
                    }
                })
            }
            if(this.devCamera) {
                this.renderer.render(this.scene, this.devCamera)
                this.initTick()
                this.setOrbitControls(true)
            }
            this.enableDevControls()
        }
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
                if(this.camera instanceof PerspectiveCamera) {
                    this.camera.aspect = window.innerWidth / window.innerHeight
                }
                if(this.devCamera) {
                    this.devCamera.aspect = window.innerWidth / window.innerHeight
                    this.devCamera.updateProjectionMatrix()
                }
                this.camera.updateProjectionMatrix()
                // Update renderer
                this.renderer?.setSize(window.innerWidth, window.innerHeight)
            })
        }
        return this
    }
    private setMode(parameterMode ?: string): void {
        const env = (import.meta as any)?.env?.NODE_ENV
        this.mode = String(
            parameterMode ??
            (
                window.location.search.includes('mode=test') ? 
                'test' : 
                (env?.NODE_ENV ?? 'development')
            )
        ).toLowerCase()
        if(this.mode !== 'prod') {
            console.log(`%c[WireframeEngine -> bootstrap]: running in ${this.mode} mode`, 'background-color: #28292E; color: white; padding: 10px; font-weight: bold')
        }
    }
    private setDevCanvas(): void {
        this.canvas.classList.add('__wireframe-dev-canvas')
        this.canvas.style.position = 'absolute'
        this.canvas.style.left = `${leftControlsWidth}px`
        this.canvas.style.top = `${topBarHeight}px`
        this.canvasProportion = {
            width: window.innerWidth - leftControlsWidth - rightControlsWidth,
            height: window.innerHeight - topBarHeight - bottomControlsHeight
        }
        document.body.style.overflow = 'hidden'
        window.addEventListener('resize', () => {
            const newCanvasWidth = window.innerWidth - leftControlsWidth - rightControlsWidth
            const newCanvasHeight = window.innerHeight - topBarHeight - bottomControlsHeight
            this.canvasProportion.width = newCanvasWidth
            this.canvasProportion.height = newCanvasHeight
            // Update camera
            if(this.devCamera) {
                this.devCamera.aspect = newCanvasWidth / newCanvasHeight
                this.devCamera.updateProjectionMatrix()
            }
            // Update renderer
            this.renderer?.setSize(newCanvasWidth, newCanvasHeight)
        })
    }
    private setOrbitControls(orbitControls ?: boolean | CustomOrbitControls): void {
        if(orbitControls) {
            if(this.mode === 'dev' && this.devCamera) {
                this.orbitControls = new OrbitControls(this.devCamera, this.canvas)
            } else {
                this.orbitControls = new OrbitControls(this.camera, this.canvas)
            }
            if(typeof orbitControls === 'object') {
                this.orbitControls.enableDamping = orbitControls.damping ?? true
                this.orbitControls.enablePan = orbitControls.panning ?? true
                this.orbitControls.enableZoom = orbitControls.zoom ?? true
                this.orbitControls.enableRotate = orbitControls.rotate ?? true
            } else {
                this.orbitControls.enableDamping = true
                this.orbitControls.enablePan = true
                this.orbitControls.enableZoom = true
                this.orbitControls.enableRotate = true
            }
        }
    }
    private initTick(askedFps ?: number): void {
        const camera = this.mode === 'dev' && this.devCamera ? this.devCamera : this.camera
        this.userAskedFPS = askedFps ?? 60
        this.animationMachine.run(this.userAskedFPS)
        this.animationMachine.addListener(() => {
            this.renderer.render(this.scene, camera)
        })
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
        import("./devControls/controller").then(({Controller}) => {
            this.controller = new Controller(this)
        })
    }
    private enableTestControls() {
        import("./testControls/testControls").then(({TestControls}) => {
            new TestControls(this.userAskedFPS, this.renderer)
        })
    }
    private setDevCamera() {
        this.devCamera = new PerspectiveCamera(60, this.canvasProportion.width / this.canvasProportion.height, 0.1, 1000)
        this.devCamera.uuid = '__wireframe-dev-camera__'
        this.devCamera.position.set(1, 0.5, 3)
        this.scene.add(this.devCamera)
    }
    public setProdCamera(camera?: Camera | CustomCamera | 'perspectiveCamera' | 'orthographicCamera' | undefined): WireframeEngine {
        if(this.camera) {
            this.scene.remove(this.camera)
        }
        if(this.mode === 'dev') {
            this.camera = CameraWithHelper.from(this.camera)
            // @ts-ignore
            this.camera.addToScene(this.scene)
        } else {
            this.camera = CameraParser.parse(this.canvasProportion, camera)
            this.scene.add(this.camera)
        }
        this.camera.position.set(1, 0.5, 3)
        return this
    }
}