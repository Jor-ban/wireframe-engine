import {ColorRepresentation, PointLight, PointLightHelper, Scene} from "three";

export class DevPointLight extends PointLight {
    public helper: PointLightHelper
    constructor(color?: ColorRepresentation, intensity?: number, distance?: number, decay?: number) {
        super(color, intensity, distance, decay)
        this.helper = new PointLightHelper(this, 1, 'white')
    }
    addToScene(scene: Scene) {
        scene.add(this)
        scene.add(this.helper)
    }
    static from(light: PointLight): DevPointLight {
        return new DevPointLight(light.color, light.intensity, light.distance, light.decay)
    }
    dispose() {
        super.dispose();
        this.helper.parent?.remove(this.helper)
        this.helper.dispose()
    }
}