import {WireframeEngine} from "./engine/engine";
const minecraft = require("../assets/minecraft.jpg");

new WireframeEngine('#canvas', {
    scene: {
        skybox: [minecraft, minecraft, minecraft, minecraft, minecraft, minecraft]
    },
    objects: [
        {
            geometry: {
                type: 'sphere',
            },
            material: {
                type: 'basic',
                color: 'red'
            }
        }
    ],
})