import {OrbitControlsJson} from "⚙️/lib/parsers/types/OrbitControlsJson.type";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Camera} from "three";

export class OrbitControlsParser {
    public static parse(orbitControlsData: OrbitControlsJson | boolean, camera: Camera, canvas: HTMLCanvasElement): OrbitControls {
        const orbitControls = new OrbitControls(camera, canvas)
        if(typeof orbitControlsData === 'object') {
            orbitControls.enableDamping = orbitControlsData.damping ?? true
            orbitControls.enablePan = orbitControlsData.panning ?? true
            orbitControls.enableZoom = orbitControlsData.zoom ?? true
            orbitControls.enableRotate = orbitControlsData.rotate ?? true
        } else {
            orbitControls.enableDamping = true
            orbitControls.enablePan = true
            orbitControls.enableZoom = true
            orbitControls.enableRotate = true
        }
        return orbitControls
    }
}