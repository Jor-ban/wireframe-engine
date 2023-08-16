import * as THREE from "three";

export abstract class Cloneable {
    static clone(...args: any[]) {
        const listeners = this.prototype['__onInitListeners'] ?? []
        this.prototype['__onInitListeners'] = [
            (mesh: THREE.Object3D) => {
                this.prototype['__object'] = mesh.clone()
                this.prototype['beforeClone'] && this.prototype['beforeClone'](mesh, ...args)
            },
            ...listeners,
        ]
        return this.prototype
    }
}