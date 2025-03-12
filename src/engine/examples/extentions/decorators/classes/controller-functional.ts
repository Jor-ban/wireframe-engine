import {EngineInterface} from "⚙️/types/Engine.interface";
import {Object3D} from "three";
import {DecorationTargetInterface} from "⚙️/examples/extentions/decorators/types/decoration-target.interface";
import {BehaviorSubject, filter, take} from "rxjs";
import {IProvider} from "⚙️/examples/extentions/decorators/types/provider.interface";

export interface IControllerFunctional {
    onObjectsInit ?: (objects: Object3D[]) => void;
}

// @ts-ignore
export abstract class ControllerFunctional implements IControllerFunctional, IProvider {
    public __onInitListeners__: ((objects: Object3D[]) => void)[]
    public __objects__: Object3D[]
    public __provider__: BehaviorSubject<IProvider>

    public get objects(): Object3D[] {
        return this.__objects__
    }
    public set objects(_ignored: Object3D[]) {}

    public mountSelf(): void {
        if(this.objects?.length && this.__provider__.value) {
            this.__provider__.value.add(...this.objects)
        }
    }

    public unmountSelf(): void {
        if(this.objects?.length && this.__provider__.value) {
            this.__provider__.value.remove(...this.objects)
        }
    }

    public add(...objects: object[]) {
        this.__provider__.pipe(
            filter(p => !!p),
            take(1)
        ).subscribe((provider) => {
            objects.forEach(object => {
                if(object instanceof Object3D) {
                    void provider.add(object)
                    this.objects.push(object)
                } else if('prototype' in object && typeof object.prototype === 'object' && '__onInitListeners' in object.prototype) {
                    object = object as DecorationTargetInterface
                    object.prototype.__onInitListeners.push((object: Object3D) => {
                        provider.add(object)
                        this.objects.push(object)
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
                    const index = this.objects.indexOf(object)
                    if (index > -1) {
                        this.objects.splice(index, 1)
                    }
                } else if ('prototype' in object && typeof object.prototype === 'object' && '__onInitListeners' in object.prototype) {
                    object = object as DecorationTargetInterface
                    object.prototype.__onInitListeners.push((object: Object3D) => {
                        provider.remove(object)
                        const index = this.objects.indexOf(object)
                        if (index > -1) {
                            this.objects.splice(index, 1)
                        }
                    })
                }
            })
        })
    }
}