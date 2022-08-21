import {TabPageApi} from "tweakpane";
import {AssetsTree} from "../types/AssetsTree.interface";
import {Explorer} from "./assetManagerExplorer";
const folderUrl = require("../assets/folder.png")

export class AssetsManager {
    element !: HTMLElement;
    router !: Explorer;
    viewElement !: HTMLElement;
    routerElement: HTMLElement;
    files: AssetsTree = { name: 'root', children: [] }
    contextMenu: HTMLElement | null = null;
    constructor(pane: TabPageApi) {
        this.element = pane.addFolder({ title: 'Assets' }).element
        this.element.classList.add('__wireframe-assets')
        this.routerElement = document.createElement('p')
        this.viewElement = document.createElement('div')
        this.viewElement.classList.add('__wireframe-explorer')
        this.element.appendChild(this.routerElement)
        this.element.appendChild(this.viewElement)
        this.router = new Explorer(this.routerElement, this.files)
        this.element.addEventListener('click', (e: MouseEvent) => {
            this.contextMenu?.parentNode?.removeChild(this.contextMenu)
            this.contextMenu = null
        })
        this.element.oncontextmenu = this.onContextMenuCall.bind(this)
        this.updateExplorerView()
    }
    showContextMenu(contextMenu: HTMLElement): void {
        this.contextMenu?.parentNode?.removeChild(this.contextMenu)
        this.contextMenu = contextMenu
        this.element.appendChild(contextMenu)
    }
    createFolder(): void {
        let newFolderName = window.prompt('Enter folder name in ' + this.router.path , '')
        if (newFolderName) {
            this.files = this.router.createFolder(newFolderName)
            this.updateExplorerView()
        }
    }
    updateExplorerView() {
        this.viewElement.innerHTML = ''
        for(let el of this.files.children ?? []) {
            const grid = document.createElement('div')
            grid.classList.add('__wireframe-assets-grid')
            grid.innerHTML = `
                <img src="${folderUrl}" alt="">
                <p>${el.name}</p>
            `
            this.viewElement.appendChild(grid)
        }
    }
    onContextMenuClick(e: MouseEvent) {
        const action = (e.target as HTMLElement).dataset.action
        if (action) {
            switch (action) {
                case 'new-folder':
                    this.createFolder()
                    break;
            }
        }
    }
    onContextMenuCall(e: MouseEvent) {
        e.preventDefault()
        e.stopImmediatePropagation()
        let contextMenu = document.createElement('div')
        contextMenu.style.position = 'fixed'
        contextMenu.style.top = `${e.clientY}px`
        contextMenu.style.left = `${e.clientX}px`
        contextMenu.classList.add('__wireframe-context-menu')
        contextMenu.innerHTML = `
            <button class="__wireframe-context-menu-item" data-action="new-folder">New folder</button>
            `
        //<div class="__wireframe-context-menu-item" data-action="new-file">New file</div>
        //             <div class="__wireframe-context-menu-item" data-action="rename">Rename</div>
        //             <div class="__wireframe-context-menu-item" data-action="delete">Delete</div>
        contextMenu.addEventListener('click', this.onContextMenuClick.bind(this))
        this.showContextMenu(contextMenu)
    }
}