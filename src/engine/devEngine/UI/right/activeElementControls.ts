import {FolderApi, InputBindingApi, Pane, TabPageApi} from 'tweakpane';
import {
    AmbientLight, Euler,
    Group,
    Light,
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
} from "three";
import { Object3DControls } from "./utils/Object3DControls";
import { MaterialControlsUtil } from "./utils/MaterialControls.util";
import { GeometryControls } from "./utils/GeometryControls.util";
import { ChangeDetector } from "../../changeDetector";
import { WireframeMesh } from "⚙️/lib";
import { LightControls } from "./utils/LightControls";
import { CameraControls } from './utils/CameraControls';
import { Subscription } from 'rxjs';

export class ActiveElementControls {
    private readonly pane: TabPageApi
    private selectedObj: Object3D | null = null
    private subList: Set<Subscription> = new Set() // !TODO

    constructor(pane: TabPageApi) {
        this.pane = pane
        ChangeDetector.clickedObject$.subscribe((obj: WireframeMesh | Object3D | null) => {
            if(obj !== this.selectedObj || obj === null) {
                this.selectedObj = obj
                this.select(obj)
            }
        })
    }
    public select(selectedObj: Object3D | null) : void {
        this.subList.forEach((sub) => sub.unsubscribe())
        for(let child of this.pane.children) {
            this.pane.remove(child)
        }
        if(selectedObj !== null) {
            this.pane.addInput(selectedObj, 'name').on('change', ({ value }) => {
                ChangeDetector.activeObjectUpdated$.next({
                    target: selectedObj,
                    changedPropertyName: 'name',
                    value,
                })
            })
            if(selectedObj instanceof Group) {
                this.addForGroup(selectedObj, this.pane)
            } else if (selectedObj instanceof Light) {
                this.forLight(selectedObj, this.pane)
            } else if (selectedObj instanceof PerspectiveCamera || selectedObj instanceof OrthographicCamera) {
                CameraControls.addForCamera(selectedObj, this.pane)
            } else if (selectedObj instanceof WireframeMesh) {
                this.forObject(selectedObj, this.pane)
            }
        }
    }

    private forLight(child: Light, pane: FolderApi| TabPageApi) : void {
        LightControls.addLight(child, pane)  // TODO add shadow options
        if(!(child instanceof AmbientLight)) {
            const positionInput = this.addPositions(child, pane)
            const rotationInput = this.addRotation(child, pane)
            const sub = ChangeDetector.activeObjectUpdated$.subscribe(({changedPropertyName}) => {
                if(changedPropertyName === 'position') {
                    positionInput.refresh()
                } else if(changedPropertyName === 'rotation') {
                    rotationInput.refresh()
                }
            })
            this.subList.add(sub)
        }
    }
    private forObject(child: WireframeMesh, pane: FolderApi | TabPageApi) {
        this.addForObject3D(child, pane)
        pane.addSeparator()
        const tabs = pane.addTab({
            pages: [
                {title: 'Geometry'},
                {title: 'Material'},
                {title: 'Physics'}, // TODO
                {title: 'Advanced'},
            ]
        })

        new GeometryControls(child, tabs.pages[0])
        this.addMaterials(child, tabs.pages[1])
        this.addPhysics(child, tabs.pages[2])
        this.addAdvanced(child, tabs.pages[3])
    }
    private addForGroup(group: Group, pane: Pane | TabPageApi | FolderApi): void {
        this.addForObject3D(group, pane)
    }
    private addMaterials(mesh: WireframeMesh, pane: FolderApi | TabPageApi) {
        const materials = mesh.material instanceof Array ? mesh.material : [mesh.material];
        for(let i = 0; i < materials.length; i++) {
            const material = materials[i]
            MaterialControlsUtil.materialConverter(material, mesh, pane, () => {
                this.updateMaterialsControls(mesh, pane)
            })
            MaterialControlsUtil.addForMaterial(material, pane)
            const typeFolder = pane.addFolder({title: material.type, expanded: true})
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
            const detailsFolder = pane.addFolder({title: 'Material Details', expanded: true})
            MaterialControlsUtil.addDetails(material, detailsFolder)
        }
    }
    private addPhysics(child: WireframeMesh, pane: FolderApi | TabPageApi) {
        // TODO
    }
    private addAdvanced(child: WireframeMesh, pane: FolderApi | TabPageApi) {
        pane.addInput(child, 'castShadow')
        pane.addInput(child, 'visible');
        pane.addInput(child, 'receiveShadow');
        pane.addInput(child, 'frustumCulled');
    }
    private updateMaterialsControls(mesh: WireframeMesh, folder: FolderApi | TabPageApi) {
        folder.children.forEach(child => folder.remove(child))
        this.addMaterials(mesh, folder)
    }
    private addScale(child: Object3D, pane: FolderApi | TabPageApi): InputBindingApi<unknown, Euler> {
        return Object3DControls.addScale(child, pane)
            .on('change', () => {
                ChangeDetector.activeObjectUpdated$.next({
                    target: child,
                    changedPropertyName: 'scale',
                    value: child.scale
                })
            });
    }
    private addRotation(child: Object3D, pane: FolderApi | TabPageApi): InputBindingApi<unknown, Euler> {
        return Object3DControls.addRotation(child, pane)
            .on('change', () => {
                ChangeDetector.activeObjectUpdated$.next({
                    target: child,
                    changedPropertyName: 'rotation',
                    value: child.rotation
                })
            });
    }
    private addPositions(child: Object3D, pane: FolderApi | TabPageApi): InputBindingApi<unknown, Euler> {
        return Object3DControls.addPositions(child, pane)
            .on('change', () => {
                ChangeDetector.activeObjectUpdated$.next({
                    target: child,
                    changedPropertyName: 'position',
                    value: child.position
                })
            });
    }
    private addForObject3D(object: Object3D, pane: Pane | TabPageApi | FolderApi): void {
        const positionInput = this.addPositions(object, pane)
        const rotationInput = this.addRotation(object, pane)
        const scaleInput = this.addScale(object, pane)

        const sub = ChangeDetector.activeObjectUpdated$.subscribe(({changedPropertyName}) => {
            if(changedPropertyName === 'position') {
                positionInput.refresh()
            } else if(changedPropertyName === 'rotation') {
                rotationInput.refresh()
            } else if(changedPropertyName === 'scale') {
                scaleInput.refresh()
            }
        })
        this.subList.add(sub)
    }

}