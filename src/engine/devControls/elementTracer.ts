import {
    BackSide,
    BoxGeometry,
    Mesh,
    MeshBasicMaterial, Object3D, OrthographicCamera,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector2,
} from "three";
import { CanvasProportion } from "../parsers/types/CanvasProportion.interface";
import {leftControlsWidth, topBarHeight} from "../shared/consts/controlsStyles";
import {ChangeDetector} from "./shared/changeDetector/changeDetector";

export class ElementTracer {
    protected mouse = new Vector2()
    private readonly canvasProportion: CanvasProportion
    private canvas: HTMLCanvasElement
    private readonly scene: Scene
    private readonly camera: PerspectiveCamera | OrthographicCamera
    private rayCaster = new Raycaster()
    private activeObject: Object3D | null = null
    private clickFrozen: boolean = false

    private hoveredObject: Mesh = new Mesh(
        new BoxGeometry(),
        new MeshBasicMaterial({
            color: 0xff0066,
            side: BackSide,
            // wireframe: true,
            transparent: true,
            opacity: 1,
        })
    )
    private clickedObject: Mesh = new Mesh(
        new BoxGeometry(),
        new MeshBasicMaterial({
            color: 0xffffff,
            // wireframe: true,
            opacity: 0.8,
            transparent: true,
            side: BackSide
        })
    )

    constructor(
        canvas: HTMLCanvasElement,
        canvasProp: CanvasProportion,
        camera: PerspectiveCamera | OrthographicCamera,
        scene: Scene,
    ) {
        this.canvas = canvas
        this.canvasProportion = canvasProp
        this.camera = camera
        this.scene = scene
        scene.add(this.hoveredObject, this.clickedObject)
        this.clickedObject.scale.set(0, 0, 0)
        this.hoveredObject.scale.set(0, 0, 0)
        this.hoveredObject.uuid = "__wireframe-hoveredObject__"
        this.clickedObject.uuid = "__wireframe-clickedObject__"
        canvas.addEventListener('mouseup', this.mouseUp.bind(this))
        canvas.addEventListener('mousemove', this.onMouseMove)
        canvas.addEventListener('mousedown', this.mouseDown.bind(this))
        ChangeDetector.clickedObject$.subscribe((mesh) => {
            if(mesh === null) {
                this.clickedObject.visible = false
                this.activeObject = null
            } else if(this.activeObject !== null) {
                this.emitCLick(mesh)
            }
        })
        ChangeDetector.hoveredObject$.subscribe((mesh) => {
            if(mesh === null) {
                this.hoveredObject.visible = false
            } else {
                this.emitHover(mesh)
            }
        })
    }
    private emitCLick = (mesh?: Mesh | Object3D) => {
        const {position, scale, rotation} = mesh || this.hoveredObject
        this.clickedObject.position.set(position.x, position.y, position.z)
        this.clickedObject.rotation.set(rotation.x, rotation.y, rotation.z)
        this.clickedObject.scale.set(1.07 * scale.x, 1.07 * scale.y, 1.07 * scale.z)
        this.clickedObject.geometry = mesh instanceof Mesh ? mesh.geometry : this.hoveredObject.geometry
        this.clickedObject.visible = true
    }
    private setHoveredObjectParameters(mesh: Object3D) {
        const {position, scale, rotation} = mesh
        this.hoveredObject.rotation.set(rotation.x, rotation.y, rotation.z)
        this.hoveredObject.position.set(position.x, position.y, position.z)
        this.hoveredObject.scale.set(1.03 * scale.x, 1.03 * scale.y, 1.03 * scale.z)
    }
    private emitHover(mesh: Object3D | Mesh) {
        this.activeObject = mesh
        this.setHoveredObjectParameters(mesh)
        if(mesh instanceof Mesh) {
            this.hoveredObject.geometry = mesh.geometry
        }
        this.hoveredObject.visible = true
    }
    private onMouseMove = (event: MouseEvent) => {
        const xPosition = (event.clientX - leftControlsWidth) / this.canvasProportion.width
        const yPosition = - (event.clientY - topBarHeight) / this.canvasProportion.height
        this.mouse.x = xPosition * 2 - 1
        this.mouse.y = yPosition * 2 + 1
        this.rayCaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.rayCaster.intersectObjects(this.scene.children)
        const mesh = intersects
            .filter((el) =>
                el.object.type === "Mesh" &&
                el.object !== this.hoveredObject &&
                el.object !== this.clickedObject
            )
            .map(el => el.object)[0] as Mesh
        if(mesh) {
            this.emitHover(mesh)
        } else {
            this.hoveredObject.visible = false
        }
    }
    private mouseUp(event: MouseEvent): void {
        if(!this.clickFrozen) {
            ChangeDetector.clickedObject$.next(this.activeObject)
        }
    }
    private mouseDown(event: MouseEvent): void {
        this.clickFrozen = false
        setTimeout(() => {
            this.clickFrozen = true
        }, 300)
    }
}