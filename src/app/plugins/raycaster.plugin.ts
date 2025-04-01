import {
    Object3D,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector2,
} from "three";
import {CanvasProportion} from "⚙️/lib/parsers/types/CanvasProportion.interface";
import { state } from '../state/state'
import {EngineInterface, EnginePluginInterface} from "@/engine";



class RaycasterPluginFactory implements EnginePluginInterface {
    public activeObjects: Object3D[] = []
    protected mouse = new Vector2()
    private canvasProportion: CanvasProportion
    private scene: Scene
    private camera !: PerspectiveCamera
    private rayCaster: Raycaster

    public afterCreate({ canvas, canvasProportion, camera, scene }: EngineInterface): void {
        this.canvasProportion = canvasProportion
        this.camera = camera as PerspectiveCamera
        this.scene = scene
        this.rayCaster = new Raycaster()
        canvas.addEventListener('mousemove', this.onMouseMove)
        canvas.addEventListener('mousedown', this.mouseDown.bind(this))
        this.initListeners()
    }
    private initListeners() {
        state.objectsHovered$.subscribe((ol) => {
            this.activeObjects = ol
        })
    }
    private onMouseMove = (event: MouseEvent) => {
        const xPosition = event.clientX / this.canvasProportion.width
        const yPosition = - event.clientY / this.canvasProportion.height
        this.mouse.x = xPosition * 2 - 1
        this.mouse.y = yPosition * 2 + 1
        this.rayCaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.rayCaster.intersectObjects(this.scene.children).filter((el: any) => el.object)
        if(intersects.length > 0){
            this.activeObjects = intersects.map(intr => intr.object)
            state.objectsHovered$.next(this.activeObjects)
        } else {
            this.activeObjects = []
            state.objectsHovered$.next([])
        }
    }
    private mouseDown(event: MouseEvent): void {
        state.objectsClicked$.next(this.activeObjects)
    }

    public getNewInstance(): EnginePluginInterface {
        return new RaycasterPluginFactory();
    }
}

export const RaycasterPlugin = new RaycasterPluginFactory()