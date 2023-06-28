import { EngineInterface } from "⚙️/types/Engine.interface";

export async function CannonEsExtension(eng: EngineInterface): Promise<EngineInterface> {
    console.log(eng.mode)
    return eng
}