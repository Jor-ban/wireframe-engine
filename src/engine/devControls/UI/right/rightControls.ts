import { FolderApi, Pane, TabPageApi } from 'tweakpane';
import { Object3DControls } from './utils/Object3DControls';
import {
	ACESFilmicToneMapping, AmbientLight, AxesHelper,
	CineonToneMapping,
	LinearToneMapping,
	NoToneMapping, OrthographicCamera,
	PerspectiveCamera,
	ReinhardToneMapping, Scene, WebGLRenderer,
} from 'three';
import { debugParams } from '../controller';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import * as CameraKitPlugin from '@tweakpane/plugin-camerakit';
// @ts-ignore
import * as TweakpaneImagePlugin from 'tweakpane-image-plugin';
import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation';
import { CameraControls } from './utils/CameraControls';
import { LightControls } from './utils/LightControls';
import { ActiveElementControls } from './activeElementControls';
import {logMemory} from "../shared/utils/PerformanceMonitors";
import {rightControlsWidth, topBarHeight} from "../../shared/consts/controlsStyles";
import {EngineInterface} from "../../types/Engine.interface";
import {SkyboxControls} from "./utils/SkyboxControls";

export class RightControls {
	private rightPane !: Pane
	public objectTab !: TabPageApi
	protected sceneTab !: TabPageApi
	protected statsTab !: TabPageApi
	private renderer: WebGLRenderer
	private readonly axesHelper: AxesHelper
	private camera: PerspectiveCamera | OrthographicCamera
	private readonly scene: Scene
	constructor({scene, renderer, mainCamera, ambientLight}: EngineInterface) {
		this.scene = scene
		this.renderer = renderer
		this.camera = mainCamera
		this.setUpPane()
		this.axesHelper = new AxesHelper( 5 );
		this.scene.add(this.axesHelper)
		this.addScene(this.sceneTab)
		const mainCameraFolder = Object3DControls.createFolder('Main Camera', this.sceneTab)
		CameraControls.addForCamera(mainCamera, mainCameraFolder)
		const ambientLightFolder = Object3DControls.createFolder('Ambient Light', this.sceneTab)
		LightControls.addLight(ambientLight, ambientLightFolder)
		new ActiveElementControls(this.scene, this.objectTab)
		logMemory(this.statsTab, this.renderer)
	}

	private setUpPane() {
		const container = document.createElement('div')
		container.classList.add('__wireframe-right-controls', '__wireframe-controls')
		container.style.width = rightControlsWidth + 'px'
		container.style.top = topBarHeight + 'px'
		container.style.height = `calc(100vh - ${topBarHeight}px)`
		document.body.appendChild(container)
		this.rightPane = new Pane({
			title: 'Wireframe Engine Gui',
			container,
		});
		this.rightPane.registerPlugin(EssentialsPlugin);
		this.rightPane.registerPlugin(RotationPlugin);
		this.rightPane.registerPlugin(CameraKitPlugin);
		this.rightPane.registerPlugin(TweakpaneImagePlugin)
		const folders = this.rightPane.addTab({
			pages: [
				{title: 'Element'},
				{title: 'Scene'},
				{title: 'Monitors'},
			]
		})
		this.objectTab = folders.pages[0]
		this.sceneTab = folders.pages[1]
		this.statsTab = folders.pages[2]

	}
	private addScene(pane: FolderApi | TabPageApi) : void {
		pane.addInput(debugParams, 'axesHelperLength', {min: 0, max: 20})
			.on('change', ({value}) => {
				this.axesHelper.scale.set(value, value, value)
			});
		// env map
		pane.addInput(debugParams, 'envMapIntensity', {min: 0, max: 10, step: 0.01})
			.on('change', ({value}) => {
				debugParams.envMapIntensity = value
				Object3DControls.updateAllMaterials(this.scene)
			})
		// tone mapping
		pane.addInput({toneMapping: 0}, 'toneMapping', {
			options: {
				None: NoToneMapping,
				Linear: LinearToneMapping,
				Reinhard: ReinhardToneMapping,
				Uncharted2: ReinhardToneMapping,
				Cineon: CineonToneMapping,
				ACESFilmic: ACESFilmicToneMapping,
			}
		}).on('change', ({value}) => {
			this.renderer.toneMapping = Number(value)
			Object3DControls.updateAllMaterials(this.scene)
		})
		pane.addInput({ shadowMap: this.renderer.shadowMap.enabled }, 'shadowMap')
		new SkyboxControls(pane, this.scene, this.renderer)
	}
}