import { CameraHelper, OrthographicCamera, PerspectiveCamera, Scene } from 'three';

export class CameraWithHelper extends PerspectiveCamera {
    public helper: CameraHelper;
    constructor(fov?: number, aspect?: number, near?: number, far?: number) {
        super(fov, aspect, near, far);
        this.helper = new CameraHelper(this)
    }
    public addToScene(scene: Scene) {
        scene.add(this)
        scene.add(this.helper)
    }
    static from(camera: PerspectiveCamera | OrthographicCamera): CameraWithHelper | OrthographicCameraWithHelper {
        if(camera instanceof OrthographicCamera) {
            return new OrthographicCameraWithHelper(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far)
        } else {
            return new CameraWithHelper(camera.fov, camera.aspect, camera.near, camera.far)
        }
    }
    dispose() {
        super.parent?.remove(this)
        this.helper.parent?.remove(this.helper)
        this.helper.dispose()
    }
}

export class OrthographicCameraWithHelper extends OrthographicCamera {
    public helper: CameraHelper;
    constructor(left?: number, right?: number, top?: number, bottom?: number, near?: number, far?: number) {
        super(left, right, top, bottom, near, far);
        this.helper = new CameraHelper(this)
    }
    public addToScene(scene: Scene) {
        scene.add(this)
        scene.add(this.helper)
    }
    static from(camera: PerspectiveCamera | OrthographicCamera): CameraWithHelper | OrthographicCameraWithHelper {
        return CameraWithHelper.from(camera)
    }
    dispose() {
        super.parent?.remove(this)
        this.helper.parent?.remove(this.helper)
        this.helper.dispose()
    }
}