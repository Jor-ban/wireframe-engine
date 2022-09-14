import {FolderApi, TabPageApi} from "tweakpane";

export class InstrumentsControls {
    instrumentsFolder: FolderApi
    instrumentsElement: HTMLElement

    constructor(pane: TabPageApi) {
        this.instrumentsFolder = pane.addFolder({title: '', expanded: true})
        this.instrumentsFolder.element.classList.add('__wireframe-invisible-folder')
        this.instrumentsElement = this.instrumentsFolder.element.children[1] as HTMLElement;
        this.instrumentsElement.classList.add('__wireframe-instruments')

    }
}