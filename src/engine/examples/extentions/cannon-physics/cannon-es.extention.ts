import { EngineInterface } from "⚙\uFE0F/types/Engine.interface";
import { EngineExtensionInterface } from "⚙\uFE0F/types/EngineExtensionInterface";
import { Object3D } from "three";
import * as CANNON from "cannon-es";
import { CannonEsParametersInterface } from "⚙️/examples/extentions/cannon-physics/types/cannon-es-parameters.interface";
import { ParseListener } from "⚙️/lib/parsers/ParsingManager";
import CannonDebugger from 'cannon-es-debugger'
import { ObjectWithPhysicsInterface } from "⚙️/examples/extentions/cannon-physics/types/object-with-physics.interface";
import { PhysicsParser } from "./physics-parser";
import { TimeMachine } from "⚙️/services/timeMachine.service";

export const CannonWorldKey = 'cannonPhysicsWorld'
class CannonEsExtensionFactory implements EngineExtensionInterface {
    public active: boolean = false
    private settings!: CannonEsParametersInterface
    private world!: CANNON.World
    private debugger: { update:() => void } | null = null
    private wireframesMap: Map<CANNON.Body, Object3D> = new Map()
    private activeMesh: Object3D | undefined = undefined


    private parserCallback: ParseListener = () => {}
    beforeCreate(projectSettings: any): void {
        projectSettings = projectSettings as CannonEsParametersInterface
        this.settings = projectSettings
        if(!projectSettings.cannonPhysics) return

        this.active = true
        const { gravity, gravityX, gravityZ } = projectSettings.cannonPhysics
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(gravityX ?? 0, gravity ?? -9.82, gravityZ ?? 0)
        })
    }
    afterCreate(eng: EngineInterface): void {
        this.parserCallback = this.onParse.bind(this)
        eng.parsingManager.addListener(this.parserCallback)
    }
    onInit(eng: EngineInterface): void {
        eng.setProperty(CannonWorldKey, this.world)
        console.log(eng.mode === 'dev')
        if(eng.mode === 'dev') {
            this.debugger = CannonDebugger(eng.scene, this.world, {
                ...( this.settings?.debugger ?? {} ),
                onInit: this.onDebuggerInit.bind(this)
            })
            TimeMachine.addListener((dt) => {
                this.debugger?.update()
                this.world.step(dt / 1000, dt, 3)
            })
        } else {
            TimeMachine.addListener((dt) => {
                this.world.step(dt / 1000, dt, 3)
            })
        }
        this.initEvents()
    }

    private onParse(json: any, obj: Object3D): void {
        json = json as ObjectWithPhysicsInterface
        if(json.physics) {
            this.world.addBody(PhysicsParser.parse(json.physics, obj))
        }
    }

    beforeDestroy(eng: EngineInterface): void {
        eng.parsingManager.removeListener(this.parserCallback)
    }
    private onDebuggerInit(body: CANNON.Body, mesh: Object3D, shape: CANNON.Shape) {
        mesh.visible = false
        this.wireframesMap.set(body, mesh)
    }
    private initEvents() {
        import('../../../devEngine/changeDetector/index').then(({ ChangeDetector }) => {
            ChangeDetector.clickedObject$.subscribe((obj) => {
                if(this.activeMesh) this.activeMesh.visible = false

                if(obj && 'rigidBody' in obj && obj.rigidBody instanceof CANNON.Body) {
                    const mesh = this.wireframesMap.get(obj['rigidBody'])
                    if(mesh) {
                        mesh.visible = !mesh.visible
                    }
                    this.activeMesh = mesh
                }
            })
        })
    }
}
export const CannonEsExtension = new CannonEsExtensionFactory()