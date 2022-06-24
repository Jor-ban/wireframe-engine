import {
    BackSide,
    Color,
    DoubleSide,
    FrontSide,
    Material,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshMatcapMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
    MeshToonMaterial,
    MeshDepthMaterial,
    MeshNormalMaterial,
    MeshPhysicalMaterial,
    Mesh, Texture, TextureLoader
} from "three";
import {FolderApi} from "tweakpane";
import { TxLoader } from '../../shared/textureLoader';

export class MaterialControls {
    textureLoader: TextureLoader = new TextureLoader()
    static addForMaterial(material: Material, folder: FolderApi) {
        material.needsUpdate = true
        // material.transparent = true; // TODO dynamize by trigger on opacity
        folder.addInput(material, 'opacity', {min: 0, max: 1})
            .on('change', ({value}) => {
                material.opacity = value
            })
        folder.addInput(material, 'visible')
        folder.addInput({side: 0}, 'side', {
            options: {
                'FrontSide': FrontSide,
                'BackSide': BackSide,
                'DoubleSide': DoubleSide,
            }
        }).on('change', ({value}) => {
            material.side = value
        })
        folder.addInput(material, 'clipIntersection')
        // TODO add clippingPlanes : Plane
        folder.addInput(material, 'clipShadows')
        folder.addInput(material, 'colorWrite')
        folder.addInput(material, 'fog')
        folder.addSeparator() // !!!SEPARATOR!!!
        const details = folder.addFolder({ title: 'Material details', expanded: true })
        // TODO add depthFunc: DepthModes
        details.addInput(material, 'depthTest')
        details.addInput(material, 'depthWrite')
        details.addInput(material, 'alphaTest', {min: 0, max: 1})
        details.addInput(material, 'alphaToCoverage')
        // TODO add blendDst : BlendingDsrFactor & blendDstAlpha ; number & blendEquation : BlendingEquation & blendEquationAlpha : number
        // TODO add blending : Blending & blendSrc : BlendingSrcFactor | BlendingDsrFactor & blendSrcAlpha : number
        details.addInput(material, 'polygonOffset')
        details.addInput(material, 'polygonOffsetFactor')
        details.addInput(material, 'polygonOffsetUnits')
        details.addInput({precision: 0}, 'precision', {
            options: {
                'null': 0,
                'highp': 1,
                'mediump': 2,
                'lowp': 3
            }
        }).on('change', ({value}) => {
            material.precision = value === 0 ? null : value === 1 ? 'highp' : value === 2 ? 'mediump' : 'lowp'
        })
        details.addInput(material, 'toneMapped')
        details.addInput(material, 'vertexColors')
        // TODO add format : PixelFormat
        details.addInput(material, 'stencilWrite')
        // TODO add stencilFunc: StencilFunc
        details.addInput(material, 'stencilRef')
        details.addInput(material, 'stencilWriteMask')
        details.addInput(material, 'stencilFuncMask')
        // TODO add stencilFail : StencilOp & stencilZFail : StencilOp & stencilZPass : StencilOp
    }

    static addForToonMaterial(material: MeshToonMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        // TODO add gradientMap : Texture & map : Texture & lightMap : Texture
        // TODO add lightMapIntensity: number & aoMap : Texture & aoMapIntensity : number
        this.addForEmissive(material, folder)
        folder.addInput(material, 'emissiveIntensity')
        // TODO add emissiveMap : Texture & bumpMap : Texture & bumpMapScale : number
        // TODO add normalMap : Texture & normalMapType : NormalMapTypes & normalScale : Vector2
        // TODO add displacementMap : Texture & displacementScale : number & displacementBias : number
        // TODO add alphaMap : Texture
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'wireframeLinecap')
        folder.addInput(material, 'wireframeLinejoin')
    }
    static addForMatcapMaterial(material: MeshMatcapMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        // TODO add matcap: Texture | null & map: Texture | null & bumpMap: Texture | null & bumpMapScale: number
        // TODO add normalMap: Texture | null & normalMapType: NormalMapTypes & normalScale: Vector2
        // TODO add displacementMap: Texture | null & displacementScale: number & displacementBias: number
        // TODO add alphaMap: Texture | null
        folder.addInput(material, 'flatShading')
    }
    static addForNormalMaterial(material: MeshNormalMaterial, folder: FolderApi) {
        // TODO add bumpMap: Texture | null & bumpScale: number & normapMap: Texture | null
        // TODO add normalMapType: NormalMapTypes & normalScale: Vector2
        // TODO add displacementMap: Texture | null & displacementScale: number & displacementBias: number
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'flatShading')
    }
    static addForPhongMaterial(material: MeshPhongMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        this.addForSpecular(material, folder)
        folder.addInput(material, 'shininess')
        // TODO add map: Texture | null & lightMap: Texture | null & lightMapIntensity: number
        // TODO add aoMap: Texture | null & aoMapIntensity: number
        this.addForEmissive(material, folder)
        folder.addInput(material, 'emissiveIntensity')
        // TODO add bumpMap: Texture | null & bumpScale: number & normalMap: Texture | null & normalMapType: NormalMapTypes
        // TODO add normalScale: Vector2 &  displacementMap: Texture | null & displacementScale: Vector2
        // TODO add displacementBias: number & specularMap: Texture | null & envMap: Texture | null
        // TODO add alphaMap: Texture | null & combine: Combine
        folder.addInput(material, 'reflectivity')
        folder.addInput(material, 'refractionRatio')
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'wireframeLinejoin')
        folder.addInput(material, 'flatShading')
    }
    static addForDepthMaterial(material: MeshDepthMaterial, folder: FolderApi) {
        // TODO add map: Texture | null & alphaMap: Texture | null
        // TODO add depthPacking : DepthPackingStrategies & displacementMap : Texture | null
        // TODO add displacementScale : number & displacementBias : number
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
    }
    static addForBasicMaterial(material: MeshBasicMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        this.addForMap(material, folder)
        // TODO add aoMap: Texture | null & lightMap : Texture | null
        // TODO add aoMapIntensity : number & alphaMap: Texture | null & lightMapIntensity : number
        // TODO add specularMap : Texture | null & envMap : Texture | null & combine : Combine
        folder.addInput(material, 'reflectivity')
        folder.addInput(material, 'refractionRatio')
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'wireframeLinecap')
        folder.addInput(material, 'wireframeLinejoin')
    }
    static addForStandardMaterial(material: MeshStandardMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        folder.addInput(material, 'roughness')
        folder.addInput(material, 'metalness')
        this.addForMap(material, folder)
        // TODO add map: lightMap: Texture | null & lightMapIntensity: number
        // TODO add aoMap: Texture | null & aoMapIntensity: number
        this.addForEmissive(material, folder)
        folder.addInput(material, 'emissiveIntensity')
        // TODO add emissiveMap: Texture | null & bumpMap: Texture | null & normalMapType: NormalMapTypes
        // TODO add normalScale: Vector2 & displacementMap; Texture | null & displacementScale: number
        // TODO add displacementBias: number & roughnessMap: Texture | null & metalnessMap: Texture | null
        // TODO add alphaMap: Texture | null & envMap: Texture | null & envMapIntensity: number
        folder.addInput(material, 'refractionRatio')
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'flatShading')
    }
    static addForLambertMaterial(material: MeshLambertMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        this.addForEmissive(material, folder)
        folder.addInput(material, 'emissiveIntensity')
        // TODO add emissiveMap: Texture | null
        this.addForMap(material, folder)
        // TODO add map: & aoMap: Texture | null & lightMap : Texture | null & lightMapIntensity : number
        // TODO add aoMapIntensity : number & specularMap : Texture | null & alphaMap: Texture | null
        // TODO add envMap : Texture | null & combine : Combine
        folder.addInput(material, 'reflectivity')
        folder.addInput(material, 'refractionRatio')
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'wireframeLinecap')
        folder.addInput(material, 'wireframeLinejoin')
    }
    static addForPhysicalMaterial(material: MeshPhysicalMaterial, folder: FolderApi) {
        this.addForStandardMaterial(material as MeshStandardMaterial, folder)
        folder.addInput(material, 'clearcoat')
        // TODO add clearcoatMap: Texture | null
        folder.addInput(material, 'clearcoatRoughness')
        // TODO add clearcoatRoughnessMap: Texture | null & clearcoatNormalScale: Vector2 & clearcoatNormalMap: Texture | null
        folder.addInput(material, 'reflectivity')
        folder.addInput(material, 'ior')
        folder.addInput(material, 'sheen')
        this.addForSheenColor(material, folder)
        folder.addInput(material, 'sheenRoughness')
        folder.addInput(material, 'transmission')
        // TODO add transmissionMap: Texture | null
        folder.addInput(material, 'attenuationDistance')
        this.addForAttenuationColor(material, folder)
        folder.addInput(material, 'specularIntensity')
        this.addForSpecularColor(material, folder)
        // TODO add specularIntensityMap: Texture | null & specularColorMap: Texture | null
    }

    private addMapable<T extends Material>(material: T, folder: FolderApi, keyName: keyof T) {
        console.log('addForMap', material[keyName])
        const workingMaterial = material as any
        const obj = {  }
    }
    private static addForMap(material: MeshBasicMaterial | MeshStandardMaterial | MeshLambertMaterial | MeshPhongMaterial | MeshPhysicalMaterial, folder: FolderApi) {
        console.log('addForMap', material.map)
        folder.addInput({map: material.map?.image || 'placeholder'}, 'map', {
            view: 'input-image'
        }).on('change', ({value}) => {
            console.log({src: value.src})
            material.map = TxLoader.load(value.src)
            material.needsUpdate = false
        }).disabled = true
    }
    private static addColorable<T extends Material>(material: T, folder: FolderApi, colorName: keyof T) {
        const color = material[colorName] as unknown as Color
        const headerName: string = typeof colorName === 'string' ? colorName : 'color'
        const obj: {[key: string]: string} = {}
        obj[headerName] = '#' + color.getHexString()
        folder.addInput(obj, headerName)
            .on('change', ({value}) => {
                color.set(new Color(value))
            })
    }
    private static addForColor(material:
        | MeshToonMaterial | MeshBasicMaterial | MeshLambertMaterial
        | MeshMatcapMaterial | MeshPhongMaterial | MeshStandardMaterial,
       folder: FolderApi
    ) {
        this.addColorable(material, folder, 'color')
    }
    private static addForEmissive(material:
        | MeshToonMaterial | MeshLambertMaterial | MeshPhongMaterial | MeshStandardMaterial,
        folder: FolderApi
    ) {
        this.addColorable(material, folder, 'emissive')
    }
    private static addForSpecular(material: MeshPhongMaterial, folder: FolderApi) {
        this.addColorable(material, folder, 'specular')
    }
    private static addForSheenColor(material: MeshPhysicalMaterial, folder: FolderApi) {
        this.addColorable(material, folder, 'sheen')
    }
    private static addForAttenuationColor(material: MeshPhysicalMaterial, folder: FolderApi) {
        this.addColorable(material, folder, 'attenuationColor')
    }
    private static addForSpecularColor(material: MeshPhysicalMaterial, folder: FolderApi) {
        this.addColorable(material, folder, 'specularColor')
    }

    static materialConverter(material: Material, mesh: Mesh, folder: FolderApi, callback: () => void) {
        folder.addInput({'Change Material Type': material.type}, 'Change Material Type', {
            options: {
                'DepthMaterial': 'MeshDepthMaterial',
                'ToonMaterial': 'MeshToonMaterial',
                'BasicMaterial': 'MeshBasicMaterial',
                'MatcapMaterial': 'MeshMatcapMaterial',
                'NormalMaterial': 'MeshNormalMaterial',
                'PhongMaterial': 'MeshPhongMaterial',
                'StandardMaterial': 'MeshStandardMaterial',
                'LambertMaterial': 'MeshLambertMaterial',
                'PhysicalMaterial': 'MeshPhysicalMaterial',
            }
        }).on('change', ({value}) => {
            let newMaterial: Material
            const materialParams = {
                alphaTest: material.alphaTest,
                alphaToCoverage: material.alphaToCoverage,
                blendDst: material.blendDst,
                blendDstAlpha: material.blendDstAlpha,
                blendEquation: material.blendEquation,
                blendEquationAlpha: material.blendEquationAlpha,
                blending: material.blending,
                blendSrc: material.blendSrc,
                blendSrcAlpha: material.blendSrcAlpha,
                clipIntersection: material.clipIntersection,
                clippingPlanes: material.clippingPlanes,
                clipShadows: material.clipShadows,
                colorWrite: material.colorWrite,
                depthFunc: material.depthFunc,
                depthTest: material.depthTest,
                depthWrite: material.depthWrite,
                fog: material.fog,
                name: material.name,
                opacity: material.opacity,
                polygonOffset: material.polygonOffset,
                polygonOffsetFactor: material.polygonOffsetFactor,
                polygonOffsetUnits: material.polygonOffsetUnits,
                precision: material.precision,
                premultipliedAlpha: material.premultipliedAlpha,
                dithering: material.dithering,
                side: material.side,
                shadowSide: material.shadowSide,
                toneMapped: material.toneMapped,
                transparent: material.transparent,
                vertexColors: material.vertexColors,
                visible: material.visible,
                stencilWrite: material.stencilWrite,
                stencilFunc: material.stencilFunc,
                stencilRef: material.stencilRef,
                stencilWriteMask: material.stencilWriteMask,
                stencilFuncMask: material.stencilFuncMask,
                stencilFail: material.stencilFail,
                stencilZFail: material.stencilZFail,
                stencilZPass: material.stencilZPass,
            }
            switch (value) {
                case 'MeshDepthMaterial':
                    newMaterial = new MeshDepthMaterial(materialParams)
                    break;
                case 'MeshToonMaterial':
                    newMaterial = new MeshToonMaterial(materialParams)
                    break;
                case 'MeshBasicMaterial':
                    newMaterial = new MeshBasicMaterial(materialParams)
                    break;
                case 'MeshMatcapMaterial':
                    newMaterial = new MeshMatcapMaterial(materialParams)
                    break;
                case 'MeshNormalMaterial':
                    newMaterial = new MeshNormalMaterial(materialParams)
                    break;
                case 'MeshPhongMaterial':
                    newMaterial = new MeshPhongMaterial(materialParams)
                    break;
                case 'MeshStandardMaterial':
                    newMaterial = new MeshStandardMaterial(materialParams)
                    break;
                case 'MeshLambertMaterial':
                    newMaterial = new MeshLambertMaterial(materialParams)
                    break;
                default:
                    newMaterial = new MeshPhysicalMaterial(materialParams)
            }
            if(mesh.material instanceof Array) {
                mesh.material[mesh.material.indexOf(material)] = newMaterial
            } else {
                mesh.material = newMaterial
            }
            callback()
        })
    }
}