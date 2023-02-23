import { WRenderer } from '../classes/WRenderer';
import {NoToneMapping, PCFSoftShadowMap, sRGBEncoding} from "three";
import {RendererJson} from "./types/RendererJson.type";
import {CanvasProportion} from "./types/CanvasProportion.interface";

export class RendererParser {
    static parse(canvas: HTMLCanvasElement, sizes: CanvasProportion, renderer ?: WRenderer | RendererJson): WRenderer {
        if(renderer instanceof WRenderer) {
            return renderer
        }
        renderer = renderer || {}
        const wRenderer = new WRenderer({
            canvas,
            antialias: renderer.antialias,
            alpha: renderer.alpha
        })
        wRenderer.setSize(sizes.width, sizes.height, sizes.updateStyle)
        wRenderer.physicallyCorrectLights = renderer.physicallyCorrectLights ?? false
        wRenderer.outputEncoding = renderer.encoding || sRGBEncoding
        wRenderer.toneMapping = renderer.toneMapping || NoToneMapping
        wRenderer.toneMappingExposure = renderer.toneMappingExposure ?? 1
        wRenderer.shadowMap.enabled = renderer.shadowMap ?? false
        wRenderer.shadowMap.type = renderer.shadowMapType || PCFSoftShadowMap
        wRenderer.setPixelRatio(Math.min(window.devicePixelRatio, renderer.pixelRatio ?? 1))
        return wRenderer
    }
}