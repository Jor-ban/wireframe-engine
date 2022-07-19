import { AmbientLight, Camera, Scene, WebGLRenderer } from "three";
import { CustomCamera } from "../parsers/types/CustomCamera.interface";
import { CanvasProportion } from "../parsers/types/CanvasProportion.interface";
import { CustomAmbientLight } from "../parsers/types/CustomLight.interface";
import { CustomRenderer } from "../parsers/types/CustomRenderer.interface";
import { CustomScene } from "../parsers/types/CustomScene.interface";
import { CustomLight } from "../parsers/types/CustomLight.interface";
import { CustomMesh } from "../parsers/types/CustomMesh.type";

export interface ProjectSettings {
    camera ?: Camera | CustomCamera | 'perspectiveCamera' | 'orthographicCamera', // DONE
    scene ?: Scene | CustomScene, // DONE
    renderer ?: WebGLRenderer | CustomRenderer, // DONE
    ambientLight ?: AmbientLight | CustomAmbientLight, // DONE
    lights ?: CustomLight[], //
    objects ?: CustomMesh[], //
    canvasSizes ?: CanvasProportion // DONE
    orbitControls ?: boolean
    debug ?: boolean
    disableTick ?: boolean
    renderOnMaxFPS ?: boolean
    disableResizeUpdate ?: boolean
}