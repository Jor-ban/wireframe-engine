import { ColorRepresentation, Object3D, PointLight, PointLightHelper, Scene } from "three";
import { ChangeDetector } from "../../../devEngine/changeDetector/changeDetector";
import { ElementWithHelper } from "../types/elementWithHelper.interface";

export class PointLightWithHelper extends PointLight implements ElementWithHelper {
    public helper: PointLightHelper
    public active: boolean = false

    constructor(color?: ColorRepresentation, intensity?: number, distance?: number, decay?: number) {
        super(color, intensity, distance, decay)
        this.helper = new PointLightHelper(this, 1, 'white')
        this.helper.visible = false
        this.initEvents()
    }
    addToScene(scene: Scene | Object3D) {
        scene.add(this)
        scene.add(this.helper)
    }
    static from(light: PointLight): PointLightWithHelper {
        return new PointLightWithHelper(light.color, light.intensity, light.distance, light.decay)
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