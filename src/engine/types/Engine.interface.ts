import { WRenderer } from '⚙️/lib';
import { AmbientLight, OrthographicCamera, PerspectiveCamera, Scene } from 'three';
import { CanvasProportion } from '⚙️/lib/parsers/types/CanvasProportion.interface';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EngineExtensionInterface } from "⚙️/types/EngineExtensionInterface";
import { RendererJson } from "⚙️/lib/parsers/types/RendererJson.type";

export interface EngineInterface {
	canvasProportion: CanvasProportion
	canvas: HTMLCanvasElement
	renderer: WRenderer | RendererJson
	camera: PerspectiveCamera | OrthographicCamera
	scene: Scene
	mode: 'dev' | 'prod' | 'test'
	ambientLight: AmbientLight
	orbitControls: OrbitControls | undefined

	dispose(): void
	add(): Promise<EngineInterface>
	use(extension: EngineExtensionInterface): EngineInterface
}
