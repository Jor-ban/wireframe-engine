import {ColorRepresentation, Scene, SpotLight, SpotLightHelper} from "three";

export class DevSpotLight extends SpotLight {
    public helper: SpotLightHelper;
    constructor(color?: ColorRepresentation, intensity?: number, distance?: number, angle?: number, penumbra?: number, decay?: number) {
        super(color, intensity, distance, angle, penumbra, decay);
        this.helper = new SpotLightHelper(this, 1);
    }
    addToScene(scene: Scene) {
        scene.add(this)
        scene.add(this.helper)
    }
    static from(light: SpotLight): DevSpotLight {
        return new DevSpotLight(light.color, light.intensity, light.distance, light.angle, light.penumbra, light.decay)
    }
    dispose() {
        super.dispose();
        this.helper.parent?.remove(this.helper)
        this.helper.dispose()
    }
}