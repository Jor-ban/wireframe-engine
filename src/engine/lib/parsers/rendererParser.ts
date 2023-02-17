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
        const webglRenderer = new WRenderer({
            canvas,
            antialias: renderer.antialias,
            alpha: renderer.alpha
        })
        webglRenderer.setSize(sizes.width, sizes.height, sizes.updateStyle)
        webglRenderer.physicallyCorrectLights = renderer.physicallyCorrectLights ?? false
        webglRenderer.outputEncoding = renderer.encoding || sRGBEncoding
        webglRenderer.toneMapping = renderer.toneMapping || NoToneMapping
        webglRenderer.toneMappingExposure = renderer.toneMappingExposure ?? 1
        webglRenderer.shadowMap.enabled = renderer.shadowMap ?? false
        webglRenderer.shadowMap.type = renderer.shadowMapType || PCFSoftShadowMap
        webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, renderer.pixelRatio ?? 1))
        return webglRenderer
    }
}