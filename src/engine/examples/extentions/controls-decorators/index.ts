import {EngineExtensionInterface} from "⚙️/types/EngineExtensionInterface";
import {EngineInterface} from "⚙️/types/Engine.interface";

class ControlsDecoratorsFactory implements EngineExtensionInterface {
    engine: EngineInterface | null = null
    onInit(eng: EngineInterface) {

    }
}

export const ControlsDecorators = new ControlsDecoratorsFactory()