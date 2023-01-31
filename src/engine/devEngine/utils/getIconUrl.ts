import {AssetsTree} from "../types/AssetsTree.interface";
import {ExplorerService} from "../UI/bottom/explorer.service";

import folderIcon from '../assets/folder.png'
import other from '../assets/other.png'
import typescript from '../assets/typescript.png'
import javascript from '../assets/javascript.png'
import image from '../assets/image.png'
import html from '../assets/html.png'
import css from '../assets/css.png'
import json from '../assets/json.png'
import gltf from '../assets/gltf.png'

export async function getIconUrl(data: AssetsTree): Promise<string> {
    if(data.isFolder) {
        return folderIcon
    } else if(/\.ts$/.test(data.name)) {
        return typescript
    } else if(/\.js$/.test(data.name)) {
        return javascript
    } else if(/\.(jpeg|jpg|png|gif|svg|ico)$/.test(data.name)) {
        const res = await ExplorerService.getFile(data.path)
        console.log(res)
        return image
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