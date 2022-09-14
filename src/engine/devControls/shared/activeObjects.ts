import {Subject} from "rxjs";
import {Mesh, Object3D} from "three";

export const clickedObject$: Subject<Mesh | Object3D | null> = new Subject()
export const hoveredObject$: Subject<Mesh | Object3D | null> = new Subject()