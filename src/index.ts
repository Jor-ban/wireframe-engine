import { Engine } from "⚙️/engine";
import weapons from './static/models/weapons.fbx?url'
import { CannonEsExtension } from "⚙\uFE0F/examples/extentions/cannon-physics/cannon-es.extention";
import { Camera, DecoratorsExtension } from "⚙️/examples/extentions/decorators";

await Engine.create('#canvas', {
    scene: {
        children: [
            // {
            //     geometry: { type: 'sphere' },
            //     material: {
            //         type: 'basic',
            //         color: 'red'
            //     },
            //     physics: true,
            // },
            // {
            //     parameters: { x: 2, y: 1, rotateZ: 120 },
            //     geometry: { type: 'box' },
            //     material: { color: 'blue' },
            // },
            {
                url: weapons,
                parameters: {scale: 0.01},
            }
        ]
    },
    orbitControls: true,
    renderer: {
        antialias: true,
    },
    extensions: [
       // CannonEsExtension,
        DecoratorsExtension
    ],
    cannonPhysics: true,
})

@Camera({
    type: 'perspectiveCamera',
})
export class MainCamera {
    constructor() {
        console.log('camera created');
    }
}

console.log(MainCamera)