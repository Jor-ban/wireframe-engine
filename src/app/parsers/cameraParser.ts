import {Camera, OrthographicCamera, PerspectiveCamera} from "three";
import {CustomCamera, OrthographicCameraSettings, PerspectiveCameraSettings} from "../types/CustomCamera.interface";
import {CanvasProportion} from "../types/CanvasProportion.interface";

export function parseCamera(camera: Camera | CustomCamera | 'perspectiveCamera' | 'orthographicCamera' | undefined) {

}
export class CameraParser {
    public static parse(
        canvas: CanvasProportion,
        camera ?: Camera | CustomCamera | 'perspectiveCamera' | 'orthographicCamera',
    ): PerspectiveCamera | OrthographicCamera {
        if(camera instanceof PerspectiveCamera || camera instanceof OrthographicCamera) {
            return camera
        } else if(camera === 'perspectiveCamera' || camera === undefined) {
            return this.generatePerspectiveCamera(canvas)
        } else if(camera === 'orthographicCamera') {
            return this.generateOrthographicCamera(canvas)
        } else if(typeof camera === 'object' && !(camera instanceof Camera)) {
            // in case if user parametrizes with object
            if(camera.type === 'orthographicCamera' ||
                'left' in camera ||
                'right' in camera ||
                'top' in camera ||
                'bottom' in camera
            ) {
                return this.generateOrthographicCamera(
                    canvas,
                    camera.left, camera.right, camera.top, camera.bottom,
                    camera.near, camera.far
                );
            } else { // whether it is perspective camera
                return this.generatePerspectiveCamera(canvas, camera.fov, camera.aspect, camera.near, camera.far)
            }
        } else {
            console.error("[Engine -> Camera] : Only Perspective Camera or Orthographic camera types are supported")
            return this.generatePerspectiveCamera(canvas)
        }
    }
    private static generatePerspectiveCamera(
        canvas  : CanvasProportion,
        fov     : number = 60,
        aspect ?: number,
        near    : number = 0.1,
        far     : number = 1000,
    ): PerspectiveCamera {
        const pc = new PerspectiveCamera(fov, aspect || canvas.width / canvas.height, near, far)
        pc.position.set(1, 0, 3)
        pc.rotation.set(0, 0.1, 0)
        return pc
    }
    private static generateOrthographicCamera(
        canvas  : CanvasProportion,
        left    ?: number,
        right   ?: number,
        top     ?: number,
        bottom  ?: number,
        near    : number = 0.1,
        far     : number = 1000,
    ): OrthographicCamera {
        return new OrthographicCamera(
            left || canvas.width / - 2,
            right || canvas.width / 2,
            top || canvas.height / 2,
            bottom || canvas.height / - 2,
            near, far
        )
    }
}