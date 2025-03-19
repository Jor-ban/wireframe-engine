import { WRenderer } from '⚙️/lib';
import { AmbientLight, Camera, Object3D, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { CanvasProportion } from '⚙️/lib/parsers/types/CanvasProportion.interface';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EnginePluginInterface } from "⚙\uFE0F/types/EnginePluginInterface";
import { RendererJson } from "⚙️/lib/parsers/types/RendererJson.type";
import { AmbientLightJson, LightJson } from "⚙️/lib/parsers/types/LightJson.type";
import { SceneJson } from "⚙️/lib/parsers/types/SceneJson.type";
import { MeshJson } from "⚙️/lib/parsers/types/MeshJson.type";
import { CameraJson } from "⚙️/lib/parsers/types/CameraJson.type";
import { ParsingManager } from "⚙️/lib/parsers/ParsingManager";

export interface EngineInterface {
	canvasProportion: CanvasProportion
	canvas: HTMLCanvasElement
	renderer: WRenderer | RendererJson
	camera: PerspectiveCamera | OrthographicCamera
	scene: Scene
	mode: 'dev' | 'prod' | 'test'
	ambientLight: AmbientLight
	orbitControls: OrbitControls | undefined
	extensionsList: EnginePluginInterface[]
	parsingManager: ParsingManager

	dispose(): void
	add(...objects: (Object3D | MeshJson | LightJson)[]): Promise<EngineInterface>
	remove(...objects: Object3D[]): EngineInterface
	use(extension: EnginePluginInterface): EngineInterface
	setCanvasSizes(canvasSizes?: CanvasProportion): EngineInterface
	setAmbientLight(ambientLight ?: AmbientLight | AmbientLightJson): EngineInterface
	setRenderer(renderer?: WebGLRenderer | RendererJson): EngineInterface
	setScene(scene ?: Scene | SceneJson): EngineInterface
	setCamera(camera?: Camera | CameraJson | 'perspectiveCamera' | 'orthographicCamera' | undefined): EngineInterface
	setProperty<T>(property: string, value: T): EngineInterface
	getProperty<T>(property: string): T
	addTweak<K extends object>(obj: K, key: keyof K, onChangeFn ?: (value: K[keyof K]) => void): void
}
