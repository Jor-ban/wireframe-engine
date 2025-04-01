import {Color, Light} from "three";
import {FolderApi, Pane, TabPageApi} from "tweakpane";

export class LightControls {
    static addLight(light: Light, pane: Pane | TabPageApi | FolderApi): void {
        pane.addBinding(light, 'intensity', {min: 0, max: light.intensity + 10})
        pane.addBinding(light, 'visible')
        pane.addBinding(light, 'castShadow')
        pane.addBinding({color: '#' + light.color.getHexString()}, 'color').on('change', ({value}) => {
            light.color = new Color(value)
        })
    }
}