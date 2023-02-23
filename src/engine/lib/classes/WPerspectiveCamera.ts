import { CanvasProportion } from './../parsers/types/CanvasProportion.interface';
import { CameraJson } from './../parsers/types/CameraJson.type';
import { PerspectiveCamera } from "three";
import { CameraParser } from '../parsers/cameraParser';
import { WOrthographicCamera } from './WOrthographicCamera';
import { Stringifyable } from './types/stringifyable.interface';

export class WPerspectiveCamera extends PerspectiveCamera implements Stringifyable {
    constructor(
        public fov: number,
        public aspect: number,
        public near: number,
        public far: number
    ) {
        super(fov, aspect, near, far);
    }

    static from(
        canvasProportion: CanvasProportion,
        camera: PerspectiveCamera | CameraJson | 'perspectiveCamera' | 'orthographicCamera'
    ): WOrthographicCamera | WPerspectiveCamera {
        return CameraParser.parse(canvasProportion, camera);
    }

    public toJson(): string {
        return ''
    }
}