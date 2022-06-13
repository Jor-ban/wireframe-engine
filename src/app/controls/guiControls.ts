import {GUI} from "dat.gui";
import {
    ACESFilmicToneMapping, AmbientLight,
    AxesHelper,
    CineonToneMapping, Group,
    Light,
    LinearToneMapping, Mesh, MeshStandardMaterial,
    NoToneMapping,
    Object3D, OrthographicCamera, PerspectiveCamera,
    ReinhardToneMapping, Scene, WebGLRenderer
} from "three";
import {debugParams} from "./controller";

export class GuiControls {
    private scene: Scene
    private renderer: WebGLRenderer
    private readonly mainCamera: PerspectiveCamera | OrthographicCamera
    private gui: GUI
    private axesHelper: AxesHelper
    private triggerOnChange: Function = () => {}

    constructor(scene: Scene, renderer: WebGLRenderer, mainCamera: PerspectiveCamera | OrthographicCamera) {
        this.scene = scene;
        this.renderer = renderer
        this.mainCamera = mainCamera
        this.axesHelper = new AxesHelper( 5 );
        this.scene.add(this.axesHelper)

        const body = document.body;
        body.classList.add('debug');
        this.gui = new GUI({name: 'Wireframe Engine Gui'});
        this.select(null)
    }
    public select(selectedObj: Object3D | null) : void {
        this.gui.destroy()
        this.gui = new GUI({name: 'Wireframe Engine Gui'});

        if(selectedObj instanceof Light) {
            this.forLight(selectedObj, this.createFolder(selectedObj))
        } else if(selectedObj instanceof PerspectiveCamera || selectedObj instanceof OrthographicCamera) {
            this.forCamera(selectedObj, this.createFolder(selectedObj))
        } else if(selectedObj instanceof Object3D) {
            this.forObject(selectedObj, this.createFolder(selectedObj))
        } else {
            this.forCamera(this.mainCamera, this.createFolder(this.mainCamera))
            this.forScene(this.createFolder('scene'))
        }
        this.gui.updateDisplay()
    }
    private createFolder(name: string) : GUI
    private createFolder(selectedObj: Object3D) : GUI
    private createFolder(element: Object3D | string) {
        let folder
        if(typeof element === 'string') {
            folder = this.gui.addFolder(element)
        } else {
            folder = this.gui.addFolder(element.name || element.type)
        }
        folder.open()
        return folder
    }
    public onChange(callback: Function) {
        this.triggerOnChange = callback
    }
    private forScene(gui: GUI) : void {
        gui.add(debugParams, 'axesHelperLength', 0, 20).onChange((value) => {
            this.axesHelper.scale.set(value, value, value)
        });
        // env map
        gui.add(debugParams, 'envMapIntensity', 0, 10).step(0.01).onChange((value) => {
            debugParams.envMapIntensity = value
            this.updateAllMaterials()
        })
        // tone mapping
        gui.add({toneMapping: this.renderer.toneMapping}, 'toneMapping', {
            None: NoToneMapping,
            Linear: LinearToneMapping,
            Reinhard: ReinhardToneMapping,
            Uncharted2: ReinhardToneMapping,
            Cineon: CineonToneMapping,
            ACESFilmic: ACESFilmicToneMapping,
        }).onChange((value) => {
            this.renderer.toneMapping = Number(value)
            this.updateAllMaterials()
        })
        gui.add({ shadowMap: this.renderer.shadowMap.enabled }, 'shadowMap')
    }
    private forLight(child: Light, gui: GUI) : void {
        gui.add(child, 'intensity', 0, child.intensity + 10)
        gui.add(child, 'visible')
        gui.add(child, 'castShadow')
        gui.addColor({color: child.color.getHex()}, 'color').onChange((value) => {
            child.color.set(value)
        })
        if(!(child instanceof AmbientLight)) {
            this.addPositions(child, gui)
            this.addRotation(child, gui)
        }
    }
    private forObject(child: Object3D | Group, gui: GUI) {
        this.addPositions(child, gui)
        this.addRotation(child, gui)
        this.addScale(child, gui)
        gui.add(child, 'castShadow')
        gui.add(child, 'visible');
        gui.add(child, 'receiveShadow');
        gui.add(child, 'frustumCulled');
    }
    private forCamera(camera: PerspectiveCamera | OrthographicCamera, gui: GUI) {
        this.addPositions(camera, gui)
        this.addRotation(camera, gui)
        gui.add(camera, 'fov', 1, 180)
            .onChange((value: number) => {
                if (!(camera instanceof OrthographicCamera)) {
                    camera.fov = value
                }
                camera.updateProjectionMatrix()
            });
        gui.add(camera, 'updateProjectionMatrix');
    }
    private addScale(child: Object3D, gui: GUI) {
        gui.add({scaleX: child.scale.x}, 'scaleX', 0, child.scale.x + 5)
            .step(0.5)
            .onChange((value) => {
                child.scale.x = value
                this.triggerOnChange(child)
            });
        gui.add({scaleY: child.scale.y}, 'scaleY', 0, child.scale.y + 5)
            .step(0.5)
            .onChange((value) => {
                child.scale.y = value
                this.triggerOnChange(child)
            });
        gui.add({scaleZ: child.scale.z}, 'scaleZ', 0, child.scale.z + 5)
            .step(0.5)
            .onChange((value) => {
                child.scale.z = value
                this.triggerOnChange(child)
            });
    }
    private addRotation(child: Object3D, gui: GUI) {
        gui.add(
                { rotationX: child.rotation.x * 180 / Math.PI },
                'rotationX', -180, 180
        )   .step(15)
            .onChange((value) => {
                child.rotation.x = value * Math.PI / 180
                this.triggerOnChange(child)
            });
        gui.add(
                { rotationY: child.rotation.y * 180 / Math.PI },
                'rotationY', -180, 180
        )   .step(15)
            .onChange((value) => {
                child.rotation.y = value * Math.PI / 180
                this.triggerOnChange(child)
            });
        gui.add(
                { rotationZ: child.rotation.z * 180 / Math.PI },
                'rotationZ', -180, 180
        )   .step(15)
            .onChange((value) => {
                child.rotation.z = value * Math.PI / 180
                this.triggerOnChange(child)
            });
    }
    private addPositions(child: Object3D, gui: GUI) {
        gui.add(child.position, 'x', child.position.x - 10, child.position.x + 10)
            .onChange(() => { this.triggerOnChange(child) });
        gui.add(child.position, 'y', child.position.y - 10, child.position.y + 10)
            .onChange(() => { this.triggerOnChange(child) });
        gui.add(child.position, 'z', child.position.z - 10, child.position.z + 10)
            .onChange(() => { this.triggerOnChange(child) });
    }
    private updateAllMaterials() {
        this.scene.traverse((child: Object3D) =>
        {
            if(child instanceof Mesh && child.material instanceof MeshStandardMaterial)
            {
                child.material.envMapIntensity = debugParams.envMapIntensity
                child.material.needsUpdate = true
            }
        })
    }
}