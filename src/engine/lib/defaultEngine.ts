import { AnimationFrame } from '../services/animationFrame.service';
import '../shared/memoryCleaner'
import { CanvasProportion } from "../parsers/types/CanvasProportion.interface";
import {
    AmbientLight,
    Camera,
    Object3D,
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";
import { CameraParser } from "../parsers/cameraParser";
import { CustomCamera } from "../parsers/types/CustomCamera.interface";
import { CustomScene } from "../parsers/types/CustomScene.interface";
import { SceneParser } from "../parsers/sceneParser";
import { CustomRenderer } from "../parsers/types/CustomRenderer.interface";
import { RendererParser } from "../parsers/rendererParser";
import { CustomAmbientLight } from "../parsers/types/CustomLight.interface";
import { LightParser } from "../parsers/lightParser";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EngineInterface } from '../types/Engine.interface';
import { CameraWithHelper, OrthographicCameraWithHelper } from './devClasses/camerasWithHelper';

export class __DefaultEngine implements EngineInterface {
    public canvasProportion !: CanvasProportion;
    public readonly canvas: HTMLCanvasElement
    public renderer !: WebGLRenderer
    public camera !: CameraWithHelper | OrthographicCameraWithHelper | PerspectiveCamera | OrthographicCamera
    public scene !: Scene
    public orbitControls !: OrbitControls
    public ambientLight !: AmbientLight
    public mode: EngineInterface['mode'] = 'dev'

    protected userAskedFPS: number = 60
    protected animationMachine = AnimationFrame
    protected renderCamera = this.camera

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
            })
        }
        return this
    }
    
    protected initTick(askedFps: number = 60, renderCamera: PerspectiveCamera | OrthographicCamera): void {
        this.userAskedFPS = askedFps
        this.animationMachine.run(this.userAskedFPS)
        this.animationMachine.addListener(() => {
            this.renderer.render(this.scene, renderCamera)
        })
    }
    public setAmbientLight(ambientLight ?: AmbientLight | CustomAmbientLight): EngineInterface {
        if(this.ambientLight) {
            this.scene.remove(this.ambientLight)
        }
        this.ambientLight = LightParser.parseAmbientLight(ambientLight || {})
        this.scene.add(this.ambientLight)
        return this
    }
    public setScene(scene ?: Scene | CustomScene): EngineInterface {
        this.scene = SceneParser.parse(scene)
        return this
    }
    public add(...objects: Object3D[]): EngineInterface {
        this.scene.add(...objects)
        return this
    }
    public setRenderer(renderer?: WebGLRenderer | CustomRenderer): EngineInterface {
        this.renderer = RendererParser.parse(this.canvas, this.canvasProportion, renderer)
        return this
    }
    public setCamera(camera?: Camera | CustomCamera | 'perspectiveCamera' | 'orthographicCamera' | undefined): EngineInterface {
        if(this.camera) {
            this.scene.remove(this.camera)
        }
        this.camera = CameraParser.parse(this.canvasProportion, camera)
        this.scene.add(this.camera)
        this.camera.position.set(1, 0.5, 3)
        return this
    }
    protected setRenderCamera(camera: PerspectiveCamera | OrthographicCamera): void {
        this.renderCamera = camera
    }
}