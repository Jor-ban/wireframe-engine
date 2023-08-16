import { __DevEngine } from '⚙️/devEngine/devEngine';
import {
    BackSide,
    BoxGeometry, BufferGeometry, Mesh,
    MeshBasicMaterial,
    Object3D,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector2,
} from "three";
import {CanvasProportion} from "⚙️/lib/parsers/types/CanvasProportion.interface";
import {leftControlsWidth, topBarHeight} from "⚙️/shared/consts/controlsStyles";
import {ChangeDetector} from "⚙️/devEngine/changeDetector";
import {InstrumentsEnum} from "⚙️/devEngine/types/Instruments.enum";
import {WMesh} from "⚙️/lib";
import {LightWithHelper} from "⚙️/devEngine/devClasses/lightsWithHelper";

export class ElementTracer {
    public activeObject: Object3D | null = null
    protected mouse = new Vector2()
    private readonly canvasProportion: CanvasProportion
    private readonly scene: Scene
    private readonly camera !: PerspectiveCamera
    private rayCaster: Raycaster
    private mouseMoved: boolean = false

    private hoveredObject: Mesh<BufferGeometry, MeshBasicMaterial> = new Mesh(
        new BoxGeometry(),
        new MeshBasicMaterial({
            color: 0xff0066,
            side: BackSide,
            transparent: true,
            opacity: 1,
        })
    )
    private clickedObject: Mesh<BufferGeometry, MeshBasicMaterial> = new Mesh(
        new BoxGeometry(),
        new MeshBasicMaterial({
            color: 0xffffff,
            opacity: 0.8,
            transparent: true,
            side: BackSide
        })
    )

    constructor({ canvas, canvasProportion, devCamera, scene }: __DevEngine, rayCaster: Raycaster) {
        this.canvasProportion = canvasProportion
        this.camera = devCamera
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
            } else if(this.activeObject !== null && mesh instanceof Object3D) {
                this.emitCLick(mesh)
            }
        })
        ChangeDetector.hoveredObject$.subscribe((mesh) => {
            if(mesh === null) {
                this.hoveredObject.visible = false
            } else if(mesh instanceof WMesh) {
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
    private emitCLick = (mesh?: WMesh | Object3D) => {
        if(mesh instanceof WMesh) {
            (mesh || this.hoveredObject).matrixWorld.decompose(
                this.clickedObject.position, 
                this.clickedObject.quaternion, 
                this.clickedObject.scale
            )
            this.clickedObject.scale.set(
                1.05 * this.clickedObject.scale.x,
                1.05 * this.clickedObject.scale.y, 
                1.05 * this.clickedObject.scale.z
            )
            this.clickedObject.geometry = mesh.geometry
            this.clickedObject.visible = true
        } else {
            this.clickedObject.visible = false
        }
        this.hoveredObject.visible = false
    }
    private setHoveredObjectParameters(mesh: Object3D) {
        mesh.matrixWorld.decompose(
            this.hoveredObject.position, 
            this.hoveredObject.quaternion, 
            this.hoveredObject.scale
        )
        this.hoveredObject.scale.set(
            1.03 * this.hoveredObject.scale.x, 
            1.03 * this.hoveredObject.scale.y, 
            1.03 * this.hoveredObject.scale.z
        )
        this.hoveredObject.visible = true
    }
    private emitHover(mesh: Object3D | WMesh) {
        this.activeObject = mesh
        this.setHoveredObjectParameters(mesh)
        if(mesh instanceof WMesh) {
            this.hoveredObject.geometry = mesh.geometry
            this.hoveredObject.visible = true
        } else {
            this.hoveredObject.visible = false
        }
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
            .filter((el: any) =>
                ('__clickable' in el.object || LightWithHelper.isLightHelper(el.object)) &&
                el.object !== this.hoveredObject &&
                el.object !== this.clickedObject
            )[0]?.object
        if(obj && '__clickable' in obj) {
            this.emitHover(obj)
        } else if(LightWithHelper.isLightHelper(obj)) {
            this.activeObject = obj.light
            ChangeDetector.hoveredObject$.next(obj.light)
        } else {
            ChangeDetector.hoveredObject$.next(null)
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