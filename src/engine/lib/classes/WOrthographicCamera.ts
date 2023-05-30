import { PerspectiveCamera } from 'three';
import { WPerspectiveCamera } from './WPerspectiveCamera';
import { OrthographicCamera } from 'three';
import { CameraParser } from '../parsers/cameraParser';
import { CameraJson } from '../parsers/types/CameraJson.type';
import { CanvasProportion } from '../parsers/types/CanvasProportion.interface';

export class WOrthographicCamera extends OrthographicCamera {
    constructor(
        public override left: number,
        public override right: number,
        public override top: number,
        public override bottom: number,
        public override near: number,
        public override far: number
    ) {
        super(left, right, top, bottom, near, far);
    }

    static from(
        canvasProportion: CanvasProportion,
        camera: OrthographicCamera | PerspectiveCamera | CameraJson | 'perspectiveCamera' | 'orthographicCamera'
    ): WOrthographicCamera | WPerspectiveCamera {
        return CameraParser.parse(canvasProportion, camera);
    }
}