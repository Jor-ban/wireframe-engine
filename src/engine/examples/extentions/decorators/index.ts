import { EngineExtensionInterface } from "⚙️/types/EngineExtensionInterface";
import { EngineInterface } from "⚙️/types/Engine.interface";
import { CameraJson } from "⚙️/lib/parsers/types/CameraJson.type";
import { CameraParser } from "⚙️/lib/parsers/cameraParser";
import { MeshParser } from "⚙️/lib/parsers/MeshParser";
import { MeshJson } from "⚙️/lib/parsers/types/MeshJson.type";
import { LightJson } from "⚙️/lib/parsers/types/LightJson.type";
import { Object3dParser } from "⚙️/lib/parsers/Object3dParser";
import * as THREE from "three";
import { Object3dJSON } from "⚙️/lib/parsers/types/Object3DJson.type";
import { LightParser } from "⚙️/lib/parsers/lightParser";

function logError(decoratorName: string) {
    throw new Error(`[DecoratorsExtension] -> @${decoratorName} -> engine is not defined, \n
        You have to add DecoratorsExtension to extensions list in engine settings \n
        Example: \n
        <script async type="module" src="./index.ts"></script> \n
        const engine = await Engine.create({ \n
            extensions: [ DecoratorsExtension ] \n
        }) \n
        Or Wait for engine to be created and then call @${decoratorName}() \n`)
}

class DecoratorsExtensionFactory implements EngineExtensionInterface {
    DecoratorsExtension = this
    engine!: EngineInterface
    afterCreate(eng: EngineInterface): void {
        this.engine = eng
    }
    get newInstance() {
        return new DecoratorsExtensionFactory()
    }
    camera(cameraJson: CameraJson | THREE.Camera) {
        if(!this.engine) logError('Camera')
        return (constructor: Function) => {
            return Object.assign(CameraParser.parse(this.engine.canvasProportion, cameraJson), constructor.prototype)
        }
    }
    mesh(meshJson: MeshJson | THREE.Mesh) {
        return (constructor: Function) =>  {
            if(meshJson instanceof THREE.Mesh)
                return Object.assign(meshJson, constructor.prototype)

            return Object.assign(MeshParser.parse(meshJson), constructor.prototype)
        }
    }
    light(lightJson: LightJson | THREE.Light) {
        return (constructor: Function) =>  {
            return Object.assign(LightParser.parse(lightJson), constructor.prototype)
        }
    }
    object3d(object3dJson: Object3dJSON | THREE.Object3D | undefined) {
        return (constructor: Function) =>  {
            if(object3dJson instanceof THREE.Object3D)
                return Object.assign(object3dJson, constructor.prototype)

            return Object.assign(Object3dParser.setParameters(new THREE.Object3D(), object3dJson), constructor.prototype)
        }
    }
    emptyObject(data: any) {
        return Object3dParser.setParameters(new THREE.Object3D(), data)
    }
}

export const DecoratorsExtension = new DecoratorsExtensionFactory()
export const Camera = DecoratorsExtension.camera.bind(DecoratorsExtension)
export const Mesh = DecoratorsExtension.mesh
export const Light = DecoratorsExtension.light
export const Object3d = DecoratorsExtension.object3d
export const EmptyObject = DecoratorsExtension.emptyObject