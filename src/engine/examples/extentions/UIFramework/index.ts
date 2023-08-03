import { EngineExtensionInterface } from "⚙️/types/EngineExtensionInterface";
import { EngineInterface } from "⚙️/types/Engine.interface";
import { debounceTime, fromEvent } from "rxjs";
import { UiFrameworkSettingsInterface } from "⚙️/examples/extentions/UIFramework/types/ui-framework-settings.interface";

class UIFrameworkFactory implements EngineExtensionInterface {
    public htmlElement: HTMLElement
    private settings: UiFrameworkSettingsInterface | null = null
    private domParser: DOMParser = new DOMParser()
    onInit(engine: EngineInterface): void {
        if(engine.mode === 'dev')
            return

        if(this.settings?.htmlElement) {
            this.htmlElement = this.settings.htmlElement
        } else {
            this.htmlElement = document.createElement('__U_I_framework_container__')
            document.body.appendChild(this.htmlElement)
        }
        this.htmlElement.style.position = 'absolute'
        this.htmlElement.style.zIndex = '666'
        this.htmlElement.style.display = 'block'
        const canvas = engine.canvas
        if(this.settings?.enableResizeReaction !== false) {
            this.updateHtmlElementStyles(canvas)
            fromEvent(window, 'resize')
                .pipe(debounceTime(this.settings?.resizeDebounceTime ?? 500))
                .subscribe(() => this.updateHtmlElementStyles(canvas))
        }
    }
    private updateHtmlElementStyles(canvas: HTMLCanvasElement) {
        this.htmlElement.style.top = `${canvas.offsetTop}px`
        this.htmlElement.style.left = `${canvas.offsetLeft}px`
        this.htmlElement.style.width = `${canvas.offsetWidth}px`
        this.htmlElement.style.height = `${canvas.offsetHeight}px`
    }

    public add(html: HTMLElement | string): HTMLElement {
        if(!(html instanceof HTMLElement)) {
            html = this.domParser.parseFromString(html, 'text/html').body.firstChild as HTMLElement
        }
        this.htmlElement.appendChild(html)

        return html
    }


    public getNewInstance() {
        return new UIFrameworkFactory()
    }
    public withParameters(params: UiFrameworkSettingsInterface) {
        this.settings = params
        return this
    }

}

export const UIFramework = new UIFrameworkFactory()