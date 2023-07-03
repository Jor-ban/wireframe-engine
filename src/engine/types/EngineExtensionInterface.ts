import { EngineInterface } from "⚙️/types/Engine.interface";
import { ProjectSettings } from "⚙️/types/ProjectSettings.interface";

export type EngineExtensionInterface = {
    beforeCreate?: (projectSettings: ProjectSettings) => void
    afterCreate?: (engine: EngineInterface) => void
    onInit?: (engine: EngineInterface) => void | Promise<EngineInterface>
    beforeDestroy?: (engine: EngineInterface) => void
}