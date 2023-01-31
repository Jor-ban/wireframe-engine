import { Object3D } from 'three';

export interface ElementWithHelper {
    helper: Object3D
    active: boolean

    initEvents: () => void
}