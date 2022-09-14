import {AssetsTree} from "../types/AssetsTree.interface";
import axios from "axios";
const process = require('process');

class Explorer {
    http = axios.create({
        baseURL: `http://localhost:${process.env.EXPRESS_PORT || 42069}`,
        headers: {'Access-Control-Allow-Origin': 'localhost'},
    })
    public async getElements(path: string): Promise<AssetsTree[]> {
        path = String(path).replace(/^.\/src/,"")
        const { data } = await this.http.get<AssetsTree[]>(path)
        return data.sort((a: AssetsTree, b: AssetsTree) => Number(b.isFolder) - Number(a.isFolder))
    }
    public async getFile(path: string): Promise<string> {
        path = String(path).replace(/^.\/src/,"")
        const { data } = await this.http.get(path)
        console.log(data)
        return data
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