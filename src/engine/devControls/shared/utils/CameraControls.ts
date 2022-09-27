import {OrthographicCamera, PerspectiveCamera} from "three";
import {FolderApi, TabPageApi} from "tweakpane";
import {Object3DControls} from "./Object3DControls";

export class CameraControls {
    static addForCamera(camera: PerspectiveCamera | OrthographicCamera, folder: FolderApi | TabPageApi) {
        Object3DControls.addPositions(camera, folder)
        Object3DControls.addRotation(camera, folder)
        folder.addSeparator()
        if(camera instanceof PerspectiveCamera) {
            this.addForPerspectiveCamera(camera, folder)
        }
        folder.addSeparator()
        folder.addButton({title: 'Update Camera'})
            .on('click', () => {
                camera.updateProjectionMatrix()
            });
    }
    static addForPerspectiveCamera(camera: PerspectiveCamera, folder: FolderApi | TabPageApi) {
        folder.addInput({'near-far': { min: camera.near, max: camera.far }}, 'near-far', {
            min: 0.1,
            max: 4096,
            step: 10,
        }).on('change', ({value}) => {
            camera.near = value.min < 0.1 ? 0.1 : value.min
            camera.far = value.max
            camera.updateProjectionMatrix()
        })
        folder.addInput(camera, 'fov', {
            view: 'cameraring',
            min: 1,
            max: 180
        }).on('change', ({value}) => {
            camera.fov = value
            camera.updateProjectionMatrix()
        });
        folder.addInput(camera, 'filmGauge', {
            view: 'cameraring',
            series: 1,
            // unit: {ticks: 10, pixels: 40, value: 0.2}
        }).on('change', ({value}) => {
            camera.fov = value
            camera.updateProjectionMatrix()
        });

        // folder.addInput(camera, 'aspect', {
        //     view: 'cameraring',
        //     series: 2,
        //     unit: {ticks: 10, pixels: 40, value: 0.2}
        // }).on('change', ({value}) => {
        //     camera.aspect = value
        //     camera.updateProjectionMatrix()
        // })
    }
}