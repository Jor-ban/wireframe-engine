import {OrthographicCamera, PerspectiveCamera, PointLight} from "three";

export class LightGenerator {
    static addPointLight(camera: PerspectiveCamera | OrthographicCamera): PointLight {
        const light = new PointLight(0xffffff, 1, 100)
        light.position.set(0, 0, 0)
        light.castShadow = true
        light.shadow.mapSize.width = 1024
        light.shadow.mapSize.height = 1024
        light.shadow.camera.near = 0.5
        light.shadow.camera.far = 500
        return light
    }
}