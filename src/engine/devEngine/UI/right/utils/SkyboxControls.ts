import {FolderApi, InputBindingApi, Pane, TabPageApi} from "tweakpane";
import {Color, Scene, sRGBEncoding, Texture, WebGLCubeRenderTarget, WebGLRenderer} from "three";
import {
    CubeTextureLoaderService,
    defaultSkybox,
    defaultSkyboxSides
} from "../../../../shared/consts/defaultSkybox";
import {FileInputControls, whiteTexture} from "../../../../shared/FileInputControls.util";
import {WireframeTextureLoader} from "../../../../shared/loaders";

export class SkyboxControls {
    inputsList: InputBindingApi<unknown, string>[] = []
    scene: Scene
    renderer: WebGLRenderer
    folder: FolderApi

    constructor(pane: Pane | TabPageApi | FolderApi, scene: Scene, renderer: WebGLRenderer) {
        this.scene = scene
        this.renderer = renderer
        this.folder = pane.addFolder({
            title: 'Skybox',
            expanded: true,
        });
        this.folder.addInput({skyboxType: ''}, 'skyboxType', {
            options: {
                'default': '',
                'solid-color': 'solid-color',
                'transparent': 'transparent',
                'box-images': 'box-images',
                'single-file': 'single-file',
            }
        }).on('change', ({ value }) => {
            this.clearControls()
            if(value === '') {
                this.setDefault()
            } else if(value === 'solid-color') {
                this.setSolidColor()
            } else if(value === 'transparent') {
                this.setTransparent()
            } else if(value === 'box-images') {
                this.setBoxImages()
            } else if(value === 'single-file') {
                this.setSingleFile()
            }
        })
    }
    private setDefault() {
        this.scene.environment = defaultSkybox
        this.scene.background = defaultSkybox
    }
    private setSolidColor() {
        this.scene.environment = null
        this.scene.background = null
        const color = this.folder.addInput({color: '#000000'}, 'color')
            .on('change', ({ value }) => {
                this.scene.background = new Color(value)
            })
        this.inputsList.push(color)
    }
    private setTransparent() {
        this.scene.environment = null
        this.scene.background = null
        this.renderer.setClearColor(0x000000, 0)
    }
    private setBoxImages() {
        this.setDefault()
        const usingSkyboxArr: string[] = [...defaultSkyboxSides]
        usingSkyboxArr.forEach((value: string, index: number) => {
            const usingKey = index === 0 ? 'posX' : index === 1 ? 'negX' : index === 2 ? 'posY' : index === 3 ? 'negY' : index === 4 ? 'posZ' : 'negZ'
            const [input, xButton] = FileInputControls.addImage(this.folder, usingKey, defaultSkybox.images[index].src)
            input.on('change', ({value}) => {
                usingSkyboxArr[index] = (value as unknown as HTMLImageElement).src
                CubeTextureLoaderService.load(usingSkyboxArr, (texture) => {
                    this.scene.background = texture
                    this.scene.environment = texture
                    texture.encoding = sRGBEncoding
                })
            })
            this.inputsList.push(input, xButton)
        })
    }
    private setSingleFile() {
        const [input, xButton] = FileInputControls.addImage(this.folder, 'image', whiteTexture.image)
        input.on('change', async ({value}) => {
            const url = (value as unknown as HTMLImageElement).src
            WireframeTextureLoader.load(
                url, (texture: Texture) => {
                    const rt = new WebGLCubeRenderTarget(texture.image.height);
                    rt.fromEquirectangularTexture(this.renderer, texture);
                    this.scene.background = rt.texture;
                    this.scene.environment = rt.texture;
                }
            );
        })
        this.inputsList.push(input, xButton)
    }

    private clearControls() {
        this.inputsList.forEach(input => input.dispose())
    }
}