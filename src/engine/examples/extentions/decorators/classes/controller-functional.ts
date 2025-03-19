import {Object3D} from "three";
import {DecorationTargetInterface} from "⚙️/examples/extentions/decorators/types/decoration-target.interface";
import {BehaviorSubject, filter, take} from "rxjs";
import {IProvider} from "⚙️/examples/extentions/decorators/types/provider.interface";
import {InputParams} from "tweakpane";

export interface ControllerInit {
    onControllerInit ?: () => void;
}

// @ts-ignore
export abstract class ControllerFunctional implements ControllerInit, IProvider {
    public __onInitListeners__: ((objects: {[key: string | number | symbol]: Object3D}) => void)[] = []
    public __objects__: {[key: string | number | symbol]: Object3D} = {}
    public __controllers__: {[key: string | number | symbol]: ControllerFunctional} = {}
    public __provider__ = new BehaviorSubject<IProvider | null>(null)

    // abstract onObjectsInit(objects: {[key: string | number | symbol]: Object3D}): void;

    public constructor(objs: {[key: string | number | symbol]: Object3D}, clrs: {[key: string | number | symbol]: ControllerFunctional}) {
        this.__objects__ = objs
        this.__controllers__ = clrs
    }

    private get objects(): {[key: string | number | symbol]: Object3D} {
        return this.__objects__
    }
    private set objects(_ignored: {[key: string | number | symbol]: Object3D}) {}

    public mountSelf(): void {
        if(this.__provider__.value) {
            for(let key in this.objects) {
                this.__provider__.value.add(this.objects[key])
            }
        }
    }

    public unmountSelf(): void {
        if(this.__provider__.value) {
            for(let key in this.objects) {
                this.__provider__.value.remove(this.objects[key])
            }
        }
    }

    public addTweak<K extends object>(obj: K, key: keyof K, params: InputParams & {onChangeFn: (value: K[keyof K]) => void}): void {
        this.__provider__.pipe(
            filter(p => !!p),
            take(1),
        ).subscribe((p) => {
            setTimeout(() => {
                p.addTweak(obj, key, params)
            })
        })
    }

    public getObject<T>(cls: new (...args: any[]) => T, ...args: any[]): T {
        for(let key in this.objects) {
            if(this.objects[key] instanceof cls) {
                return this.objects[key] as T
            }
        }
        throw new Error(`Unable to get object ${JSON.stringify(cls)}`)
    }

    public getController<T>(cls: new (...args: any[]) => T, ...args: any[]): T {
        for(let key in this.__controllers__) {
            if(this.__controllers__[key] instanceof cls) {
                return this.__controllers__[key] as T
            }
        }
        throw new Error(`Unable to get controller ${JSON.stringify(cls)}`)
    }

    public add(...objects: object[]) {
        this.__provider__.pipe(
            filter(p => !!p),
            take(1)
        ).subscribe((provider) => {
            objects.forEach(object => {
                if(object instanceof Object3D) {
                    void provider.add(object)
                    this.objects[object.uuid] = object
                } else if('prototype' in object && typeof object.prototype === 'object' && '__onInitListeners' in object.prototype) {
                    object = object as DecorationTargetInterface
                    object['prototype'].__onInitListeners.push((object: Object3D) => {
                        provider.add(object)
                        this.objects[object.uuid] = object
                    })
                }
            })
        })
    }

    public remove(...objects: object[]) {
        this.__provider__.pipe(
            filter(p => !!p),
            take(1)
        ).subscribe((provider) => {
            objects.forEach(object => {
                if (object instanceof Object3D) {
                    provider.remove(object)
                    Object.entries(this.objects).forEach(([key, value]) => {
                        if(value === object) {
                            delete this.objects[key]
                            return
                        }
                    })
                } else if ('prototype' in object && typeof object.prototype === 'object' && '__onInitListeners' in object.prototype) {
                    object = object as DecorationTargetInterface
                    object['prototype'].__onInitListeners.push((object: Object3D) => {
                        provider.remove(object)
                        Object.entries(this.objects).forEach(([key, value]) => {
                            if(value === object) {
                                delete this.objects[key]
                                return
                            }
                        })
                    })
                }
            })
        })
    }
}