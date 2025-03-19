import {EnginePluginInterface} from "⚙\uFE0F/types/EnginePluginInterface";
import {EngineInterface} from "⚙️/types/Engine.interface";
import {CameraJson} from "⚙️/lib/parsers/types/CameraJson.type";
import {CameraParser} from "⚙️/lib/parsers/cameraParser";
import {MeshParser} from "⚙️/lib/parsers/MeshParser";
import {MeshJson, PathToMeshJson} from "⚙️/lib/parsers/types/MeshJson.type";
import {LightJson} from "⚙️/lib/parsers/types/LightJson.type";
import {Object3dParser} from "⚙️/lib/parsers/Object3dParser";
import * as THREE from "three";
import {Object3dJSON} from "⚙️/lib/parsers/types/Object3DJson.type";
import {LightParser} from "⚙️/lib/parsers/lightParser";
import {GroupJsonInterface} from "⚙️/lib/parsers/types/GroupJson.interface";
import {GroupParser} from "⚙️/lib/parsers/GroupParser";
import {DecoratedObjectType} from "./types/decorated-object.type";
import {DecorationTargetInterface} from "⚙️/examples/extentions/decorators/types/decoration-target.interface";
import {ExtrudeFromSvgJson} from "⚙️/lib/parsers/types/ExtrudeFromSvgJson.type";
import {ExtrudeFromSvgParser} from "⚙️/lib/parsers/ExtrudeFromSvg";
import {ProjectSettings} from "⚙️/types/ProjectSettings.interface";
import {ControllerFunctional} from "⚙️/examples/extentions/decorators/classes/controller-functional";
import {ControllerParamsInterface} from "⚙️/examples/extentions/decorators/types/controller-params.interface";
import {BehaviorSubject, combineLatest, filter, Observable, of, Subject, take} from "rxjs";

class DecoratorsExtensionFactory implements EnginePluginInterface {
    engine !: EngineInterface
    controllers: { [key: string | number | symbol]: Observable<ControllerFunctional> } = {}
    private controllerClassToInstanceMap = new WeakMap<Function, Observable<ControllerFunctional | null>>()
    private decoratorClassToInstanceMap = new WeakMap<Function, Observable<DecorationTargetInterface['prototype']>>()

    beforeCreate(settings: ProjectSettings): void {
        if(settings['controllers']) {
            this.controllers = {}
            // TODO, mount controllers too
            for(let key of Object.keys(settings['controllers'])) {
                this.controllers[key] = this.controllerClassToInstanceMap.get(settings['controllers'][key])
                    .pipe(
                        filter(c => !!c)
                    )
            }
        }
    }
    afterCreate(eng: EngineInterface): void {
        this.engine = eng
        combineLatest(this.controllers).pipe(take(1)).subscribe((controllersObj) => {
            Object.values(controllersObj).forEach(controller => {
                controller.__provider__.next(eng)
            })
        })
    }
    getNewInstance() {
        return new DecoratorsExtensionFactory()
    }
    CAMERA(cameraJson: (CameraJson | THREE.Camera) & DecoratedObjectType) {
        if(!this.engine) this.logError('Camera')
        return (constructor: Function): void => {
            this.createSubjectInMapFor(constructor)
            const camera = Object.assign(CameraParser.parse(this.engine.canvasProportion, cameraJson), constructor)
            if(cameraJson.addByDefault) {
                this.engine.add(camera)
            }
            this.emitInit(constructor, camera)
        }
    }
    MESH(meshJson: (MeshJson | THREE.Mesh) & DecoratedObjectType) {
        return (constructor: Function): void => {
            this.createSubjectInMapFor(constructor)
            this.setName(constructor, meshJson)
            let mesh: THREE.Mesh
            if (meshJson instanceof THREE.Mesh)
                mesh = Object.assign(meshJson, constructor)
            else
                mesh = Object.assign(MeshParser.parse(meshJson), constructor)

            if(meshJson.addByDefault) {
                if(!this.engine) this.logError('Mesh')
                void this.engine.add(mesh)
            }
            this.emitInit(constructor, mesh)
        }
    }
    FROM_FILE(fileJson: PathToMeshJson & DecoratedObjectType) {
        return (constructor: Function): void => {
            this.createSubjectInMapFor(constructor)
            MeshParser.parseUrlFileJson(fileJson)
                .then((mesh: THREE.Group) => {
                    if(fileJson.addByDefault) {
                        if(!this.engine) this.logError('Mesh')
                        return this.engine.add(mesh).then(() => mesh)
                    }
                    return mesh
                })
                .then((object: THREE.Group): THREE.Group => {
                    this.emitInit(constructor, object, true)
                    return object
                })
        }
    }
    LIGHT(lightJson: (LightJson | THREE.Light) & DecoratedObjectType) {
        return (constructor: Function): void => {
            this.createSubjectInMapFor(constructor)
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
            this.createSubjectInMapFor(constructor)
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
            this.createSubjectInMapFor(constructor)
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
            this.createSubjectInMapFor(constructor)
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
            this.createSubjectInMapFor(constructor)
            new Promise<THREE.Group>(async (resolve) => {
                const group = await GroupParser.parseAsync(data).then(group => Object.assign(group, constructor))
                if(data.addByDefault) {
                    if(!this.engine) this.logError('AsyncGroup')
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

    EXTRUDE_FROM_SVG(data: ExtrudeFromSvgJson & DecoratedObjectType) {
        return (constructor: Function): void => {
            this.createSubjectInMapFor(constructor)
            ExtrudeFromSvgParser.parse(data).then((extrudeMesh: THREE.Group) => {
                if(data.addByDefault) {
                    if(!this.engine) this.logError('ExtrudeFromSvg')
                    this.engine.add(extrudeMesh)
                }
                this.emitInit(constructor, extrudeMesh)
            })
        }
    }

    MODEL() {
        return (constructor: DecorationTargetInterface<THREE.Object3D>['prototype'], propertyKey: string): void => {
            const instance = this.decoratorClassToInstanceMap.get(constructor) ??
                Reflect.construct(constructor, []) as DecorationTargetInterface<THREE.Object3D>['prototype']
            (this.decoratorClassToInstanceMap.get(constructor) as Subject<DecorationTargetInterface<THREE.Object3D>['prototype']>).next(instance)
            if(!instance.__onInitListeners) instance.__onInitListeners = []
            instance.__onInitListeners.push((object: THREE.Object3D) => {
                instance[propertyKey] = object
            })
        }
    }

    CONTROLLER(params: ControllerParamsInterface) {
        return (constructor: Function): void => {
            Object.getOwnPropertyNames(ControllerFunctional.prototype).forEach(name => {
                if (name !== 'constructor') {
                    constructor.prototype[name] = ControllerFunctional.prototype[name];
                }
            });

            const bs = new BehaviorSubject<ControllerFunctional | null>(null)
            const objects$: { [key: string | number | symbol]: Observable<THREE.Object3D> } = {}
            this.controllerClassToInstanceMap.set(constructor, bs)

            for(let key in (params?.objects)) {
                const object = params.objects[key]
                if(object instanceof THREE.Object3D) {
                    objects$[key] = of(object)
                } else {
                    objects$[key] = this.decoratorClassToInstanceMap.get(object)
                }
            }

            const subControllers$: { [key: string | number | symbol]: Observable<ControllerFunctional> } = {}
            for(let key in params?.controllers) {
                subControllers$[key] = this.controllerClassToInstanceMap.get(params.controllers[key]).pipe(
                    filter(c => !!c)
                )
            }

            combineLatest({
                objects: Object.values(params?.objects ?? {}).length ? combineLatest(objects$) : of({}),
                controllers: Object.values(params?.controllers ?? {}).length ? combineLatest(subControllers$) : of({}),
            }).pipe(
                take(1),
            ).subscribe(({ objects, controllers }) => {
                const object3ds = {}
                for(let key in objects) {
                    object3ds[key] = objects[key]['__object']
                }

                const instance = Reflect.construct(constructor, [objects, controllers]) as ControllerFunctional
                instance.__objects__ = object3ds
                instance.__controllers__ = controllers
                instance.__provider__.pipe(
                    filter(p => !!p),
                    take(1),
                ).subscribe(provider => {
                    for(let key in controllers) {
                        controllers[key]['__provider__'].next(instance)
                    }

                    instance['onControllerInit']?.()
                    if (params?.autoMount) {
                        instance.mountSelf()
                    }
                })

                bs.next(instance)
            })
        }
    }

    private emitInit<T extends THREE.Object3D>(constructor: Function, object: T, asyncLoaded: boolean = false): void {
        const instance = Reflect.construct(constructor, [object]) as DecorationTargetInterface<THREE.Object3D>['prototype']
        (this.decoratorClassToInstanceMap.get(constructor) as Subject<DecorationTargetInterface<THREE.Object3D>['prototype']>).next(instance)
        instance.__asyncLoaded = asyncLoaded
        instance.__object = object
        object.name = object.name ?? instance.name
        const initListeners = instance.__onInitListeners
        if(initListeners && Array.isArray(initListeners)) {
            initListeners.forEach((listener: Function) => {
                if(typeof listener === 'function') listener(object)
            })
        } else {
            instance.__onInitListeners = []
        }
        instance.onInit?.(instance.__object)
    }
    private setName(constructor: Function, options: { name?: string }) {
        options.name = options.name ?? constructor.name ?? constructor.prototype.constructor.name
    }

    private createSubjectInMapFor(constructor: Function): void {
        this.decoratorClassToInstanceMap.set(constructor, new BehaviorSubject<DecorationTargetInterface['prototype'] | null>(null))
    }

    private logError(decoratorName: string): Error {
        throw new Error(`[DecoratorsExtension] -> @${decoratorName} -> engine is not defined, \n
        You have to add DecoratorsExtension to extensions list in engine settings \n
        Example: \n
        const engine = Engine.create({ \n
            extensions: [ DecoratorsExtension ] \n
        }) \n
        Or Wait for engine to be created and then call @${decoratorName}() \n`)
    }
}

export const DecoratorsExtension = new DecoratorsExtensionFactory()
export const WeCamera = DecoratorsExtension.CAMERA.bind(DecoratorsExtension)
export const WeMesh = DecoratorsExtension.MESH.bind(DecoratorsExtension)
export const WeLight = DecoratorsExtension.LIGHT.bind(DecoratorsExtension)
export const WeObject3d = DecoratorsExtension.OBJECT3D.bind(DecoratorsExtension)
export const WeEmptyObject = DecoratorsExtension.EMPTY_OBJECT.bind(DecoratorsExtension)
export const WeGroup = DecoratorsExtension.GROUP.bind(DecoratorsExtension)
export const WeAsyncGroup = DecoratorsExtension.ASYNC_GROUP.bind(DecoratorsExtension)
export const WeFromFile = DecoratorsExtension.FROM_FILE.bind(DecoratorsExtension)
export const WeModel = DecoratorsExtension.MODEL.bind(DecoratorsExtension)
export const WeController = DecoratorsExtension.CONTROLLER.bind(DecoratorsExtension)
export const WeExtrudeFromSvg = DecoratorsExtension.EXTRUDE_FROM_SVG.bind(DecoratorsExtension)