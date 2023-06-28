import { Engine } from "⚙️/engine";
import trees from './static/models/trees.fbx?url'
import { CannonEsExtension } from "⚙️/examples/extentions/cannon-es.extention";

Engine.create('#canvas', {
    scene: {
        children: [
            {
                geometry: { type: 'sphere' },
                material: {
                    type: 'basic',
                    color: 'red'
                }
            },
            {
                parameters: { x: 2, y: 1, rotateZ: 120 },
                geometry: { type: 'box' },
                material: { color: 'blue' },
            },
            // {
            //     url: trees,
            //     parameters: {scaleX: 0.1, scaleY: 0.1, scaleZ: 0.1,},
            // }
        ]
    },
    orbitControls: true,
    renderer: {
        antialias: true,
    },
    extensions: [
        CannonEsExtension,
    ]
})