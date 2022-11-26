import {
    BoxGeometry,
    CircleGeometry,
    ConeGeometry,
    CylinderGeometry,
    DodecahedronGeometry,
    PlaneGeometry,
    RingGeometry, SphereGeometry
} from "three";
import {FolderApi, TabPageApi, TpChangeEvent} from "tweakpane";
import {debounceTime, Subject, Subscription} from "rxjs";
import {WireframeMesh, WireframeTextGeometry} from "../../../../lib";
import {GeometryRedactor} from "./GeometryRedactor";
import {ChangeDetector} from "../../../changeDetector/changeDetector";

export class GeometryControls {
    mesh: WireframeMesh
    folder: TabPageApi | FolderApi

    constructor(mesh: WireframeMesh, folder: TabPageApi | FolderApi) {
        this.mesh = mesh
        this.folder = folder
        this.addGeometryControls()
    }
    addGeometryControls() {
        const geometry = this.mesh.geometry
        if(geometry instanceof WireframeTextGeometry) {
            // @ts-ignore
            const parameters = geometry.parameters.options
            delete parameters.font
            this.addInputs(parameters)
        } else if(this.isThreeGeometry(geometry)) {
            this.addInputs(geometry.parameters)
        }
    }
    addInputs<T extends Object>(geometry: T) {
        for(let param of Object.keys(geometry)) {
            this.folder.addInput(geometry, param as keyof T)
                .on('change', (event: TpChangeEvent<any>) => {
                    const oldGeometry = this.mesh.geometry
                    const newGeometry = GeometryRedactor.recreateGeometry(this.mesh.geometry, event)
                    if(newGeometry) {
                        this.mesh.geometry = newGeometry
                        ChangeDetector.activeObjectUpdated$.next({
                            target: this.mesh,
                            changedPropertyName: 'geometry',
                            value: newGeometry,
                        })
                        oldGeometry.dispose()
                    }
                })
        }
    }
    isThreeGeometry(geometry: any) : geometry is WireframeTextGeometry | BoxGeometry | PlaneGeometry | CircleGeometry | ConeGeometry | CylinderGeometry | DodecahedronGeometry | SphereGeometry | RingGeometry {
        return geometry instanceof WireframeTextGeometry ||
            geometry instanceof BoxGeometry ||
            geometry instanceof PlaneGeometry ||
            geometry instanceof CircleGeometry ||
            geometry instanceof ConeGeometry ||
            geometry instanceof CylinderGeometry ||
            geometry instanceof DodecahedronGeometry ||
            geometry instanceof SphereGeometry ||
            geometry instanceof RingGeometry
    }
}