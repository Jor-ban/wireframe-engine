import {WeMesh} from "⚙️/examples/extentions/decorators";
import {Mesh, PlaneGeometry} from "three";

@WeMesh({
    geometry: {
        type: "plane",
        width: 4,
        height: 6,
        widthSegments: 4,
        heightSegments: 6,
    },
    material: {
        color: 'white',
        type: 'standard',
        wireframe: true,
        transparent: true,
        opacity: 0.5,
    },
    parameters: {
        x: 2,
        y: 0.25,
        z: 3,
        rotateX: -90,
    }
})
export class GridMesh {
    public constructor(private readonly mesh: Mesh) {}

    public changeSize(width: number, height: number) {
        this.mesh.geometry = new PlaneGeometry(
            Math.floor(width),
            Math.floor(height),
            Math.floor(width),
            Math.floor(height),
        );

        this.mesh.position.set(Math.floor(width) / 2, 0.01, Math.floor(height) / 2)
    }
}