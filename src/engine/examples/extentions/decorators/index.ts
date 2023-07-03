import { EngineExtensionInterface } from "⚙️/types/EngineExtensionInterface";
import { EngineInterface } from "⚙️/types/Engine.interface";
import { CameraJson } from "⚙️/lib/parsers/types/CameraJson.type";
import { CameraParser } from "⚙️/lib/parsers/cameraParser";

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
    camera(cameraJson: CameraJson) {
        if(!this.engine) logError('Camera')
        return (constructor: Function) => {
            return Object.assign(CameraParser.parse(this.engine.canvasProportion, cameraJson), constructor.prototype)
        }
    }
    mesh() {
        if(!this.engine) logError('Mesh')
        return (constructor: Function) =>  {
            console.log(constructor);
        }
    }
}

export const DecoratorsExtension = new DecoratorsExtensionFactory()
export const Camera = DecoratorsExtension.camera.bind(DecoratorsExtension)
