import { Object3D } from "three";

export interface MovedObjectInterface {
    target: Object3D
    newParent: Object3D
    placementIndex?: number
}