import { EngineExtensionInterface } from "⚙️/types/EngineExtensionInterface";
import { EngineInterface } from "⚙️/types/Engine.interface";
import { CameraJson } from "⚙️/lib/parsers/types/CameraJson.type";
import { CameraParser } from "⚙️/lib/parsers/cameraParser";
import { MeshParser } from "⚙️/lib/parsers/MeshParser";
import { MeshJson, PathToMeshJson } from "⚙️/lib/parsers/types/MeshJson.type";
import { LightJson } from "⚙️/lib/parsers/types/LightJson.type";
import { Object3dParser } from "⚙️/lib/parsers/Object3dParser";
import * as THREE from "three";
import { Object3dJSON } from "⚙️/lib/parsers/types/Object3DJson.type";
import { LightParser } from "⚙️/lib/parsers/lightParser";
import { GroupJsonInterface } from "⚙️/lib/parsers/types/GroupJson.interface";
import { GroupParser } from "⚙️/lib/parsers/GroupParser";
import { DecoratedObjectType } from "⚙️/examples/extentions/decorators/types/decorated-object.type";
import { DecorationTargetInterface } from "⚙\uFE0F/examples/extentions/decorators/types/decoration-target.interface";

class DecoratorsExtensionFactory implements EngineExtensionInterface {
    DecoratorsExtension = this
    engine !: EngineInterface
    afterCreate(eng: EngineInterface): void {
        this.engine = eng
    }
    get newInstance() {
        return new DecoratorsExtensionFactory()
    }
    CAMERA(cameraJson: (CameraJson | THREE.Camera) & DecoratedObjectType) {
        if(!this.engine) this.logError('Camera')
        return (constructor: Function): void => {
            const camera = Object.assign(CameraParser.parse(this.engine.canvasProportion, cameraJson), constructor)
            if(cameraJson.addByDefault) {
                this.engine.add(camera)
            }
            this.emitInit(constructor, camera)
        }
    }
    MESH(meshJson: (MeshJson | THREE.Mesh) & DecoratedObjectType) {
        return (constructor: Function): void => {
            let mesh: THREE.Mesh
            if (meshJson instanceof THREE.Mesh)
                mesh = Object.assign(meshJson, constructor)
            else
                mesh = Object.assign(MeshParser.parse(meshJson), constructor)

            if(meshJson.addByDefault) {
                if(!this.engine) this.logError('Mesh')
                this.engine.add(mesh)
            }
            this.emitInit(constructor, mesh)
        }
    }
    FROM_FILE(fileJson: PathToMeshJson & DecoratedObjectType) {
        return (constructor: Function): void => {
            MeshParser.parseUrlFileJson(fileJson)
                .then((mesh: THREE.Group) => {
                    if(fileJson.addByDefault) {
                        if(!this.engine) this.logError('Mesh')
                        return this.engine.add(mesh).then(() => mesh)
                    }
                    return mesh
                })
                .then((object: THREE.Group): THREE.Group => {
                    // @ts-ignore
                    this.emitInit(constructor, object, true)
                    return object
                })
        }
    }
    LIGHT(lightJson: (LightJson | THREE.Light) & DecoratedObjectType) {
        return (constructor: Function): void => {
            new Promise<THREE.Light>((resolve) => {
                const light = Object.assign(LightParser.parse(lightJson), constructor)
                if(lightJson.addByDefault) {
                    if(!this.engine) this.logError('Light')
                    this.engine.add(light).then(() => resolve(light))
                } else {
                    resolve(light)
                }
            }).then((light: THREE.Light): THREE.Light => {
                this.emitInit(constructor, light)
                return light
            })
        }
    }
    OBJECT3D(object3dJson: (Object3dJSON | THREE.Object3D) & DecoratedObjectType | undefined) {
        return (constructor: Function): void =>  {
            let object: THREE.Object3D
            if(object3dJson instanceof THREE.Object3D)
                object = Object.assign(object3dJson, constructor)
            else
                object = Object.assign(Object3dParser.setParameters(new THREE.Object3D(), object3dJson), constructor)

            if(object3dJson?.addByDefault) {
                if(!this.engine) this.logError('Object3d')
                this.engine.add(object)
            }
            this.emitInit(constructor, object)
        }
    }
    EMPTY_OBJECT(data: DecoratedObjectType) {
        return (constructor: Function): void => {
            const object = new THREE.Object3D()
            if(data.addByDefault) {
                if(!this.engine) this.logError('EmptyObject')
                this.engine.add(object)
            }
            this.emitInit(constructor, object)
        }
    }

    GROUP(data: GroupJsonInterface & DecoratedObjectType) {
        return (constructor: Function): void => {
            const group = GroupParser.parse(data)
            if(data.addByDefault) {
                if(!this.engine) this.logError('Group')
                this.engine.add(group)
            }
            this.emitInit(constructor, group)
        }
    }

    ASYNC_GROUP(data: GroupJsonInterface & DecoratedObjectType) {
        return (constructor: Function): void => {
            new Promise<THREE.Group>(async (resolve) => {
                const group = await GroupParser.parseAsync(data).then(group => Object.assign(group, constructor))
                if(data.addByDefault) {
                    if(!this.engine) this.logError('Group')
                    this.engine.add(group).then(() => resolve(group))
                } else {
                    resolve(group)
                }
            }).then((group: THREE.Group): THREE.Group => {
                this.emitInit(constructor, group, true)
                return group
            })
        }
    }

    MODEL() {
        return (target: DecorationTargetInterface<THREE.Object3D>['prototype'], propertyKey: string): void => {
            if(!target.__onInitListeners) target.__onInitListeners = []
            target.__onInitListeners.push((object: THREE.Object3D) => {
                target[propertyKey] = object
            })
        }
    }

    private emitInit<T extends THREE.Object3D>(constructor: Function, object: T, asyncLoaded: boolean = false): void {
        constructor = constructor as DecorationTargetInterface<THREE.Object3D>
        constructor.prototype.__asyncLoaded = true
        constructor.prototype.__object = object
        const initListeners = constructor.prototype.__onInitListeners
        if(initListeners && Array.isArray(initListeners)) {
            initListeners.forEach((listener: Function) => {
                if(typeof listener === 'function') listener(object)
            })
        } else {
            constructor.prototype.__onInitListeners = []
        }
        constructor.prototype.onInit?.(object)
    }

    private logError(decoratorName: string): Error {
        throw new Error(`[DecoratorsExtension] -> @${decoratorName} -> engine is not defined, \n
        You have to add DecoratorsExtension to extensions list in engine settings \n
        Example: \n
        <script async type="module" src="./index.ts"></script> \n
        const engine = await Engine.create({ \n
            extensions: [ DecoratorsExtension ] \n
        }) \n
        Or Wait for engine to be created and then call @${decoratorName}() \n`)
    }
}

export const DecoratorsExtension = new DecoratorsExtensionFactory()
export const Camera = DecoratorsExtension.CAMERA.bind(DecoratorsExtension)
export const Mesh = DecoratorsExtension.MESH.bind(DecoratorsExtension)
export const Light = DecoratorsExtension.LIGHT.bind(DecoratorsExtension)
export const Object3d = DecoratorsExtension.OBJECT3D.bind(DecoratorsExtension)
export const EmptyObject = DecoratorsExtension.EMPTY_OBJECT.bind(DecoratorsExtension)
export const Group = DecoratorsExtension.GROUP.bind(DecoratorsExtension)
export const AsyncGroup = DecoratorsExtension.ASYNC_GROUP.bind(DecoratorsExtension)
export const FromFile = DecoratorsExtension.FROM_FILE.bind(DecoratorsExtension)
export const Model = DecoratorsExtension.MODEL.bind(DecoratorsExtension)