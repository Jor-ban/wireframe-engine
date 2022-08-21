import {AssetsTree} from "../types/AssetsTree.interface";

export class Explorer {
    public element !: HTMLElement;
    public path: string = 'root';
    public assetsTree !: AssetsTree;
    constructor(element: HTMLElement, assetsTree: AssetsTree) {
        this.element = element
        this.assetsTree = assetsTree
        this.path = element.innerHTML
    }
    public open(path: string): AssetsTree {
        this.path = path
        this.element.innerHTML = path
        return this.getElements(path)
    }
    private getElements(path: string): AssetsTree {
        const parts = path.split('/')
        let current = this.assetsTree
        for (let i = 0; i < parts.length - 1; i++) {
            if (current.children) {
                let tree = current.children.find(child => child.name === parts[i]);
                if(!tree) {
                    console.error("[Engine -> Router] : No children found")
                    break;
                } else {
                    current = tree
                }
            } else {
                console.error("[Engine -> Router] : No children found")
            }
        }
        return current
    }
    public createFolder(name: string, path: string = this.path): AssetsTree {
        const newFolder = {
            name,
            isFolder: true,
            children: []
        }
        const directory = this.getElements(path)
        if(directory.children) {
            directory.children.push(newFolder)
        } else {
            directory.children = [newFolder]
        }
        return directory
    }
}