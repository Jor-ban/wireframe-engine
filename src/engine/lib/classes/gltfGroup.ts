import { Group } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export class GLTFGroup extends Group {
    public gltfData !: GLTF

    public static from(gltf: GLTF): GLTFGroup {
        const group = gltf.scene as any
        group.__proto__ = GLTFGroup.prototype
        group.gltfData = gltf
        return group
    }
}