import { WRenderer } from '../lib/classes/WRenderer';
import { AmbientLight, OrthographicCamera, PerspectiveCamera, Scene } from 'three';
import { CanvasProportion } from '../lib/parsers/types/CanvasProportion.interface';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export interface EngineInterface {
	canvasProportion: CanvasProportion
	canvas: HTMLCanvasElement
	renderer: WRenderer
	camera: PerspectiveCamera | OrthographicCamera
	scene: Scene
	mode: 'dev' | 'prod' | 'test'
	ambientLight: AmbientLight
	orbitControls: OrbitControls | undefined

	dispose(): void
	add(): Promise<EngineInterface>
}
