import { Group } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export class GLTFGroup extends Group {
    // @ts-ignore
    protected gltfData: GLTF

    public static from(gltf: GLTF): GLTFGroup {
        const group = gltf.scene as GLTFGroup
        group.gltfData = gltf
        return group
    }
}