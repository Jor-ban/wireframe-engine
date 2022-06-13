import {
    BackSide,
    BoxGeometry,
    Camera,
    Mesh,
    MeshBasicMaterial, Object3D, OrthographicCamera,
    PerspectiveCamera,
    Raycaster,
    Scene,
    Vector2,
    WebGLRenderer
} from "three";
import {CanvasProportion} from "../types/CanvasProportion.interface";
import {GuiControls} from "./guiControls";

export class ElementTracer {
    mouse = new Vector2()
    private readonly canvasProportion: CanvasProportion
    private canvas: HTMLCanvasElement
    private scene: Scene
    private readonly camera: Camera
    private rayCaster = new Raycaster()
    private guiControls: GuiControls
    private activeObject: Object3D | null = null

    private hoveredObjectWireframe: Mesh = new Mesh(
        new BoxGeometry(),
        new MeshBasicMaterial({
            color: 0xff0066,
            side: BackSide,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
        })
    )
    private clickedObjectWireframe: Mesh = new Mesh(
        new BoxGeometry(),
        new MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            opacity: 0.5,
            transparent: true,
            side: BackSide
        })
    )

    constructor(
        canvas: HTMLCanvasElement,
        canvasProp: CanvasProportion,
        camera: PerspectiveCamera | OrthographicCamera,
        scene: Scene,
        renderer: WebGLRenderer
    ) {
        this.canvas = canvas
        this.canvasProportion = canvasProp
        this.scene = scene
        this.camera = camera
        this.guiControls = new GuiControls(scene, renderer, camera) // here
        this.guiControls.onChange((element: Object3D) => {
            this.setHoveredObjectParameters(element)
            this.setClickedObjectParameters()
        })
        scene.add(this.hoveredObjectWireframe, this.clickedObjectWireframe)
        this.clickedObjectWireframe.scale.set(0, 0, 0)
        this.hoveredObjectWireframe.scale.set(0, 0, 0)
        canvas.addEventListener('click', this.onClick, false)
        canvas.addEventListener('mousemove', this.onMouseMove, false)
    }
    private onClick = () => {
        if(this.hoveredObjectWireframe.visible) {
            this.setClickedObjectParameters()
            this.clickedObjectWireframe.geometry = this.hoveredObjectWireframe.geometry
            this.clickedObjectWireframe.visible = true
            this.guiControls.select(this.activeObject)
        } else {
            this.clickedObjectWireframe.visible = false
            this.guiControls.select(null)
        }
    }
    private setClickedObjectParameters() {
        const {position, scale, rotation} = this.hoveredObjectWireframe
        this.clickedObjectWireframe.position.set(position.x, position.y, position.z)
        this.clickedObjectWireframe.rotation.set(rotation.x, rotation.y, rotation.z)
        this.clickedObjectWireframe.scale.set(1.02 * scale.x, 1.02 * scale.y, 1.02 * scale.z)
    }
    private setHoveredObjectParameters(mesh: Object3D) {
        const {position, scale, rotation} = mesh
        this.hoveredObjectWireframe.rotation.set(rotation.x, rotation.y, rotation.z)
        this.hoveredObjectWireframe.position.set(position.x, position.y, position.z)
        this.hoveredObjectWireframe.scale.set(1.01 * scale.x, 1.01 * scale.y, 1.01 * scale.z)
    }
    private onMouseMove = (event: MouseEvent) => {
        this.mouse.x = (event.clientX / this.canvasProportion.width) * 2 - 1
        this.mouse.y = -(event.clientY / this.canvasProportion.height) * 2 + 1
        this.rayCaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.rayCaster.intersectObjects(this.scene.children)
        const mesh = intersects
            .filter((el) =>
                el.object.type === "Mesh" &&
                el.object !== this.hoveredObjectWireframe &&
                el.object !== this.clickedObjectWireframe
            )
            .map(el => el.object)[0] as Mesh
        if(mesh) {
            this.activeObject = mesh
            this.setHoveredObjectParameters(mesh)
            this.hoveredObjectWireframe.geometry = mesh.geometry
            this.hoveredObjectWireframe.visible = true
        } else {
            this.hoveredObjectWireframe.visible = false
        }
    }
}