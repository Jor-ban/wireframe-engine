import {Euler, MeshStandardMaterial, Object3D, Scene} from "three";
import {FolderApi, InputBindingApi, Pane, TabPageApi} from "tweakpane";
import {debugParams} from "../../controller";
import {WireframeMesh} from "⚙️/lib";

export class Object3DControls {
    static addScale(child: Object3D, pane: FolderApi | TabPageApi): InputBindingApi<unknown, Euler> {
        const scaleParams = {min: 0}
        return pane.addInput(child, 'scale',{
            x: scaleParams,
            y: scaleParams,
            z: scaleParams
        })
    }
    static addRotation(child: Object3D, pane: FolderApi | TabPageApi): InputBindingApi<unknown, Euler> {
        const rotationValues = {
            'rotation (deg)': {
                x: Math.round(child.rotation.x * 180 / Math.PI),
                y: Math.round(child.rotation.y * 180 / Math.PI),
                z: Math.round(child.rotation.z * 180 / Math.PI)
            }
        }
        return pane.addInput(rotationValues, 'rotation (deg)',{
            x: {},
            y: {},
            z: {}
        }).on('change', ({ value }) => {
            child.rotation.set(value.x * Math.PI / 180, value.y * Math.PI / 180, value.z * Math.PI / 180)
        })
    }
    static addRotationDeg(child: Object3D, pane: FolderApi | TabPageApi): InputBindingApi<unknown, Euler> {
        return pane.addInput(child, 'rotation', {
            view: 'rotation',
            rotationMode: 'euler',
            order: 'XYZ',
            format: (v: number) => {
                return v * Math.PI / 180
            }
        })
    }
    static addPositions(child: Object3D, pane: FolderApi | TabPageApi): InputBindingApi<unknown, Euler> {
        return pane.addInput(child, 'position', {
            x: {},
            y: {},
            z: {}
        });
    }
    static updateAllMaterials(scene: Scene) {
        scene.traverse((child: Object3D) =>
        {
            if(child instanceof WireframeMesh && child.material instanceof MeshStandardMaterial)
            {
                child.material.envMapIntensity = debugParams.envMapIntensity
                child.material.needsUpdate = true
            }
        })
    }

    static createFolder(name: string, pane: Pane | FolderApi | TabPageApi): FolderApi
    static createFolder(selectedObj: Object3D, pane: Pane | FolderApi | TabPageApi): FolderApi
    static createFolder(element: Object3D | string, pane: Pane | FolderApi | TabPageApi): FolderApi {
        let folder
        if(typeof element === 'string') {
            folder = pane.addFolder({title: element, expanded: true})
        } else {
            folder = pane.addFolder({title: element.name || element.type, expanded: true})
        }
        return folder
    }
}