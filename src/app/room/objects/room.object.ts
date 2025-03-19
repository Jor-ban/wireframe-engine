import {WeMesh} from "⚙️/examples/extentions/decorators";
import {BoxGeometry, Color} from "three";
import {BackSide} from "three/src/constants";
import * as THREE from "three";

@WeMesh({
    parameters: {
        x: 2,
        y: 1.5,
        z: 3
    },
    geometry: {
        type: "box",
        depth: 6,
        width: 4,
        height: 3,
    },
    material: {
        type: 'basic',
        color: new Color('grey'),
        side: BackSide
    }
})
export class RoomMesh {
    private height = 3

    public constructor(public readonly mesh: THREE.Mesh) {}

    public changeSize(width: number, depth: number, height ?: number) {
        this.height = height ?? this.height
        this.mesh.geometry = new BoxGeometry(width, this.height, depth);

        this.mesh.position.set(width / 2, this.height / 2, depth / 2)
    }
}