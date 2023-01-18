import {ColorRepresentation, HemisphereLight, HemisphereLightHelper, Scene} from "three";

export class HemisphereLightWithHelper extends HemisphereLight {
    public helper: HemisphereLightHelper;
    constructor(skyColor?: ColorRepresentation, groundColor?: ColorRepresentation, intensity?: number) {
        super(skyColor, groundColor, intensity);
        this.helper = new HemisphereLightHelper(this, 1, 'white');
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