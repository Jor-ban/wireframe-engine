import { ColorRepresentation, Object3D, Scene, SpotLight, SpotLightHelper } from "three";
import { ChangeDetector } from "../../changeDetector";
import { ElementWithHelper } from "../types/elementWithHelper.interface";

export class SpotLightWithHelper extends SpotLight implements ElementWithHelper {
    public helper: SpotLightHelper;
    public active: boolean = false;

    constructor(color?: ColorRepresentation, intensity?: number, distance?: number, angle?: number, penumbra?: number, decay?: number) {
        super(color, intensity, distance, angle, penumbra, decay);
        this.helper = new SpotLightHelper(this, 1);
        this.helper.visible = false;
        this.initEvents();
    }
    addToScene(scene: Scene | Object3D) {
        scene.add(this)
        scene.add(this.helper)
    }
    static from(light: SpotLight): SpotLightWithHelper {
        return new SpotLightWithHelper(light.color, light.intensity, light.distance, light.angle, light.penumbra, light.decay)
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
        super.dispose();
        this.helper.parent?.remove(this.helper)
        this.helper.dispose()
    }
}