import {Color, Light} from "three";
import {FolderApi, Pane, TabPageApi} from "tweakpane";

export class LightControls {
    static addLight(light: Light, pane: Pane | TabPageApi | FolderApi): void {
        pane.addInput(light, 'intensity', {min: 0, max: light.intensity + 10})
        pane.addInput(light, 'visible')
        pane.addInput(light, 'castShadow')
        pane.addInput({color: '#' + light.color.getHexString()}, 'color').on('change', ({value}) => {
            light.color = new Color(value)
        })
    }
}