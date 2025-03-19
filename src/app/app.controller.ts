import {WeController} from "⚙️/examples/extentions/decorators";
import {ControllerFunctional, ControllerInit} from "⚙️/examples/extentions/decorators/classes/controller-functional";
import {RoomController} from "@/app/room/room.controller";
import {cameraParameters} from "@/app/plugins/camera.plugin";
import {Vector3} from "three";
import {UIFramework} from "⚙️/examples/extentions/UIFramework";
import gsap from "gsap";
import {UiController} from "@/app/ui/ui.controller";

@WeController({
    autoMount: true,
    controllers: {
        RoomController,
        UiController,
    },
    objects: [],
})
export class AppController extends ControllerFunctional implements ControllerInit {
    private readonly rc = this.getController(RoomController)
    private readonly uic = this.getController(UiController)

    public onControllerInit(): void {
        this.addTweaks(this.rc)
    }

    private addTweaks(rc: RoomController) {
        const defaultSizes = new Vector3(4, 3, 6)
        this.navigateAndLookCamera(defaultSizes, rc)

        this.addTweak(defaultSizes, 'x', {
            step: 0.5,
            min: 1,
            max: 12,
            label: 'длина',

            onChangeFn: (v) => {
                this.showDimensions(defaultSizes)
                rc.resize(defaultSizes.x, defaultSizes.z, defaultSizes.y)
                this.navigateAndLookCamera(defaultSizes, rc)
            }
        })
        this.addTweak(defaultSizes, 'z', {
            step: 0.5,
            min: 1,
            max: 12,
            label: 'ширина',

            onChangeFn: (v) => {
                this.showDimensions(defaultSizes)
                rc.resize(defaultSizes.x, defaultSizes.z, defaultSizes.y)
                this.navigateAndLookCamera(defaultSizes, rc)
            }
        })

        this.addTweak(defaultSizes, 'y', {
            step: 0.1,
            min: 1,
            max: 6,
            label: 'высота',

            onChangeFn: (v) => {
                this.showDimensions(defaultSizes)
                rc.resize(defaultSizes.x, defaultSizes.z, defaultSizes.y)
                this.navigateAndLookCamera(defaultSizes, rc)
            }
        })
    }

    private navigateAndLookCamera(sizes: Vector3, rc: RoomController) {
        cameraParameters.next({
            lookAt: rc.roomCenter,
            x: sizes.x / 2,
            y: sizes.y + (sizes.x * sizes.z) / 5,
            z: sizes.z / 2,
        })
    }

    private showDimensions(sizes: Vector3) {
        document.querySelector('#roomDimensions')?.remove()

        const dimensionsEl = UIFramework.add(`
            <h2 id="roomDimensions" style="
                padding: 10px 20px;
                border-radius: 10px;
                width: max-content;
                position: absolute;
                top: 50vh;
                left: 50vw;
                transform: translate(-50%, -50%);
                background-color: rgba(0,0,0,0.38);
                color: white;
            ">${ sizes.x.toFixed(1) } x ${ sizes.z.toFixed(1) } x ${ sizes.y.toFixed(1) }</h2>
        `)

        gsap.to(dimensionsEl, {
            opacity: 0,
            duration: 2,
            ease: 'expo.in'
        })
    }
}