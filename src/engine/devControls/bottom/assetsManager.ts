import {TabPageApi} from "tweakpane";
import {AssetsTree} from "../types/AssetsTree.interface";
import {ExplorerService} from "./explorer.service";
import {getIconUrl} from "./utils/getIconUrl";
const folderIconUrl = require("../assets/folder.png")

export class AssetsManager {
    element !: HTMLElement;
    viewElement !: HTMLElement;
    routerElement: HTMLElement;
    currentDirectory: AssetsTree = { name: 'src', isFolder: true, path: './src' }
    contextMenu: HTMLElement | null = null;

    constructor(pane: TabPageApi) {
        this.element = pane.addFolder({ title: 'Assets' }).element
        this.element.innerHTML = ''
        this.element.classList.add('__wireframe-assets')
        this.routerElement = document.createElement('p')
        this.viewElement = document.createElement('div')
        this.viewElement.classList.add('__wireframe-explorer')
        this.element.appendChild(this.routerElement)
        this.element.appendChild(this.viewElement)
        this.element.addEventListener('click', (e: MouseEvent) => {
            this.contextMenu?.parentNode?.removeChild(this.contextMenu)
            this.contextMenu = null
        })
        this.element.oncontextmenu = this.onContextMenuCall.bind(this)
        this.setRouter(this.currentDirectory.path)
        this.updateExplorerView()
    }
    showContextMenu(contextMenu: HTMLElement): void {
        this.contextMenu?.parentNode?.removeChild(this.contextMenu)
        this.contextMenu = contextMenu
        this.element.appendChild(contextMenu)
    }
    createFolder(): void {
        let newFolderName = window.prompt('Enter folder name in ' + this.currentDirectory.path , '')
        if (newFolderName) {
            // this.files = ExplorerService.createFolder(newFolderName)
            this.updateExplorerView()
        }
    }
    async updateExplorerView() {
        this.viewElement.innerHTML = ''
        const path = this.currentDirectory.path.replace(/root\/?/,"")
        const elements = await ExplorerService.getElements(path).catch(ignored => {}) as AssetsTree[]
        for(let el of elements) {
            const grid = document.createElement('div')
            grid.classList.add('__wireframe-assets-grid')
            grid.oncontextmenu = this.contextMenuOnElement.bind(this)
            grid.innerHTML = `
                <img src="${await getIconUrl(el)}" alt="">
                <p>${el.name}</p>
            `
            this.viewElement.appendChild(grid)
            grid.addEventListener('dblclick', () => this.goto(el))
        }
    }
    goto(el: AssetsTree) {
        if(el.isFolder) {
            if(el.path === 'root') {
                el.path = './src'
            }
            this.currentDirectory = el
            this.setRouter(el.path)
            this.updateExplorerView()
        }
    }
    setRouter(path: string) {
        path = String(path).replace(/^.\/src/,"root")
        this.routerElement.innerHTML = ''
        const pathArr = path.split('/')
        for(let pathPart of pathArr) {
            const btn = document.createElement('button')
            btn.innerHTML = pathPart + ' /'
            btn.classList.add('__wireframe-router-btn')
            this.routerElement.appendChild(btn)
            btn.addEventListener('click', () => {
                this.goto({
                    isFolder: true,
                    name: pathPart,
                    path: path.split(pathPart)[0] + pathPart
                })
            })
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
        contextMenu.addEventListener('click', this.onContextMenuClick.bind(this))
        this.showContextMenu(contextMenu)
    }
    contextMenuOnElement(e: MouseEvent) {
        e.preventDefault()
        e.stopImmediatePropagation()
        let contextMenu = document.createElement('div')
        contextMenu.style.position = 'fixed'
        contextMenu.style.top = `${e.clientY}px`
        contextMenu.style.left = `${e.clientX}px`
        contextMenu.classList.add('__wireframe-context-menu')
        contextMenu.innerHTML = `
            <button class="__wireframe-context-menu-item" data-action="rename">Rename</button>
            <button class="__wireframe-context-menu-item" data-action="delete">Delete</button>
            `
        contextMenu.addEventListener('click', this.onContextMenuClick.bind(this))
        this.showContextMenu(contextMenu)
    }
}