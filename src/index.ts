import { Engine } from "⚙️/engine";
import { CannonEsExtension } from "⚙\uFE0F/examples/extentions/cannon-physics";
import { DecoratorsExtension, Mesh, Model} from "⚙️/examples/extentions/decorators";
import * as THREE from "three";
import {GetRigidBody, WithPhysics} from "⚙️/examples/extentions/cannon-physics";
import CANNON from "cannon-es";

const eng = await Engine.create('#canvas', {
    scene: {
        children: [
            {
                parameters: { x: 2, y: 1, rotateZ: 120 },
                geometry: { type: 'box' },
                material: { color: 'blue' },
            },
        ]
    },
    orbitControls: true,
    renderer: {
        antialias: true,
    },
    extensions: [
        CannonEsExtension,
        DecoratorsExtension
    ],
    cannonPhysics: true,
})


@Mesh({
    geometry: { type: "sphere" },
    material: { color: "yellow" },
    parameters: { x: 1, y: 3, z: 2 },
})
@WithPhysics({
    mass: 1,
})
export class Sphere {
    name = 'Sphere'

    @Model()
    private mesh: THREE.Mesh

    @GetRigidBody()
    private rb: CANNON.Body

    constructor() {}

    onInit(camera: THREE.Object3D) {
        void eng.add(this.mesh)
    }
}
