import {
    BoxGeometry,
    CircleGeometry,
    ConeGeometry,
    CylinderGeometry,
    DodecahedronGeometry, Mesh,
    PlaneGeometry,
    RingGeometry, Scene, SphereGeometry
} from "three";
import {FolderApi, TabPageApi, TpChangeEvent} from "tweakpane";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {debounceTime, Subject, Subscription} from "rxjs";

export class GeometryControls {
    mesh: Mesh
    folder: TabPageApi | FolderApi
    changeListenersList: { [key: string]: Subscription } = {}

    constructor(mesh: Mesh, folder: TabPageApi | FolderApi) {
        this.mesh = mesh
        this.folder = folder
        this.addMeshControls()
    }
    // TODO work on this, does not work
    addMeshControls() {
        const geometry = this.mesh.geometry
        if(geometry instanceof TextGeometry) {
            // @ts-ignore
            const parameters = geometry.parameters.options
            this.addInputs(parameters)
        } else if(this.isThreeGeometry(geometry)) {
            this.addInputs(geometry.parameters)
        }
    }
    addInputs<T extends Object>(geometry: T) {
        for(let param of Object.keys(geometry)) {
            const paramChange = new Subject<TpChangeEvent<any>>()
            this.folder.addInput(geometry, param as keyof T)
                .on('change', (event: TpChangeEvent<any>) => {
                    paramChange.next(event)
                })
            this.changeListenersList[param] = paramChange
                .pipe(debounceTime(500))
                .subscribe(this.recreateMesh.bind(this))
        }
    }
    recreateMesh(changeEvent: TpChangeEvent<any>) {
        const material = this.mesh.material
        const parent = this.mesh.parent
        console.log(changeEvent)
    }
    dispose() {
        Object.values(this.changeListenersList).forEach((sub) => {
            sub.unsubscribe()
        })
    }
    isThreeGeometry(geometry: any) : geometry is TextGeometry | BoxGeometry | PlaneGeometry | CircleGeometry | ConeGeometry | CylinderGeometry | DodecahedronGeometry | SphereGeometry | RingGeometry {
        return geometry instanceof TextGeometry ||
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