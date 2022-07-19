import { AmbientLight, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { CanvasProportion } from '../parsers/types/CanvasProportion.interface';

export interface EngineInterface {
	canvasProportion: CanvasProportion
	canvas: HTMLCanvasElement
	renderer: WebGLRenderer
	mainCamera: PerspectiveCamera | OrthographicCamera
	scene: Scene
	ambientLight: AmbientLight
}