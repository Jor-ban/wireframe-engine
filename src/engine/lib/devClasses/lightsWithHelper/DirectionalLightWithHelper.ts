import { ColorRepresentation, DirectionalLight, DirectionalLightHelper, Object3D, Scene } from "three";
import { ChangeDetector } from "../../../devEngine/changeDetector";
import { ElementWithHelper } from '../types/elementWithHelper.interface';

export class DirectionalLightWithHelper extends DirectionalLight implements ElementWithHelper {
    public helper: DirectionalLightHelper
    public active: boolean = false

    constructor(color?: ColorRepresentation, intensity?: number) {
        super(color, intensity);
        this.helper = new DirectionalLightHelper(this, 1, 'white')
        this.helper.visible = false
        this.initEvents()
    }
    addToScene(scene: Scene | Object3D) {
        scene.add(this)
        scene.add(this.helper)
    }
    static from(light: DirectionalLight): DirectionalLightWithHelper {
        return new DirectionalLightWithHelper(light.color, light.intensity)
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
        super.dispose();
        this.helper.parent?.remove(this.helper)
        this.helper.dispose()
    }
}