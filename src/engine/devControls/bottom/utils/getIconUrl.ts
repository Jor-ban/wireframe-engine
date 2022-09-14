import {AssetsTree} from "../../types/AssetsTree.interface";
import { ExplorerService } from "../explorer.service";

const folderIcon: string = require('../../assets/folder.png')
const other: string = require('../../assets/other.png');
const typescript: string = require('../../assets/typescript.png');
const javascript: string = require('../../assets/javascript.png');
const image: string = require('../../assets/image.png');
const html: string = require('../../assets/html.png');
const css: string = require('../../assets/css.png');
const json: string = require('../../assets/json.png');
const gltf: string = require('../../assets/gltf.png');

export async function getIconUrl(data: AssetsTree): Promise<string> {
    if(data.isFolder) {
        return folderIcon
    } else if(/\.ts$/.test(data.name)) {
        return typescript
    } else if(/\.js$/.test(data.name)) {
        return javascript
    } else if(/\.(jpeg|jpg|png|gif|svg|ico)$/.test(data.name)) {
        return await ExplorerService.getFile(data.path)
    } else if(/\.gltf$/.test(data.name)) {
        return gltf
    } else if(/\.html$/.test(data.name)) {
        return html
    } else if(/\.css$/.test(data.name)) {
        return css
    } else if(/\.json$/.test(data.name)) {
        return json
    } else {
        return other
    }
}