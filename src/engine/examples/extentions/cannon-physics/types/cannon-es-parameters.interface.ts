import {Color} from "three";

export interface CannonEsParametersInterface {
    cannonPhysics?: boolean | {
        gravity?: number
        gravityX?: number
        gravityZ?: number
    }
    debugger: {
        enableInTest?: boolean,
        scale?: number;
        color?: string | number | Color;
    }
}