import { AmbientLight, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { CanvasProportion } from '../parsers/types/CanvasProportion.interface';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export interface EngineInterface {
	canvasProportion: CanvasProportion
	canvas: HTMLCanvasElement
	renderer: WebGLRenderer
	mainCamera: PerspectiveCamera | OrthographicCamera
	scene: Scene
	ambientLight: AmbientLight
	orbitControls: OrbitControls | undefined
}