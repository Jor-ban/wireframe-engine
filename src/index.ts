import { Engine } from "⚙️/engine";
import barrel from './static/models/barrel.fbx?url'
import { CannonEsExtension } from "⚙\uFE0F/examples/extentions/cannon-physics/cannon-es.extention";

Engine.create('#canvas', {
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
                url: barrel,
                parameters: {scaleX: 0.1, scaleY: 0.1, scaleZ: 0.1,},
            }
        ]
    },
    orbitControls: true,
    renderer: {
        antialias: true,
    },
    extensions: [
       // CannonEsExtension
    ],
    cannonPhysics: true,
})