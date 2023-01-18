import { AmbientLight, Camera, Scene, WebGLRenderer } from "three";
import { CustomCamera } from "../parsers/types/CustomCamera.interface";
import { CanvasProportion } from "../parsers/types/CanvasProportion.interface";
import { CustomAmbientLight } from "../parsers/types/CustomLight.interface";
import { CustomRenderer } from "../parsers/types/CustomRenderer.interface";
import { CustomScene } from "../parsers/types/CustomScene.interface";
import { CustomLight } from "../parsers/types/CustomLight.interface";
import { CustomMesh } from "../parsers/types/CustomMesh.type";
import { EngineModes } from "./engineModes";
import { CustomOrbitControls } from "../parsers/types/CustomOrbitControls.interface";

export interface ProjectSettings {
    camera ?: Camera | CustomCamera | 'perspectiveCamera' | 'orthographicCamera', // only 2 types of cameras are supported
    scene ?: Scene | CustomScene, // skyBoxes, encoding and loaders are supported
    renderer ?: WebGLRenderer | CustomRenderer, // antialias, physicallyCorrectLights, encoding, toneMapping, toneMappingExposure, shadowMap, shadowMapType, pixelRatio
    ambientLight ?: AmbientLight | CustomAmbientLight, // only 1 main ambient light
    lights ?: CustomLight[], // array of lights
    objects ?: CustomMesh[], // array of objects
    canvasSizes ?: CanvasProportion // canvas sizes on prod and test modes
    orbitControls ?: boolean | CustomOrbitControls // orbit controls
    maxFPS ?: number // max fps <= 0 is no tick ; default is 60; Infinity is for max possible
    mode?: EngineModes | 'dev' | 'test' | 'prod' // loading mode (only for specific cases)
}