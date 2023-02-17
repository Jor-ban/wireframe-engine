import { ProjectSettings } from "./types/ProjectSettings.interface";
import { Light } from "three";
import { LightJson } from "./lib/parsers/types/LightJson.type";
import { LightParser } from "./lib/parsers/lightParser";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MeshParser } from "./lib/parsers/MeshParser";;
import { OrbitControlsJson } from './lib/parsers/types/OrbitControlsJson.type';
import { __DefaultEngine } from './lib/defaultEngine';

export class __ProdEngine extends __DefaultEngine {

    constructor(canvas: HTMLCanvasElement, projectSettings: ProjectSettings = {}) {
        super(canvas)
        this.setCanvasSizes(projectSettings.canvasSizes)
        this.setScene(projectSettings.scene)
        this.setCamera(projectSettings.camera)
        this.setRenderer(projectSettings.renderer)
        this.setAmbientLight(projectSettings.ambientLight)
        if(projectSettings.objects?.length) {
            this.add(...projectSettings.objects.map(o => MeshParser.parse(o)))
        }
        if(projectSettings.lights?.length) {
            this.add(...projectSettings.lights.map((light: LightJson | Light) => LightParser.parse(light)))
        }
        this.setOrbitControls(projectSettings.orbitControls)
        this.renderer.render(this.scene, this.camera)
        this.initTick(projectSettings.maxFPS, this.camera)
    }

    private setOrbitControls(orbitControls ?: boolean | OrbitControlsJson): void {
        if(orbitControls) {
            super.orbitControls = new OrbitControls(this.camera, this.canvas)
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
}