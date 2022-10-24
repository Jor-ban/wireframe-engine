import {WireframeEngine} from "./engine/engine";
import {EngineModes} from "./engine/types/engineModes";

const negY = require("../assets/skybox/sky_negY.jpg");
const negX = require("../assets/skybox/sky_negX.jpg");
const posY = require("../assets/skybox/sky_posY.jpg");
const posX = require("../assets/skybox/sky_posX.jpg");
const posZ = require("../assets/skybox/sky_posZ.jpg");
const negZ = require("../assets/skybox/sky_negZ.jpg");

const app = new WireframeEngine('#canvas', {
    scene: {
        skybox: { negY, negX, negZ, posY, posX, posZ },
    },
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