import {AssetsTree} from "../types/AssetsTree.interface";
import axios from "axios";
const process = require('process');

class Explorer {
    http = axios.create({
        baseURL: `http://localhost:${process.env.EXPRESS_PORT || 42069}`,
        headers: {'Access-Control-Allow-Origin': 'localhost'},
    })
    fileReader = new FileReader()
    public async getElements(path: string): Promise<AssetsTree[]> {
        path = String(path).replace(/^.\/src/,"")
        const { data } = await this.http.get<AssetsTree[]>(path)
        return data.sort((a: AssetsTree, b: AssetsTree) => Number(b.isFolder) - Number(a.isFolder))
    }
    public async getFile(path: string): Promise<string> {
        path = String(path).replace(/^.\/src/,"")
        return await this.http.get<Blob>(path, {
            responseType: "text",
            responseEncoding: "base64",
        })
            .then(res => {
                // this.fileReader.readAsDataURL(res.data);
                console.log(res)
                return ''
            })
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