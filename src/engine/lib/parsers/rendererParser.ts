import { WRenderer } from '../classes/WRenderer';
import {NoToneMapping, PCFSoftShadowMap} from "three";
import {RendererJson} from "./types/RendererJson.type";
import {CanvasProportion} from "./types/CanvasProportion.interface";

export class RendererParser {
    static parse(canvas: HTMLCanvasElement, sizes: CanvasProportion, renderer ?: RendererJson): WRenderer {
        renderer = renderer || {}
        const wRenderer = new WRenderer({
            canvas,
            antialias: renderer.antialias,
            alpha: renderer.alpha
        })
        wRenderer.setSize(sizes.width, sizes.height, sizes.updateStyle)
        wRenderer.toneMapping = renderer.toneMapping || NoToneMapping
        wRenderer.toneMappingExposure = renderer.toneMappingExposure ?? 1
        wRenderer.shadowMap.enabled = renderer.shadowMap ?? false
        wRenderer.shadowMap.type = renderer.shadowMapType || PCFSoftShadowMap
        wRenderer.setPixelRatio(Math.min(window.devicePixelRatio, renderer.pixelRatio ?? 1))
        return wRenderer
    }
}