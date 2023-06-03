import {Shortcuts} from "⚙️/devEngine/shortcuts";
import {Pane} from "tweakpane";
import {Logger} from "⚙️/devEngine/UI/bottom/logger";
import {Console} from "⚙️/devEngine/UI/bottom/console";

export class TestBottomControls {
    container: HTMLElement
    pane: Pane
    constructor() {
        this.container = document.createElement('div')
        document.body.appendChild(this.container)
        this.container.classList.add('__wireframe-test-bottom-controls', '__wireframe-controls')
        this.pane = new Pane({title: 'Console (~)', container: this.container, expanded: false})
        this.pane.on('fold', this.onFold.bind(this))
        this.onFold({expanded: false})
        this.initConsole()
    }
    private onFold({expanded}: { expanded: boolean }) {
        if(expanded) {
            this.container.style.transform = 'translateY(0)'
        } else {
            this.container.style.transform = `translateY(calc(100% - 20px))`
        }
    }
    private initConsole() {
        const consoleFolder = this.pane.addFolder({title: 'Console'})
        consoleFolder.element.children[0].remove()
        const loggerFolder = this.pane.addFolder({title: 'Logger'})
        loggerFolder.element.children[0].remove()
        const cnsl = new Console(consoleFolder)
        new Logger(loggerFolder)
        Shortcuts.key('~').subscribe(() => {
            this.pane.expanded = !this.pane.expanded
            if(this.pane.expanded) {
                cnsl.input.focus()
            }
        })
    }
}