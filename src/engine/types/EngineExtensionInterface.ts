import { EngineInterface } from "⚙️/types/Engine.interface";

export type EngineExtensionInterface = (engine: EngineInterface) => Promise<EngineInterface | void>