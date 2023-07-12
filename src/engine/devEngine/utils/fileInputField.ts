import { ChangeDetector } from './../changeDetector/index';
import { Material } from "three";
import { FolderApi } from "tweakpane";
import { defaultMapTexture } from "⚙️/shared/consts/defaultTexture";
import { WireframeLoaders } from "⚙️/shared/loaders";
import { IFileInput } from "./types/FileInput.interface";
import { filter } from 'rxjs';

let draggingObject: any = null
ChangeDetector.draggingObject$.pipe(
    filter((el) => typeof el === 'string' || el === null)
).subscribe((data) => {
    draggingObject = data
})

export class FileInputField implements IFileInput {
    public container: HTMLElement;
    public input: HTMLInputElement;
    public delete: HTMLButtonElement;

    constructor(container: HTMLElement, input: HTMLInputElement, deleteButton: HTMLButtonElement) {
        this.container = container;
        this.input = input;
        this.delete = deleteButton;
    }

    public dispose() {
        this.container.remove();
    }

    static addImage(
        folder: FolderApi, 
        keyName: string, 
        defaultImage: HTMLImageElement | null = null, 
        onChange: (url: string) => Promise<void>
    ): FileInputField {
        const container = folder.addFolder({title: '__'}).element
        container.innerHTML = ''
        container.classList.add('__wireframe-file-input-container')
        const title = document.createElement('span')
        title.innerText = keyName
        container.appendChild(title)
        const buttonsContainer = document.createElement('div')
        buttonsContainer.classList.add('__wireframe-file-input-buttons-container')

        const inputElement = document.createElement('input')
        inputElement.type = 'file'
        inputElement.accept = 'image/gif, image/jpeg, image/png, image/jpg'
        inputElement.name = keyName
        inputElement.id = keyName
        inputElement.classList.add('__wireframe-file-input')
        buttonsContainer.appendChild(inputElement)
        
        const inputLabel = document.createElement('label')
        inputLabel.htmlFor = keyName
        this.addLabelEvents(inputLabel, onChange)
        if(defaultImage && defaultImage.src !== defaultMapTexture.image.src) {
            inputLabel.style.backgroundImage = `url("${defaultImage.src}")`
        }
        inputElement.addEventListener('change', async (event) => {
            const target = (event.target as HTMLInputElement | null)
            const file = target?.files ? target.files[0] : null
            if(file) {
                const url = (window.URL || window.webkitURL).createObjectURL(file)
                onChange(url)
                inputLabel.style.backgroundImage = `url("${url}")`
            }
        })
        buttonsContainer.appendChild(inputLabel)

        const deleteButton = document.createElement('button')
        deleteButton.innerText = '✖'
        deleteButton.title = `Remove ${keyName}`
        deleteButton.classList.add('__wireframe-file-input-delete')
        deleteButton.addEventListener('click', () => {
            inputLabel.style.backgroundImage = `none`
        })
        buttonsContainer.appendChild(deleteButton)

        container.appendChild(buttonsContainer)
        return new this(container, inputElement, deleteButton)
    }
    private static addLabelEvents(el: HTMLElement, onChange: (url: string) => Promise<void>): void {
        el.addEventListener('dragenter', (e) => {
            e.preventDefault()
        })
        el.addEventListener('dragleave', (e) => {
            e.preventDefault()
        })
        el.addEventListener('drop', (e) => {
            e.preventDefault()
            draggingObject
        })
        el.addEventListener('dragover', (e) => {
            e.preventDefault()
        })
    }
    static addMapable<T extends Material>(material: T, folder: FolderApi, keyName: keyof T & string): FileInputField {
        const workingMaterial = material as any
        const image = workingMaterial[keyName]?.image || defaultMapTexture.image
        const fileField = this.addImage(folder, keyName, image, async (url: string) => {
            const texture = await WireframeLoaders.textureLoader.loadAsync(url)
            workingMaterial[keyName] = texture
            material.needsUpdate = true
        })
        fileField.delete.addEventListener('click', () => {
            workingMaterial[keyName] = null
        })

        return fileField
    }
}