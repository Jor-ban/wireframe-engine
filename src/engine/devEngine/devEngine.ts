import { __DevController } from './UI/controller';
import { AmbientLight, Light, Object3D, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { __DefaultEngine } from "⚙️/lib/defaultEngine";
import { bottomControlsHeight, leftControlsWidth, rightControlsWidth, topBarHeight } from "⚙️/shared/consts/controlsStyles";
import { ProjectSettings } from "⚙️/types/ProjectSettings.interface";
import { CameraWithHelper } from '⚙️/devEngine/devClasses/camerasWithHelper';
import { MeshParser } from '⚙️/lib/parsers/MeshParser';
import { LightParser } from '⚙️/lib/parsers/lightParser';
import { LightWithHelper } from '⚙️/devEngine/devClasses/lightsWithHelper';
import { LightJson } from '⚙️/lib/parsers/types/LightJson.type';
import { ChangeDetector } from "⚙️/devEngine/changeDetector";
import { MeshJson } from "⚙️/lib/parsers/types/MeshJson.type";
import { EngineInterface } from "⚙️/types/Engine.interface";
import {CameraParser} from "⚙️/lib/parsers/cameraParser";

export class __DevEngine extends __DefaultEngine {
    public devCamera !: PerspectiveCamera

    private constructor(projectSettings: ProjectSettings) {
        const canvas = document.createElement('canvas')
        document.body.appendChild(canvas)
        super(canvas)

        import('./devStyles.css')
        super.setRenderCamera(this.devCamera)
        this.setDevCanvas()
        this.setScene(projectSettings.scene)
        this.setMainCamera()
        this.setDevCamera()
        this.setRenderer()
        this.setOrbitControls()
        this.setAmbientLight(projectSettings.ambientLight)
        if(projectSettings.lights?.length) {
            projectSettings.lights.forEach((light: Light | LightJson) => {
                const parsedLight = LightParser.parse(light)
                const lightWithHelper = LightWithHelper.from(parsedLight)
                if(lightWithHelper instanceof AmbientLight) {
                    this.add(lightWithHelper)
                } else if(lightWithHelper) { // no undefined
                    lightWithHelper.addToScene(this.scene)
                }
            })
        }
        this.renderer.render(this.scene, this.devCamera)
        this.initTick(undefined, this.devCamera)
    }

    public static create(projectSettings: ProjectSettings = {}): Promise<__DevEngine> {
        const eng = new __DevEngine(projectSettings)
        return eng.addObject2Scene(projectSettings.objects).then(() => {
            new __DevController(eng)
            return eng
        })
    }

    public addObject2Scene(objects: (Object3D | MeshJson)[] | undefined): Promise<EngineInterface> {
        if(objects?.length)
            return MeshParser.parseAll(objects).then(obj3ds => this.add(...obj3ds))
        else
            return Promise.resolve(this)
    }


    private setOrbitControls(): void {
        this.orbitControls = new OrbitControls(this.devCamera, this.canvas)
        this.orbitControls.enableDamping = true
        this.orbitControls.enablePan = true
        this.orbitControls.enableZoom = true
        this.orbitControls.enableRotate = true
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
        const onResize = () => {
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
        }
        window.addEventListener('resize', onResize)
        ChangeDetector.controlStyleChanged$.subscribe(onResize)
    }
    private setMainCamera() {
        const cameraWithHelper = CameraWithHelper.from(
            CameraParser.parse({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        )
        cameraWithHelper.addToScene(this.scene)
        this.camera = cameraWithHelper
    }
    private setDevCamera() {
        this.devCamera = new PerspectiveCamera(60, this.canvasProportion.width / this.canvasProportion.height, 0.1, 1000)
        this.devCamera.uuid = '__wireframe-dev-camera__'
        this.devCamera.position.set(1, 0.5, 3)
        this.scene.add(this.devCamera)
    }
}