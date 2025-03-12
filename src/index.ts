import {Engine} from "⚙️/engine";
import {Controller, DecoratorsExtension, Mesh} from "⚙️/examples/extentions/decorators";
import {Color} from "three";
import {ControllerFunctional} from "⚙️/examples/extentions/decorators/classes/controller-functional";

@Mesh({
    geometry: { type: "sphere" },
    material: { color: "yellow" },
    parameters: { x: 1, y: 3, z: 2 },
})
export class Sphere {
    name = 'Sphere'
}

@Controller({
    autoMount: true,
    objects: [
        Sphere
    ],
})
export class ChildController extends ControllerFunctional {
    onObjectsInit(objs): void {
        console.log(objs)
    }
}

@Controller({
    autoMount: true,
    controllers: [ChildController],
})
export class MainController extends ControllerFunctional {
    onObjectsInit(objs): void {
        console.log(objs)
    }
}

void Engine.create('#canvas', {
    scene: {
        skybox: new Color('#FFF1DE'),
    },
    // orbitControls: true,
    renderer: {
        antialias: true,
    },
    extensions: [
        DecoratorsExtension,
    ],
    controllers: [MainController],
    // mode: EngineModes.PROD,
})