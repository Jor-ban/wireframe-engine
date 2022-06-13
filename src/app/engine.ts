import {ProjectSettings} from "./types/ProjectSetings.interface";
import {CanvasProportion} from "./types/CanvasProportion.interface";
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
import {CameraParser} from "./parsers/cameraParser";
import {CustomCamera} from "./types/CustomCamera.interface";
import {CustomScene} from "./types/CustomScene.interface";
import {SceneParser} from "./parsers/sceneParser";
import {CustomRenderer} from "./types/CustomRenderer.interface";
import {RendererParser} from "./parsers/rendererParser";
import {CustomAmbientLight} from "./types/CustomAmbientLight";
import {LightParser} from "./parsers/lightParser";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Controller} from "./controls/controller";

export class WireframeEngine {
    public canvasProportion: CanvasProportion;
    private readonly canvas: HTMLCanvasElement
    private renderer: WebGLRenderer
    private debugger: Controller
    private tickIntervalId: NodeJS.Timer | null = null
    private mainCamera: PerspectiveCamera | OrthographicCamera | null = null
    private scene: Scene
    private stats: Stats | null = null
    private orbitControls: OrbitControls
    private ambientLight: Light | null = null

    constructor(selector: string = "#canvas", projectSettings: ProjectSettings = {}) {
        this.canvas = document.querySelector(selector) as HTMLCanvasElement
        if(!this.canvas) {
            throw new Error('[Engine -> constructor]: selector is wrong, webgl will not render')
        }
        this.setCanvasSizes(projectSettings.canvasSizes, projectSettings.disableResizeUpdate)
        this.setScene(projectSettings.scene)
        this.setMainCamera(projectSettings.camera)
        this.setRenderer(projectSettings.renderer)
        this.setAmbientLight(projectSettings.ambientLight)
        if(projectSettings.objects?.length) {
            this.add(...projectSettings.objects)
        }
        if(projectSettings.lights?.length) {
            this.add(...projectSettings.lights)
        }
        this.setOrbitControls(projectSettings.orbitControls)
        this.renderer.render(this.scene, this.mainCamera)
        this.initTick(projectSettings.disableTick, projectSettings.renderOnMaxFPS)
        this.enableDebug(projectSettings.debug)
        console.log(this)
        this.clearMemoryBeforeClose()
    }

    public setCanvasSizes(canvasSizes ?: CanvasProportion, noResize?: boolean): WireframeEngine {
        if(canvasSizes) {
            this.canvasProportion = canvasSizes
            return this
        } else {
            this.canvasProportion = {
                width: window.innerWidth,
                height: window.innerHeight
            }
            if(!noResize) {
                window.addEventListener('resize', () => {
                    this.canvasProportion.width = window.innerWidth
                    this.canvasProportion.height = window.innerHeight
                    // Update camera
                    if(this.mainCamera instanceof PerspectiveCamera) {
                        this.mainCamera.aspect = window.innerWidth / window.innerHeight
                    }
                    this.mainCamera.updateProjectionMatrix()
                    // Update renderer
                    this.renderer.setSize(window.innerWidth, window.innerHeight)
                })
            }
            return this
        }
    }
    private setOrbitControls(orbitControls ?: boolean) {
        if(orbitControls ?? true) {
            this.orbitControls = new OrbitControls(this.mainCamera, this.canvas)
            this.orbitControls.enableDamping = true
            this.orbitControls.enablePan = true
            this.orbitControls.enableZoom = true
        }
    }
    private initTick(disable ?: boolean, renderOnMaxFPS ?: boolean) {
        if(!disable) {
            const tick = () => {
                this.stats?.begin()
                this.renderer.render(this.scene, this.mainCamera)
                this.stats?.end()
            }
            if(renderOnMaxFPS) {
                this.tickIntervalId = setInterval(tick)
            } else {
                (function windowTick() {
                    tick()
                    window.requestAnimationFrame(windowTick)
                })();
            }
        }
    }
    public setAmbientLight(ambientLight ?: AmbientLight | CustomAmbientLight): WireframeEngine {
        if(this.ambientLight) {
            this.scene.remove(this.ambientLight)
        }
        this.ambientLight = LightParser.parse(ambientLight)
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
    public setRenderer(renderer: WebGLRenderer | CustomRenderer): WireframeEngine {
        this.renderer = RendererParser.parse(this.canvas, this.canvasProportion, renderer)
        return this
    }
    public enableDebug(yesNo ?: boolean): WireframeEngine {
        if(yesNo ?? true) {
            const dbg = new Controller(this.scene, this.mainCamera, this.renderer)
            this.debugger = dbg
            dbg.initRayTracer(this.canvas, this.canvasProportion, this.mainCamera)
            this.stats = dbg.stats
        }
        return this
    }
    public setMainCamera(camera: Camera | CustomCamera | 'perspectiveCamera' | 'orthographicCamera' | undefined): WireframeEngine {
        if(this.mainCamera) {
            this.scene.remove(this.mainCamera)
        }
        this.mainCamera = CameraParser.parse(this.canvasProportion, camera)
        this.scene.add(this.mainCamera)
        return this
    }

    private clearMemoryBeforeClose() {
        window.onbeforeunload = () => {
            clearTimeout(this.debugger.memoryIntervalId)
            clearTimeout(this.tickIntervalId)
        }
    }
}