import { RendererParser } from "⚙️/lib/parsers/rendererParser";
import { CanvasProportion } from "⚙️/lib/parsers/types/CanvasProportion.interface";
import { RendererJson } from "⚙️/lib/parsers/types/RendererJson.type";
import { WebGLRenderer, WebGLRendererParameters } from "three";

export class WRenderer extends WebGLRenderer {

    constructor(options: WebGLRendererParameters) {
        super(options);
    }
    static from(renderer: WRenderer): WRenderer
    static from(canvas: HTMLCanvasElement, sizes?: CanvasProportion, renderer ?: RendererJson): WRenderer
    static from(c: HTMLCanvasElement | WRenderer, sizes?: CanvasProportion, renderer ?: RendererJson): WRenderer {
        if(c instanceof WRenderer) {
            return c
        } else if(!sizes) {
            sizes = {
                width: window.innerWidth,
                height: window.innerHeight
            }
        }
        return RendererParser.parse(c, sizes, renderer)
    }
    toJson() {
        return {}
    }
}