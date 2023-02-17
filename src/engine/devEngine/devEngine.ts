import { __DevController } from './UI/controller';
import { AmbientLight, Light, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { __DefaultEngine } from "⚙️/lib/defaultEngine";
import { bottomControlsHeight, leftControlsWidth, rightControlsWidth, topBarHeight } from "⚙️/shared/consts/controlsStyles";
import { ProjectSettings } from "@/engine/types/ProjectSettings.interface";
import { CameraWithHelper } from '⚙️/lib/devClasses/camerasWithHelper';
import { MeshParser } from '⚙️/parsers/MeshParser';
import { LightParser } from '⚙️/parsers/lightParser';
import { LightWithHelper } from '⚙️/lib/devClasses/lightsWithHelper';
import { AmbientLightJson } from '@/engine/parsers/types/LightJson.type';

export class __DevEngine extends __DefaultEngine {
    public devCamera !: PerspectiveCamera

    constructor(projectSettings: ProjectSettings = {}) {
        const canvas = document.createElement('canvas')
        document.body.appendChild(canvas)
        super(canvas)

        import('./devStyles.css')
        super.setRenderCamera(this.devCamera)
        this.setDevCanvas()
        this.setScene(projectSettings.scene)
        this.setCamera()
        this.setDevCamera()
        this.setRenderer()
        this.setMainCamera()
        this.setOrbitControls()
        this.setAmbientLight(projectSettings.ambientLight)
        if(projectSettings.objects?.length) {
            this.add(...projectSettings.objects.map(o => MeshParser.parse(o)))
        }
        if(projectSettings.lights?.length) {
            projectSettings.lights.forEach((light: AmbientLightJson | Light) => {
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
        new __DevController(this)
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
    private setMainCamera() {
        const cameraWithHelper = CameraWithHelper.from(this.camera)
        cameraWithHelper.addToScene(this.scene)
        this.scene.remove(this.camera)
        this.camera = cameraWithHelper
    }
    private setDevCamera() {
        this.devCamera = new PerspectiveCamera(60, this.canvasProportion.width / this.canvasProportion.height, 0.1, 1000)
        this.devCamera.uuid = '__wireframe-dev-camera__'
        this.devCamera.position.set(1, 0.5, 3)
        this.scene.add(this.devCamera)
    }
}