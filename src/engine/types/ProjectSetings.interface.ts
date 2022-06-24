import { AmbientLight, Camera, Scene, WebGLRenderer } from "three";
import { CustomCamera } from "./CustomCamera.interface";
import { CanvasProportion } from "./CanvasProportion.interface";
import { CustomAmbientLight } from "./CustomLight.interface";
import { CustomRenderer } from "./CustomRenderer.interface";
import { CustomScene } from "./CustomScene.interface";
import { CustomLight } from "./CustomLight.interface";
import { CustomMesh } from "./CustomMesh.type";

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