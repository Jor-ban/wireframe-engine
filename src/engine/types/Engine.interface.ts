import { WRenderer } from '⚙️/lib';
import { AmbientLight, Camera, Object3D, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { CanvasProportion } from '⚙️/lib/parsers/types/CanvasProportion.interface';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EngineExtensionInterface } from "⚙️/types/EngineExtensionInterface";
import { RendererJson } from "⚙️/lib/parsers/types/RendererJson.type";
import { AmbientLightJson, LightJson } from "⚙️/lib/parsers/types/LightJson.type";
import { SceneJson } from "⚙️/lib/parsers/types/SceneJson.type";
import { MeshJson } from "⚙️/lib/parsers/types/MeshJson.type";
import { CameraJson } from "⚙️/lib/parsers/types/CameraJson.type";

export interface EngineInterface {
	canvasProportion: CanvasProportion
	canvas: HTMLCanvasElement
	renderer: WRenderer | RendererJson
	camera: PerspectiveCamera | OrthographicCamera
	scene: Scene
	mode: 'dev' | 'prod' | 'test'
	ambientLight: AmbientLight
	orbitControls: OrbitControls | undefined
	extensionsList: EngineExtensionInterface[]

	dispose(): void
	add(...objects: (Object3D | MeshJson | LightJson)[]): Promise<EngineInterface>
	use(extension: EngineExtensionInterface): EngineInterface
	setCanvasSizes(canvasSizes?: CanvasProportion): EngineInterface
	setAmbientLight(ambientLight ?: AmbientLight | AmbientLightJson): EngineInterface
	setRenderer(renderer?: WebGLRenderer | RendererJson): EngineInterface
	setScene(scene ?: Scene | SceneJson): EngineInterface
	setCamera(camera?: Camera | CameraJson | 'perspectiveCamera' | 'orthographicCamera' | undefined): EngineInterface
	setProperty<T>(property: string, value: T): EngineInterface
	getProperty<T>(property: string): T
}
