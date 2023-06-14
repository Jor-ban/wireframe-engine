import { Engine } from "⚙️/engine";
import fox from './static/models/Fox.glb?url'

Engine.create('#canvas', {
    objects: [
        // {
        //     geometry: { type: 'sphere' },
        //     material: {
        //         type: 'basic',
        //         color: 'red'
        //     }
        // },
        // {
        //     parameters: { x: 2, y: 1, rotateZ: 120 },
        //     geometry: { type: 'box' },
        //     material: { color: 'blue' },
        // },
        {
            url: fox,
            parameters: { scaleX: 0.1, scaleY: 0.1, scaleZ: 0.1, },
        }
    ],
    orbitControls: true,
    renderer: {
        antialias: true,
    },
})