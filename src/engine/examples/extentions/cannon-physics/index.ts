import { EngineInterface } from "⚙\uFE0F/types/Engine.interface";
import { EngineExtensionInterface } from "⚙\uFE0F/types/EngineExtensionInterface";
import { Object3D } from "three";
import * as CANNON from "cannon-es";
import { CannonEsParametersInterface } from "⚙️/examples/extentions/cannon-physics/types/cannon-es-parameters.interface";
import CannonDebugger from 'cannon-es-debugger'
import { CannonPhysicsJsonInterface } from "⚙️/examples/extentions/cannon-physics/types/object-with-physics.interface";
import { TimeMachine } from "⚙️/services/timeMachine.service";
import { DecorationTargetInterface } from "⚙️/examples/extentions/cannon-physics/types/decoration-target.interface";
import { PhysicsParser } from "⚙️/examples/extentions/cannon-physics/physics-parser";

export const CannonWorldKey = 'cannonPhysicsWorld'
class CannonEsExtensionFactory implements EngineExtensionInterface {
    public active: boolean = false
    private settings: CannonEsParametersInterface | null = null
    private world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.82, 0)
    })
    private debugger: { update:() => void } | null = null
    private wireframesMap: Map<CANNON.Body, Object3D> = new Map()
    private rigidBodyMap: WeakMap<Object3D, CANNON.Body> | null = new WeakMap()
    private activeMesh: Object3D | undefined = undefined

    beforeCreate(projectSettings: any): void {
        this.active = true
        const { gravity, gravityX, gravityZ } = this.settings?.physics ?? {}
        this.world.gravity.set(gravityX ?? 0, gravity ?? -9.82, gravityZ ?? 0)
    }
    onInit(eng: EngineInterface): void {
        eng.setProperty(CannonWorldKey, this.world)
        if(eng.mode === 'dev') {
            this.debugger = CannonDebugger(eng.scene, this.world, {
                ...( this.settings?.debugger ?? {} ),
                onInit: this.onDebuggerInit.bind(this)
            })
            const tm = TimeMachine.newInstance()
            tm.addListener((dt) => {
                this.debugger?.update()
            })
            tm.play()
            this.initEvents()
        } else {
            this.rigidBodyMap = null
            TimeMachine.addListener((dt) => {
                this.world.fixedStep()
            }).play()
        }
    }

    public setParameters(params: CannonEsParametersInterface): EngineExtensionInterface {
        this.settings = params
        if(params.active !== false) {
            this.active = true
        }
        return this
    }

    private onDebuggerInit(body: CANNON.Body, mesh: Object3D, shape: CANNON.Shape) {
        mesh.visible = false
        this.wireframesMap.set(body, mesh)
    }
    private initEvents() {
        import('../../../devEngine/changeDetector/index').then(({ ChangeDetector }) => {
            ChangeDetector.clickedObject$.subscribe((obj) => {
                if(this.activeMesh) this.activeMesh.visible = false
                const body = this.rigidBodyMap?.get(obj)
                if(body) {
                    const mesh = this.wireframesMap.get(body)
                    if(mesh) {
                        mesh.visible = !mesh.visible
                    }
                    this.activeMesh = mesh
                }
            })
        })
    }

    public WITH_PHYSICS(physicsJson: CannonPhysicsJsonInterface | undefined = undefined) {
        return (constructor: Function): any => {
            constructor = constructor as DecorationTargetInterface
            if(!constructor.prototype.__onInitListeners) {
                constructor.prototype.__onInitListeners = []
            }
            constructor.prototype.__onInitListeners.unshift((obj: Object3D) => {
                const body = this.addBody(obj, physicsJson)
                this.rigidBodyMap?.set(obj, body)
                constructor.prototype.__rigidBody = body
            })
        }
    }

    public GET_RIGID_BODY() {
        return (target: DecorationTargetInterface['prototype'], propertyName: string) => {
            if(!target.__onInitListeners)
                target.__onInitListeners = []
            target.__onInitListeners.push((obj: Object3D) => {
                target[propertyName] = target.__rigidBody
            })
        }
    }

    public RIGID_BODY(physicsJson: CannonPhysicsJsonInterface | undefined = undefined) {
        return (target: DecorationTargetInterface['prototype'], propertyName: string) => {
            if(!target.__onInitListeners)
                target.__onInitListeners = []
            target.__onInitListeners.push((obj: Object3D) => {
                const body = this.addBody(obj, physicsJson)
                target.__rigidBody = body
                this.rigidBodyMap?.set(obj, body)
                target[propertyName] = body
            })
        }
    }


    public addBody(object: Object3D, physicsJson: CannonPhysicsJsonInterface | undefined = undefined): CANNON.Body {
        const body = PhysicsParser.parse(object, physicsJson)
        this.world.addBody(body)
        if(physicsJson.bindToMesh) {
            const data = typeof physicsJson.bindToMesh === 'boolean' ? {
                position: true,
                quaternion: true,
            } : physicsJson.bindToMesh
            TimeMachine.addListener(() => {
                if(data.position) // @ts-ignore
                    object.position.copy(body.position)
                if(data.quaternion) // @ts-ignore
                    object.quaternion.copy(body.quaternion)
            })
        }
        return body
    }
}
export const CannonEsExtension = new CannonEsExtensionFactory()

export const WithPhysics = CannonEsExtension.WITH_PHYSICS.bind(CannonEsExtension)
export const GetRigidBody = CannonEsExtension.GET_RIGID_BODY.bind(CannonEsExtension)
export const RigidBody = CannonEsExtension.RIGID_BODY.bind(CannonEsExtension)