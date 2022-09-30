import { FolderApi, TabPageApi } from 'tweakpane';
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
import { Object3DControls } from "../shared/utils/Object3DControls";
import { MaterialControlsUtil } from "../shared/utils/MaterialControls.util";
import {GeometryControls} from "./utils/GeometryControls.util";
import {ChangeDetector} from "../shared/changeDetector/changeDetector";

export class ActiveElementControls {
    private readonly scene: Scene
    private readonly pane: TabPageApi
    private selectedObj: Object3D | null = null
    private geometryControls: GeometryControls | null = null

    constructor(scene: Scene, pane: TabPageApi) {
        this.scene = scene
        this.pane = pane
        ChangeDetector.clickedObject$.subscribe((obj: Mesh | Object3D | null) => {
            if(obj !== this.selectedObj || obj === null) {
                this.selectedObj = obj
                this.select(obj)
            }
        })
    }
    public select(selectedObj: Object3D | null) : void {
        for(let child of this.pane.children) {
            this.pane.remove(child)
        }
        if(selectedObj !== null) {
            this.pane.addInput(selectedObj, 'name')
            if (selectedObj instanceof Light) {
                this.forLight(selectedObj, this.pane)
            } else if (selectedObj instanceof PerspectiveCamera || selectedObj instanceof OrthographicCamera) {
                this.forCamera(selectedObj, this.pane)
            } else if (selectedObj instanceof Mesh) {
                this.forObject(selectedObj, this.pane)
            }
        }
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
        this.addMesh(child, pane)
        this.addMaterial(child, pane)
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
            }).on('change', ({value}) => {
                camera.fov = value
                camera.updateProjectionMatrix()
            });
        }
    }
    private addMesh(child: Mesh, pane: FolderApi | TabPageApi) {
        this.geometryControls?.dispose()
        const folder = pane.addFolder({title: 'Geometry', expanded: true})
        this.geometryControls = new GeometryControls(child, folder)
    }
    private addMaterial(mesh: Mesh, pane: FolderApi | TabPageApi) {
        const materials = mesh.material instanceof Array ? mesh.material : [mesh.material];
        for(let i = 0; i < materials.length; i++) {
            const material = materials[i]
            const folder = pane.addFolder({
                title: i === 0 ? 'Material' : 'Material #' + (i + 1),
                expanded: true
            })
            MaterialControlsUtil.materialConverter(material, mesh, folder, () => {
                this.updateMaterialsControls(mesh, pane)
            })
            MaterialControlsUtil.addForMaterial(material, folder)
            folder.addSeparator()
            const typeFolder = folder.addFolder({title: material.type, expanded: false})
            if(material instanceof MeshToonMaterial) {
                MaterialControlsUtil.addForToonMaterial(material, typeFolder)
            } else if(material instanceof MeshDepthMaterial) {
                MaterialControlsUtil.addForDepthMaterial(material, typeFolder)
            } else if(material instanceof MeshBasicMaterial) {
                MaterialControlsUtil.addForBasicMaterial(material, typeFolder)
            } else if(material instanceof MeshLambertMaterial) {
                MaterialControlsUtil.addForLambertMaterial(material, typeFolder)
            } else if(material instanceof MeshMatcapMaterial) {
                MaterialControlsUtil.addForMatcapMaterial(material, typeFolder)
            } else if(material instanceof MeshNormalMaterial) {
                MaterialControlsUtil.addForNormalMaterial(material, typeFolder)
            } else if(material instanceof MeshPhongMaterial) {
                MaterialControlsUtil.addForPhongMaterial(material, typeFolder)
            } else if(material instanceof MeshStandardMaterial) {
                MaterialControlsUtil.addForStandardMaterial(material, typeFolder)
            } else if(material instanceof MeshPhysicalMaterial) {
                MaterialControlsUtil.addForPhysicalMaterial(material, typeFolder)
            }
        }
    }
    private updateMaterialsControls(mesh: Mesh, folder: FolderApi | TabPageApi) {
        folder.children.forEach(child => folder.remove(child))
        this.addMaterial(mesh, folder)
    }
    private addScale(child: Object3D, pane: FolderApi | TabPageApi) {
        Object3DControls.addScale(child, pane)
            .on('change', () => {
                ChangeDetector.clickedObject$.next(child)
            });
    }
    private addRotation(child: Object3D, pane: FolderApi | TabPageApi) {
        Object3DControls.addRotation(child, pane)
            .on('change', () => {
                ChangeDetector.clickedObject$.next(child)
            });
    }
    private addPositions(child: Object3D, pane: FolderApi | TabPageApi) {
        Object3DControls.addPositions(child, pane)
            .on('change', () => {
                ChangeDetector.clickedObject$.next(child)
            });
    }

}