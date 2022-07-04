import './shared/memoryCleaner'
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
import {CustomAmbientLight, CustomLight} from "./types/CustomLight.interface";
import {LightParser} from "./parsers/lightParser";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Controller} from "./controls/controller";
import {MeshParser} from "./parsers/MeshParser";
import {EngineState} from './shared/engineState';

export class WireframeEngine {
    public canvasProportion !: CanvasProportion;
    private readonly canvas: HTMLCanvasElement
    private renderer !: WebGLRenderer
    private controller !: Controller
    private mainCamera !: PerspectiveCamera | OrthographicCamera
    private scene !: Scene
    private fpsGraph: any | null = null
    private orbitControls !: OrbitControls
    private ambientLight !: AmbientLight

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
            this.add(...projectSettings.objects.map(o => MeshParser.parse(o)))
        }
        if(projectSettings.lights?.length) {
            this.add(...projectSettings.lights.map((light: CustomLight | Light) => LightParser.parse(light)))
        }
        this.setOrbitControls(projectSettings.orbitControls)
        this.renderer.render(this.scene, this.mainCamera)
        this.initTick(projectSettings.disableTick, projectSettings.renderOnMaxFPS)
        this.enableDebug(projectSettings.debug)
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
                this.fpsGraph?.begin()
                this.renderer.render(this.scene, this.mainCamera)
                this.fpsGraph?.end();
            }
            if(renderOnMaxFPS) {
                const id = setInterval(tick)
                EngineState.addIntervalId(id)
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
    public setRenderer(renderer: WebGLRenderer | CustomRenderer | undefined): WireframeEngine {
        this.renderer = RendererParser.parse(this.canvas, this.canvasProportion, renderer)
        return this
    }
    public enableDebug(yesNo ?: boolean): WireframeEngine {
        if(yesNo ?? true) {
            const controller = new Controller(this.scene, this.mainCamera, this.renderer, this.ambientLight)
            this.controller = controller
            controller.initRayTracer(this.canvas, this.canvasProportion, this.mainCamera)
            this.fpsGraph = controller.fpsGraph
        }
        return this
    }
    public setMainCamera(camera: Camera | CustomCamera | 'perspectiveCamera' | 'orthographicCamera' | undefined): WireframeEngine {
        if(this.mainCamera) {
            this.scene.remove(this.mainCamera)
        }
        this.mainCamera = CameraParser.parse(this.canvasProportion, camera)
        this.mainCamera.position.set(1, 0.5, 3)
        this.scene.add(this.mainCamera)
        return this
    }
}