import {ColorRepresentation, DirectionalLight, DirectionalLightHelper, Scene} from "three";

export class DirectionalLightWithHelper extends DirectionalLight {
    public helper: DirectionalLightHelper
    constructor(color?: ColorRepresentation, intensity?: number) {
        super(color, intensity);
        this.helper = new DirectionalLightHelper(this, 1, 'white')
    }
    addToScene(scene: Scene) {
        scene.add(this)
        scene.add(this.helper)
    }
    static from(light: DirectionalLight): DirectionalLightWithHelper {
        return new DirectionalLightWithHelper(light.color, light.intensity)
    }
    dispose() {
        super.dispose();
        this.helper.parent?.remove(this.helper)
        this.helper.dispose()
    }
}