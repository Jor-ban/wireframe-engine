import { PerspectiveCamera } from 'three';
import { WPerspectiveCamera } from './WPerspectiveCamera';
import { OrthographicCamera } from 'three';
import { CameraParser } from '../parsers/cameraParser';
import { CameraJson } from '../parsers/types/CameraJson.type';
import { CanvasProportion } from '../parsers/types/CanvasProportion.interface';
import { Stringifyable } from './types/stringifyable.interface';

export class WOrthographicCamera extends OrthographicCamera implements Stringifyable {
    constructor(
        public left: number,
        public right: number,
        public top: number,
        public bottom: number,
        public near: number,
        public far: number
    ) {
        super(left, right, top, bottom, near, far);
    }

    static from(
        canvasProportion: CanvasProportion,
        camera: OrthographicCamera | PerspectiveCamera | CameraJson | 'perspectiveCamera' | 'orthographicCamera'
    ): WOrthographicCamera | WPerspectiveCamera {
        return CameraParser.parse(canvasProportion, camera);
    }

    public toJson(): string {
        return ''
    }
}