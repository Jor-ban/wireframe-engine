import { AmbientLight, Color, DirectionalLight, HemisphereLight, Light, PointLight, PointLightHelper } from 'three';
import { FolderApi, TabPageApi } from 'tweakpane';

export class LightControls {
	static addLight(light: AmbientLight | PointLight | DirectionalLight | HemisphereLight, folder: TabPageApi | FolderApi) {

	}
	static addAmbientLight(light: AmbientLight, folder: TabPageApi | FolderApi) {
		folder.addInput(light, 'intensity')
		folder.addInput(light, 'visible');
		this.addColor(light, folder);
	}
	static addPointLight(light: PointLight, folder: TabPageApi | FolderApi) {
		new PointLightHelper(light, 1)
		folder.addInput(light, 'intensity')
		folder.addInput(light, 'distance')
		folder.addInput(light, 'decay')
		folder.addInput(light, 'castShadow')
		folder.addInput(light, 'visible');
		this.addColor(light, folder);
	}
	private static addColor(light: Light, folder: TabPageApi | FolderApi) {
		folder.addInput({color: '#' + light.color.getHexString()}, 'color')
			.on('change', ({value}) => {
				light.color.set(new Color(value))
			})
	}
}