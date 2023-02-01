import { Object3D, Scene } from 'three';

export interface ElementWithHelper {
    helper: Object3D
    active: boolean

    initEvents: () => void
    addToScene: (scene: Scene | Object3D) => void
    dispose: () => void
}