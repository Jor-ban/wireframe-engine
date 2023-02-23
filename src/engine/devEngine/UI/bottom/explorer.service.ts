import {AssetsTree} from "../../types/AssetsTree.interface";
import axios from "axios";
import * as process from 'process'

class Explorer {
    http = axios.create({
        baseURL: `http://localhost:${process?.env?.EXPRESS_PORT || 42069}`,
        headers: {'Access-Control-Allow-Origin': 'localhost'},
    })
    fileReader = new FileReader()
    public async getElements(path: string): Promise<AssetsTree[]> {
        path = String(path).replace(/^.\/src\/(static)?/, "")
        const { data } = await this.http.get<AssetsTree[]>(path)
        return data.sort((a: AssetsTree, b: AssetsTree) => Number(b.isFolder) - Number(a.isFolder))
    }
    // public createFolder(name: string, path: string = this.path): AssetsTree {
        // const newFolder = {
        //     name,
        //     isFolder: true,
        //     path: path + '/' + name,
        //     children: []
        // }
        // const directory = this.getElements(path)
        // if(directory.children) {
        //     directory.children.push(newFolder)
        // } else {
        //     directory.children = [newFolder]
        // }
        // return directory
    // }
}

export const ExplorerService = new Explorer();