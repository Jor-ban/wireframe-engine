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
import {WireframeMesh, WireframeTextGeometry} from "../../../lib";
import {GeometryRedactor} from "./GeometryRedactor";
import {ChangeDetector} from "../../shared/changeDetector/changeDetector";

export class GeometryControls {
    mesh: WireframeMesh
    folder: TabPageApi | FolderApi
    changeListenersList: { [key: string]: Subscription } = {}

    constructor(mesh: WireframeMesh, folder: TabPageApi | FolderApi) {
        this.mesh = mesh
        this.folder = folder
        this.addMeshControls()
    }
    // TODO work on this, does not work
    addMeshControls() {
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
            const paramChange = new Subject<TpChangeEvent<any>>()
            const inputSettings = {}
            this.folder.addInput(geometry, param as keyof T)
                .on('change', (event: TpChangeEvent<any>) => {
                    paramChange.next(event)
                })
            this.changeListenersList[param] = paramChange
                .pipe(debounceTime(200))
                .subscribe(this.recreateMesh.bind(this))
        }
    }
    recreateMesh(changeEvent: TpChangeEvent<any>) {
        let newMesh = GeometryRedactor.recreateMesh(this.mesh, changeEvent)
        if(newMesh) {
            const parent = this.mesh.parent
            newMesh.position.copy(this.mesh.position)
            newMesh.rotation.copy(this.mesh.rotation)
            newMesh.name = this.mesh.name
            newMesh.userData = this.mesh.userData
            newMesh.uuid = this.mesh.uuid
            parent?.remove(this.mesh)
            ChangeDetector.removedObject$.next(this.mesh)
            this.mesh = newMesh
            parent?.add(newMesh)
            ChangeDetector.clickedObject$.next(this.mesh)
            ChangeDetector.addedObject$.next(this.mesh)
        }
    }
    dispose() {
        Object.values(this.changeListenersList).forEach((sub) => {
            sub.unsubscribe()
        })
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