import {Euler, Material, Texture} from "three";
import {FolderApi, InputBindingApi} from "tweakpane";
import {WireframeTextureLoader} from "./loaders";
// @ts-ignore
import white from "./assets/white.png";

export let defaultMapTexture: Texture
export let whiteTexture: Texture
(async function() {
    defaultMapTexture = await WireframeTextureLoader.loadAsync(white)
    whiteTexture = await WireframeTextureLoader.loadAsync(white)
})()

export class FileInputControls {
    static addImage(folder: FolderApi, keyName: string, defaultImageSrc: HTMLImageElement | null = null): [InputBindingApi<unknown, Euler>, InputBindingApi<unknown, Euler>] {
        const emptyObj: {[key: string]: any} = {}
        emptyObj[keyName] = defaultImageSrc
        const input = folder.addInput(emptyObj, keyName, {
            view: 'input-image',
            label: keyName as string,
        })
        const xButton = folder.addInput({a: 0}, 'a', {
            view: 'radiogrid',
            groupName: 'scale',
            size: [1, 1],
            cells: () => ({
                title: '[X]',
            }),
            label: 'Remove',
        }).on('change', () => {
            emptyObj[keyName] = defaultImageSrc
        })
        xButton.element.classList.add('__tweakpane-delete-btn', '__tweakpane-material-deleter')
        return [input, xButton]
    }
    static addMapable<T extends Material>(material: T, folder: FolderApi, keyName: keyof T & string): InputBindingApi<unknown, Euler>[] {
        const obj: {[key: string | number | symbol]: string} = {}
        const workingMaterial = material as any
        obj.image = workingMaterial[keyName]?.image?.src || defaultMapTexture.image.src
        const [input, xButton] = this.addImage(folder, keyName, defaultMapTexture.image)

        input.on('change', async (change) => {
            const value = change.value as unknown as {src: string}
            if(value.src !== defaultMapTexture.image.src) {
                const texture = await WireframeTextureLoader.loadAsync(value.src)
                workingMaterial[keyName] = texture
                material.needsUpdate = true
            }
        })
        xButton.on('change', () => {
            workingMaterial[keyName] = null
            obj.image = defaultMapTexture.image.src
        })

        return [input, xButton]
    }
}