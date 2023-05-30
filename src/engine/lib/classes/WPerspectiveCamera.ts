import { CanvasProportion } from '../parsers/types/CanvasProportion.interface';
import { CameraJson } from '../parsers/types/CameraJson.type';
import { PerspectiveCamera } from "three";
import { CameraParser } from '../parsers/cameraParser';
import { WOrthographicCamera } from './WOrthographicCamera';
export class WPerspectiveCamera extends PerspectiveCamera {
    constructor(
        public override fov: number,
        public override aspect: number,
        public override near: number,
        public override far: number
    ) {
        super(fov, aspect, near, far);
    }

    static from(
        canvasProportion: CanvasProportion,
        camera: PerspectiveCamera | CameraJson | 'perspectiveCamera' | 'orthographicCamera'
    ): WOrthographicCamera | WPerspectiveCamera {
        return CameraParser.parse(canvasProportion, camera);
    }
}
