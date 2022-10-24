import {
    BackSide,
    BoxGeometry, BufferGeometry, Mesh,
    MeshBasicMaterial,
    Object3D,
    OrthographicCamera,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector2,
} from "three";
import {CanvasProportion} from "../../../parsers/types/CanvasProportion.interface";
import {leftControlsWidth, topBarHeight} from "../../../shared/consts/controlsStyles";
import {ChangeDetector} from "../../shared/changeDetector/changeDetector";
import {EngineInterface} from "../../../types/Engine.interface";
import {InstrumentsEnum} from "../../types/Instruments.enum";
import {WireframeMesh} from "../../../lib";
import {DevLight} from "../../../lib/devLights/DevLight";

export class ElementTracer {
    public activeObject: Object3D | null = null
    protected mouse = new Vector2()
    private readonly canvasProportion: CanvasProportion
    private canvas: HTMLCanvasElement
    private readonly scene: Scene
    private readonly camera: PerspectiveCamera | OrthographicCamera
    private rayCaster: Raycaster
    private mouseMoved: boolean = false

    private hoveredObject: Mesh<BufferGeometry, MeshBasicMaterial> = new Mesh(
        new BoxGeometry(),
        new MeshBasicMaterial({
            color: 0xff0066,
            side: BackSide,
            // wireframe: true,
            transparent: true,
            opacity: 1,
        })
    )
    private clickedObject: Mesh<BufferGeometry, MeshBasicMaterial> = new Mesh(
        new BoxGeometry(),
        new MeshBasicMaterial({
            color: 0xffffff,
            // wireframe: true,
            opacity: 0.8,
            transparent: true,
            side: BackSide
        })
    )

    constructor({ canvas, canvasProportion, mainCamera, scene }: EngineInterface, rayCaster: Raycaster) {
        this.canvas = canvas
        this.canvasProportion = canvasProportion
        this.camera = mainCamera
        this.scene = scene
        this.rayCaster = rayCaster
        scene.add(this.hoveredObject, this.clickedObject)
        this.clickedObject.scale.set(0, 0, 0)
        this.hoveredObject.scale.set(0, 0, 0)
        this.hoveredObject.uuid = "__wireframe-hoveredObject__"
        this.clickedObject.uuid = "__wireframe-clickedObject__"
        canvas.addEventListener('mouseup', this.mouseUp.bind(this))
        canvas.addEventListener('mousemove', this.onMouseMove)
        canvas.addEventListener('mousedown', this.mouseDown.bind(this))
        this.initListeners()
    }
    private initListeners() {
        ChangeDetector.clickedObject$.subscribe((mesh) => {
            if(mesh === null) {
                this.clickedObject.visible = false
                this.activeObject = null
            } else if(this.activeObject !== null && mesh instanceof WireframeMesh) {
                this.emitCLick(mesh)
            }
        })
        ChangeDetector.hoveredObject$.subscribe((mesh) => {
            // @ts-ignore
            if(mesh === null) {
                this.hoveredObject.visible = false
            } else if(mesh instanceof WireframeMesh) {
                this.emitHover(mesh)
            }
        })
        ChangeDetector.activeObjectUpdated$.subscribe((update) => {
            this.hoveredObject.visible = false
            const { position, rotation, scale } = update.target
            if(update.changedPropertyName === 'position') {
                this.clickedObject.position.set(position.x, position.y, position.z)
            } else if(update.changedPropertyName === 'rotation') {
                this.clickedObject.rotation.set(rotation.x, rotation.y, rotation.z)
            } else if(update.changedPropertyName === 'scale') {
                this.clickedObject.scale.set(1.07 * scale.x, 1.07 * scale.y, 1.07 * scale.z)
            } else {
                this.emitCLick(update.target)
            }
        })
        ChangeDetector.activeInstrument$.subscribe((instrument) => {
            this.clickedObject.visible = false
            if(instrument !== InstrumentsEnum.pointer) {
                this.hoveredObject.material.opacity = 0
                this.clickedObject.material.opacity = 0
            } else {
                this.hoveredObject.material.opacity = 1
                this.clickedObject.material.opacity = 0.8
            }
        })
    }
    private emitCLick = (mesh?: WireframeMesh | Object3D) => {
        const {position, scale, rotation} = mesh || this.hoveredObject
        this.clickedObject.position.set(position.x, position.y, position.z)
        this.clickedObject.rotation.set(rotation.x, rotation.y, rotation.z)
        this.clickedObject.scale.set(1.07 * scale.x, 1.07 * scale.y, 1.07 * scale.z)
        this.clickedObject.geometry = mesh instanceof WireframeMesh ? mesh.geometry : this.hoveredObject.geometry
        this.clickedObject.visible = true
    }
    private setHoveredObjectParameters(mesh: Object3D) {
        const {position, scale, rotation} = mesh
        this.hoveredObject.rotation.set(rotation.x, rotation.y, rotation.z)
        this.hoveredObject.position.set(position.x, position.y, position.z)
        this.hoveredObject.scale.set(1.03 * scale.x, 1.03 * scale.y, 1.03 * scale.z)
    }
    private emitHover(mesh: Object3D | WireframeMesh) {
        this.activeObject = mesh
        this.setHoveredObjectParameters(mesh)
        if(mesh instanceof WireframeMesh) {
            this.hoveredObject.geometry = mesh.geometry
        }
        this.hoveredObject.visible = true
    }
    private onMouseMove = (event: MouseEvent) => {
        this.mouseMoved = true
        const xPosition = (event.clientX - leftControlsWidth) / this.canvasProportion.width
        const yPosition = - (event.clientY - topBarHeight) / this.canvasProportion.height
        this.mouse.x = xPosition * 2 - 1
        this.mouse.y = yPosition * 2 + 1
        this.rayCaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.rayCaster.intersectObjects(this.scene.children)
        const obj = intersects
            .filter((el) =>
                (el.object instanceof WireframeMesh || DevLight.isLightHelper(el.object)) &&
                el.object !== this.hoveredObject &&
                el.object !== this.clickedObject
            )[0]?.object
        if(obj instanceof WireframeMesh) {
            this.emitHover(obj)
        } else if(DevLight.isLightHelper(obj)) {
            this.emitHover(obj.light)
        } else {
            this.hoveredObject.visible = false
        }
    }
    private mouseUp(event: MouseEvent): void {
        if(!this.mouseMoved) {
            ChangeDetector.clickedObject$.next(this.activeObject)
        }
    }
    private mouseDown(event: MouseEvent): void {
        this.mouseMoved = false
    }
}