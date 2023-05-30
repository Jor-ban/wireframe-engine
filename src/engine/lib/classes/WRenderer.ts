import { RendererParser } from "⚙️/lib/parsers/rendererParser";
import { CanvasProportion } from "⚙️/lib/parsers/types/CanvasProportion.interface";
import { RendererJson } from "⚙️/lib/parsers/types/RendererJson.type";
import { NoToneMapping, PCFSoftShadowMap, sRGBEncoding, WebGLRenderer, WebGLRendererParameters } from "three";
export class WRenderer extends WebGLRenderer {

    // @ts-ignore
    constructor(private readonly options: WebGLRendererParameters) {
        super(options);
    }
    static from(renderer: WebGLRenderer): WRenderer
    static from(canvas: HTMLCanvasElement, sizes?: CanvasProportion, renderer ?: RendererJson): WRenderer
    static from(c: HTMLCanvasElement | WebGLRenderer, sizes?: CanvasProportion, renderer ?: RendererJson): WRenderer {
        if(c instanceof WebGLRenderer) {
            const wRenderer = new WRenderer({
                canvas: c.domElement,
                alpha: true,
                antialias: true,
            })
            wRenderer.physicallyCorrectLights = c.physicallyCorrectLights ?? false
            wRenderer.outputEncoding = c.outputEncoding || sRGBEncoding
            wRenderer.toneMapping = c.toneMapping || NoToneMapping
            wRenderer.toneMappingExposure = c.toneMappingExposure ?? 1
            wRenderer.shadowMap.enabled = c.shadowMap?.enabled ?? false
            wRenderer.shadowMap.type = c.shadowMap?.type || PCFSoftShadowMap
            wRenderer.setPixelRatio(Math.min(window.devicePixelRatio, c.pixelRatio ?? 1))
            return wRenderer
        } else if(!sizes) {
            sizes = {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
        return RendererParser.parse(c, sizes, renderer)
    }
}