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
                geometry: { type: "sphere" },
                material: {
                    type: "basic",
                    color: 'red'
                },
                physics: true,
            },
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
})
@WithPhysics()
export class MainCamera {
    name = 'mainCamera'

    @Model()
    private mesh: THREE.Mesh

    @GetRigidBody()
    private rb: CANNON.Body

    constructor() {}

    onInit(camera: THREE.Object3D) {
        console.log(this.mesh, this.rb)
        this.mesh.removeFromParent()
        this.rb.world?.removeBody(this.rb)
    }
}
