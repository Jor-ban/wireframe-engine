import { Camera, OrthographicCamera, PerspectiveCamera } from "three";
import { WOrthographicCamera } from "../classes/WOrthographicCamera";
import { WPerspectiveCamera } from "../classes/WPerspectiveCamera";
import { CameraJson } from "./types/CameraJson.type";
import { CanvasProportion } from "./types/CanvasProportion.interface";
import {Object3dParser} from "⚙️/lib/parsers/Object3dParser";

export class CameraParser {
    public static parse(
        canvas: CanvasProportion,
        camera ?: Camera | CameraJson | 'perspectiveCamera' | 'orthographicCamera',
    ): WOrthographicCamera | WPerspectiveCamera {
        let c: WOrthographicCamera | WPerspectiveCamera
        if(camera instanceof PerspectiveCamera) {
            c = this.generatePerspectiveCamera(canvas, camera.fov, camera.aspect, camera.near, camera.far)
            c.name = camera.name
            c.uuid = camera.uuid
        } else if(camera instanceof OrthographicCamera) {
            c = this.generateOrthographicCamera(canvas, camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far)
            c.name = camera.name
            c.uuid = camera.uuid
        } else if(camera === 'perspectiveCamera' || camera === undefined) {
            c = this.generatePerspectiveCamera(canvas)
        } else if(camera === 'orthographicCamera') {
            c = this.generateOrthographicCamera(canvas)
        } else if(typeof camera === 'object' && !(camera instanceof Camera)) {
            // in case if user parametrizes with object
            if(camera.type === 'orthographicCamera' ||
                'left' in camera ||
                'right' in camera ||
                'top' in camera ||
                'bottom' in camera
            ) {
                c = this.generateOrthographicCamera(
                    canvas,
                    // @ts-ignore
                    camera.left, camera.right, camera.top, camera.bottom,
                    camera.near, camera.far
                );
            } else { // whether it is perspective camera
                c = this.generatePerspectiveCamera(canvas, camera.fov, camera.aspect, camera.near, camera.far)
            }
            if(camera.name) {
                c.name = camera.name
            }
            if(camera.uuid) {
                c.uuid = camera.uuid
            }
            if(camera.parameters) {
                Object3dParser.setParameters(c, camera.parameters)
            }
        } else {
            console.error("[Engine -> Camera] : Only Perspective Camera or Orthographic camera types are supported")
            c = this.generatePerspectiveCamera(canvas)
        }
        return c;
    }
    private static generatePerspectiveCamera(
        canvas  : CanvasProportion,
        fov     : number = 60,
        aspect  : number | undefined = undefined,
        near    : number = 0.1,
        far     : number = 512,
    ): WPerspectiveCamera {
        return new WPerspectiveCamera(fov, aspect || canvas.width / canvas.height, near, far)
    }
    private static generateOrthographicCamera(
        canvas  : CanvasProportion,
        left    ?: number,
        right   ?: number,
        top     ?: number,
        bottom  ?: number,
        near    : number = 0.1,
        far     : number = 1000,
    ): WOrthographicCamera {
        return new WOrthographicCamera(
            left || canvas.width / - 2,
            right || canvas.width / 2,
            top || canvas.height / 2,
            bottom || canvas.height / - 2,
            near, far
        )
    }
}