import {WireframeEngine} from "./engine/engine";

const app = new WireframeEngine('#canvas', {
    objects: [
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
        }
    ],
    renderer: {
        antialias: true,
    },
})