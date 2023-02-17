import { ChangeDetector } from '../../../devEngine/changeDetector';
import { CameraHelper, Object3D, OrthographicCamera, PerspectiveCamera, Scene } from 'three';
import { ElementWithHelper } from '../types/elementWithHelper.interface';

export class CameraWithHelper extends PerspectiveCamera implements ElementWithHelper {
    public helper: CameraHelper;
    public active: boolean = false

    constructor(fov?: number, aspect?: number, near?: number, far?: number) {
        super(fov, aspect, near, far);
        this.helper = new CameraHelper(this)
        this.helper.visible = false
        this.initEvents()
    }
    public addToScene(scene: Scene | Object3D) {
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
    initEvents() {
        ChangeDetector.hoveredObject$.subscribe((hoveredObject) => {
            if(hoveredObject === this) {
                this.helper.visible = true
            } else if(!this.active) {
                this.helper.visible = false
            }
        })
        ChangeDetector.clickedObject$.subscribe((selectedObject) => {
            if(selectedObject === this) {
                this.active = true
                this.helper.visible = true
            } else {
                this.active = false
                this.helper.visible = false
            }
        })
    }
    dispose() {
        super.parent?.remove(this)
        this.helper.parent?.remove(this.helper)
        this.helper.dispose()
    }
}

export class OrthographicCameraWithHelper extends OrthographicCamera implements ElementWithHelper {
    public helper: CameraHelper;
    public active: boolean = false;

    constructor(left?: number, right?: number, top?: number, bottom?: number, near?: number, far?: number) {
        super(left, right, top, bottom, near, far);
        this.helper = new CameraHelper(this)
    }
    public addToScene(scene: Scene | Object3D) {
        scene.add(this)
        scene.add(this.helper)
    }
    static from(camera: PerspectiveCamera | OrthographicCamera): CameraWithHelper | OrthographicCameraWithHelper {
        return CameraWithHelper.from(camera)
    }

    initEvents() {
        ChangeDetector.hoveredObject$.subscribe((hoveredObject) => {
            if(hoveredObject === this) {
                this.helper.visible = true
            } else if(this.active) {
                this.helper.visible = false
            }
        })
        ChangeDetector.clickedObject$.subscribe((selectedObject) => {
            if(selectedObject === this) {
                this.active = true
                this.helper.visible = true
            } else {
                this.active = false
                this.helper.visible = false
            }
        })
    }
    dispose() {
        super.parent?.remove(this)
        this.helper.parent?.remove(this.helper)
        this.helper.dispose()
    }
}