import {Engine} from "⚙️/engine";
import {CannonEsExtension, GetRigidBody, WithPhysics} from "⚙️/examples/extentions/cannon-physics";
import {DecoratorsExtension, Mesh, Model} from "⚙️/examples/extentions/decorators";
import * as THREE from "three";
import CANNON from "cannon-es";
import {ControlsDecoratorsExtension, DevControl} from "⚙️/examples/extentions/controls-decorators";
import {WhenReady} from "⚙️/examples/utilClasses/when-ready";
import {EngineModes} from "⚙️/types/engineModes";
import {Color} from "three";

Engine.create('#canvas', {
    scene: {
        skybox: new Color('#FFF1DE'),
        children: [
            {
                parameters: { x: 2, y: 1, rotateZ: 120 },
                geometry: { type: 'box' },
                material: { color: 'blue' },
            },
        ]
    },
    // orbitControls: true,
    renderer: {
        antialias: true,
    },
    extensions: [
        CannonEsExtension,
        DecoratorsExtension,
        ControlsDecoratorsExtension,
    ],
    mode: EngineModes.PROD,
}).then((eng) => {
    Sphere.whenReady((s) => {
        void eng.add(s)
    })
})

@Mesh({
    geometry: { type: "sphere" },
    material: { color: "yellow" },
    parameters: { x: 1, y: 3, z: 2 },
})
@WithPhysics({
    mass: 1,
})
export class Sphere extends WhenReady {
    name = 'Sphere'

    @Model()
    private mesh: THREE.Mesh

    @GetRigidBody()
    private rb: CANNON.Body

    @DevControl({ type: Number, defaultValue: 0, })
    public num = 0
}