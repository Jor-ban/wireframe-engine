import {Color} from "three";

export interface CannonEsParametersInterface {
    physics?: {
        gravity?: number
        gravityX?: number
        gravityZ?: number
    }
    debugger?: {
        enableInTest?: boolean,
        scale?: number;
        color?: string | number | Color;
    }
    active?: boolean
}