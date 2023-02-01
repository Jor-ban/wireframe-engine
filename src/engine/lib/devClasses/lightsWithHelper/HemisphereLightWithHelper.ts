import { ColorRepresentation, HemisphereLight, HemisphereLightHelper, Scene } from "three";
import { ChangeDetector } from "../../../devEngine/changeDetector/changeDetector";
import { ElementWithHelper } from "../types/elementWithHelper.interface";

export class HemisphereLightWithHelper extends HemisphereLight implements ElementWithHelper {
    public helper: HemisphereLightHelper;
    public active: boolean = false;
    constructor(skyColor?: ColorRepresentation, groundColor?: ColorRepresentation, intensity?: number) {
        super(skyColor, groundColor, intensity);
        this.helper = new HemisphereLightHelper(this, 1, 'white');
        this.helper.visible = false;
        this.initEvents();
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
    addToScene(scene: Scene) {
        scene.add(this)
        scene.add(this.helper)
    }
    static from(light: HemisphereLight): HemisphereLightWithHelper {
        return new HemisphereLightWithHelper(light.color, light.groundColor, light.intensity)
    }
    dispose() {
        super.dispose();
        this.helper.parent?.remove(this.helper)
        this.helper.dispose()
    }
}