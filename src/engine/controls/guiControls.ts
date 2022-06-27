import {FolderApi, TabPageApi} from 'tweakpane';
import {
    AmbientLight,
    Light,
    Mesh,
    MeshBasicMaterial,
    MeshDepthMaterial,
    MeshLambertMaterial,
    MeshMatcapMaterial,
    MeshNormalMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    MeshToonMaterial,
    Object3D,
    OrthographicCamera,
    PerspectiveCamera,
    Scene,
} from "three";
import {Object3DControls} from "./utils/Object3DControls";
import {MaterialControls} from "./utils/MaterialControls";

export class GuiControls {
    private readonly scene: Scene
    private readonly pane: TabPageApi
    private triggerOnChange: Function = () => {}

    constructor(scene: Scene, pane: TabPageApi) {
        this.scene = scene;
        this.pane = pane
    }
    public select(selectedObj: Object3D | null) : void {
        if(!selectedObj) {
            return;
        }
        for(let child of this.pane.children) {
            this.pane.remove(child)
        }
        this.pane.addInput(selectedObj, 'name')
        if(selectedObj instanceof Light) {
            this.forLight(selectedObj, this.pane)
        } else if(selectedObj instanceof PerspectiveCamera || selectedObj instanceof OrthographicCamera) {
            this.forCamera(selectedObj, this.pane)
        } else if(selectedObj instanceof Mesh) {
            this.forObject(selectedObj, this.pane)
        }
    }

    public onChange(callback: Function) {
        this.triggerOnChange = callback
    }
    private forLight(child: Light, pane: FolderApi| TabPageApi) : void {
        pane.addInput(child, 'intensity', {min: 0, max: child.intensity + 10})
        pane.addInput(child, 'visible')
        pane.addInput(child, 'castShadow')
        pane.addInput({color: child.color.getHex()}, 'color').on('change', ({value}) => {
            child.color.set(value)
        })
        if(!(child instanceof AmbientLight)) {
            this.addPositions(child, pane)
            this.addRotation(child, pane)
        }
    }
    private forObject(child: Mesh, pane: FolderApi | TabPageApi) {
        this.addPositions(child, pane)
        this.addRotation(child, pane)
        this.addScale(child, pane)
        const materialsFolder = pane.addFolder({ title: 'Materials', expanded: true })
        this.addMaterial(child, materialsFolder)
        pane.addInput(child, 'castShadow')
        pane.addInput(child, 'visible');
        pane.addInput(child, 'receiveShadow');
        pane.addInput(child, 'frustumCulled');
    }
    private forCamera(camera: PerspectiveCamera | OrthographicCamera, pane: FolderApi | TabPageApi) {
        Object3DControls.addPositions(camera, pane)
        Object3DControls.addRotation(camera, pane)
        if(camera instanceof PerspectiveCamera) {
            pane.addInput(camera, 'fov', {
                view: 'cameraring',
                min: 1,
                max: 179
            }).on('change', (value) => {
                camera.fov = value
                camera.updateProjectionMatrix()
            });
        }
    }
    private addMaterial(mesh: Mesh, pane: FolderApi | TabPageApi) {
        const materials = mesh.material instanceof Array ? mesh.material : [mesh.material];
        for(let i = 0; i < materials.length; i++) {
            const material = materials[i]
            const folder = pane.addFolder({
                title: i === 0 ? 'Material' : 'Material #' + (i + 1),
                expanded: true
            })
            MaterialControls.materialConverter(material, mesh, folder, () => {
                this.updateMaterialsControls(mesh, pane)
            })
            MaterialControls.addForMaterial(material, folder)
            folder.addSeparator()
            const typeFolder = folder.addFolder({title: material.type, expanded: true})
            if(material instanceof MeshToonMaterial) {
                MaterialControls.addForToonMaterial(material, typeFolder)
            } else if(material instanceof MeshDepthMaterial) {
                MaterialControls.addForDepthMaterial(material, typeFolder)
            } else if(material instanceof MeshBasicMaterial) {
                MaterialControls.addForBasicMaterial(material, typeFolder)
            } else if(material instanceof MeshLambertMaterial) {
                MaterialControls.addForLambertMaterial(material, typeFolder)
            } else if(material instanceof MeshMatcapMaterial) {
                MaterialControls.addForMatcapMaterial(material, typeFolder)
            } else if(material instanceof MeshNormalMaterial) {
                MaterialControls.addForNormalMaterial(material, typeFolder)
            } else if(material instanceof MeshPhongMaterial) {
                MaterialControls.addForPhongMaterial(material, typeFolder)
            } else if(material instanceof MeshStandardMaterial) {
                MaterialControls.addForStandardMaterial(material, typeFolder)
            } else if(material instanceof MeshPhysicalMaterial) {
                MaterialControls.addForPhysicalMaterial(material, typeFolder)
            }
            folder.addSeparator()
            if(i !== 0) {
                folder.addButton({ title: 'Delete this material' })
                    .on('click', () => {
                        if(mesh.material instanceof Array) {
                            mesh.material.splice(i, 1)
                        }
                        this.updateMaterialsControls(mesh, pane)
                    }).element.classList.add('__tweakpane-delete-btn')
            }
        }
        const addMaterialBtn = pane.addButton({ title: 'Add a new material' })
            .on('click', () => {
                if(mesh.material instanceof Array) {
                    mesh.material.push(new MeshBasicMaterial())
                } else {
                    mesh.material = [mesh.material, new MeshBasicMaterial()]
                }
                this.updateMaterialsControls(mesh, pane)
            })
    }
    private updateMaterialsControls(mesh: Mesh, folder: FolderApi | TabPageApi) {
        folder.children.forEach(child => folder.remove(child))
        this.addMaterial(mesh, folder)
    }
    private addScale(child: Object3D, pane: FolderApi | TabPageApi) {
        Object3DControls.addScale(child, pane)
            .on('change', () => {
                this.triggerOnChange(child)
            });
    }
    private addRotation(child: Object3D, pane: FolderApi | TabPageApi) {
        Object3DControls.addRotation(child, pane)
            .on('change', () => {
                this.triggerOnChange(child)
            });
    }
    private addPositions(child: Object3D, pane: FolderApi | TabPageApi) {
        Object3DControls.addPositions(child, pane)
            .on('change', () => { this.triggerOnChange(child) });
    }

}