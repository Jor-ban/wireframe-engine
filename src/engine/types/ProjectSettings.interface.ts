import { AmbientLight, Camera, Light, Object3D, Scene, WebGLRenderer } from "three";
import { CameraJson } from "../parsers/types/CameraJson.type";
import { CanvasProportion } from "../parsers/types/CanvasProportion.interface";
import { AmbientLightJson } from "../parsers/types/LightJson.type";
import { RendererJson } from "../parsers/types/RendererJson.type";
import { SceneJson } from "../parsers/types/SceneJson.type";
import { LightJson } from "../parsers/types/LightJson.type";
import { MeshJson } from "../parsers/types/MeshJson.type";
import { EngineModes } from "./engineModes";
import { OrbitControlsJson } from "../parsers/types/OrbitControlsJson.type";

export interface ProjectSettings {
    camera ?: Camera | CameraJson | 'perspectiveCamera' | 'orthographicCamera', // only 2 types of cameras are supported
    scene ?: Scene | SceneJson, // skyBoxes, encoding and loaders are supported
    renderer ?: WebGLRenderer | RendererJson, // antialias, physicallyCorrectLights, encoding, toneMapping, toneMappingExposure, shadowMap, shadowMapType, pixelRatio
    ambientLight ?: AmbientLight | AmbientLightJson, // only 1 main ambient light
    lights ?: (Light | LightJson)[], // array of lights
    objects ?: (Object3D | MeshJson)[], // array of objects
    canvasSizes ?: CanvasProportion // canvas sizes on prod and test modes
    orbitControls ?: boolean | OrbitControlsJson // orbit controls
    maxFPS ?: number // max fps <= 0 is no tick ; default is 60; Infinity is for max possible
    mode?: EngineModes | 'dev' | 'test' | 'prod' // loading mode (only for specific cases)
}