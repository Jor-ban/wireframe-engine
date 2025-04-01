import {DecoratorsExtension} from "⚙️/examples/extentions/decorators";
import {Color} from "three";
import {AppController} from "@/app/app.controller";
import {Engine, EngineModes} from "@/engine";
import {CameraPlugin} from "@/app/plugins/camera.plugin";
import {UIFramework} from "⚙️/examples/extentions/UIFramework";
import {RaycasterPlugin} from "@/app/plugins/raycaster.plugin";

void Engine.create('#canvas', {
    scene: {
        // skybox: new Color('#FFF1DE'),
    },
    camera: {
        type: 'perspectiveCamera',
        parameters: {
            x: 4,
            y: 4,
            z: 4,
        }
    },
    // orbitControls: true,
    renderer: {
        antialias: true,
    },
    plugins: [
        UIFramework,
        DecoratorsExtension,
        CameraPlugin,
        RaycasterPlugin,
    ],
    orbitControls: {
        panning: true,
        zoom: false,
        rotate: true,
        damping: false,
    },
    controllers: [AppController],
    // mode: EngineModes.PROD,
})
