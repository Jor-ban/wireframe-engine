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
    Mesh,
    Texture,
    MeshDepthMaterialParameters,
    MeshToonMaterialParameters,
    MeshBasicMaterialParameters,
    MeshMatcapMaterialParameters,
    MeshNormalMaterialParameters,
    MeshPhongMaterialParameters,
    MeshStandardMaterialParameters, MeshLambertMaterialParameters, MeshPhysicalMaterialParameters,
} from 'three';
import {FolderApi} from "tweakpane";
import { TxLoader } from '../../shared/textureLoader';
// @ts-ignore
import white from './assets/white.png'
import {
    AddOperation, BasicDepthPacking,
    MixOperation,
    MultiplyOperation,
    ObjectSpaceNormalMap, RGBADepthPacking,
    TangentSpaceNormalMap,
} from 'three/src/constants';

export let defaultMapTexture: Texture
(async function() {
   defaultMapTexture = await TxLoader.loadAsync(white)
})()

export class MaterialControlsUtil {
    static addForMaterial(material: Material, folder: FolderApi) {
        material.needsUpdate = true
        folder.addInput(material, 'transparent')
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
        const details = folder.addFolder({ title: 'Material details', expanded: false })
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
        // TODO add onchange event
        this.addForColor(material, folder)
        folder.addSeparator() // -------------------------------------------------
        this.addForMap(material, folder)
        folder.addSeparator() // -------------------------------------------------
        this.addForGradientMap(material, folder)
        folder.addSeparator() // -------------------------------------------------
        this.addForLightMap(material, folder)
        folder.addInput(material, 'lightMapIntensity')
        folder.addSeparator()   // -------------------------------------------------
        this.addForAoMap(material, folder)
        folder.addInput(material, 'aoMapIntensity')
        folder.addSeparator()   // -------------------------------------------------
        this.addForEmissiveMap(material, folder)
        folder.addInput(material, 'emissiveIntensity')
        folder.addSeparator()   // -------------------------------------------------
        this.addForBumpMap(material, folder)
        folder.addInput(material, 'bumpScale')
        folder.addSeparator()   // -------------------------------------------------
        this.addForNormalMap(material, folder)
        this.addForNormalMapTypes(material, folder)
        folder.addInput(material, 'normalScale')
        folder.addSeparator()   // -------------------------------------------------
        this.addForDisplacementMap(material, folder)
        folder.addInput(material, 'displacementScale')
        folder.addInput(material, 'displacementBias')
        folder.addSeparator() // -------------------------------------------------
        this.addForAlphaMap(material, folder)
        folder.addSeparator() // --------------------------------------------
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'wireframeLinecap')
        folder.addInput(material, 'wireframeLinejoin')
    }
    static addForMatcapMaterial(material: MeshMatcapMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        folder.addSeparator() // ------------------------------------------------
        this.addForMap(material, folder)
        folder.addSeparator() // --------------------------------
        this.addForMatcap(material, folder)
        folder.addSeparator() // --------------------------------
        this.addForBumpMap(material, folder)
        folder.addInput(material, 'bumpScale')
        folder.addSeparator()   // ---------------------------------
        this.addForNormalMap(material, folder)
        folder.addInput(material, 'normalScale')
        folder.addSeparator()   // ------------------------------------
        this.addForDisplacementMap(material, folder)
        folder.addInput(material, 'displacementScale')
        folder.addInput(material, 'displacementBias')
        folder.addSeparator()   // ----------------------------------
        this.addForAlphaMap(material, folder)
        folder.addSeparator() // -----------------------------------
        folder.addInput(material, 'flatShading')
    }
    static addForNormalMaterial(material: MeshNormalMaterial, folder: FolderApi) {
        this.addForNormalMap(material, folder)
        folder.addInput(material, 'normalScale')
        this.addForNormalMapTypes(material, folder)
        folder.addSeparator() // ----------------------------------
        this.addForBumpMap(material, folder)
        folder.addInput(material, 'bumpScale')
        folder.addSeparator() // ----------------------------------
        this.addForDisplacementMap(material, folder)
        folder.addInput(material, 'displacementScale')
        folder.addInput(material, 'displacementBias')
        folder.addSeparator()   // -------------------------------
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'flatShading')
    }
    static addForPhongMaterial(material: MeshPhongMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        this.addForSpecular(material, folder)
        folder.addInput(material, 'shininess')
        folder.addInput(material, 'reflectivity')
        folder.addInput(material, 'refractionRatio')
        folder.addSeparator()   // ------------------------------
        this.addForMap(material, folder)
        folder.addSeparator() // ------------------------------
        this.addForLightMap(material, folder)
        folder.addInput(material, 'lightMapIntensity')
        folder.addSeparator() // --------------------------------
        this.addForAoMap(material, folder)
        folder.addInput(material, 'aoMapIntensity')
        folder.addSeparator()   // -----------------------------
        this.addForEmissiveMap(material, folder)
        folder.addInput(material, 'emissiveIntensity')
        folder.addSeparator()   // ----------------------------
        this.addForBumpMap(material, folder)
        folder.addInput(material, 'bumpScale')
        folder.addSeparator()   // ------------------------------
        this.addForNormalMap(material, folder)
        this.addForNormalMapTypes(material, folder)
        folder.addInput(material, 'normalScale')
        folder.addSeparator()   // -----------------------------
        this.addForDisplacementMap(material, folder)
        folder.addInput(material, 'displacementScale')
        folder.addInput(material, 'displacementBias')
        folder.addSeparator()   // -----------------------------
        this.addForSpecularMap(material, folder)
        folder.addSeparator() // -----------------------------
        this.addForEnvMap(material, folder)
        folder.addSeparator() // --------------------------
        this.addForAlphaMap(material, folder)
        folder.addSeparator() // --------------------------
        this.addForCombine(material, folder)
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'wireframeLinejoin')
        folder.addInput(material, 'flatShading')
    }
    static addForDepthMaterial(material: MeshDepthMaterial, folder: FolderApi) {
        this.addForMap(material, folder)
        folder.addSeparator() // -------------------------------------------------
        this.addForAlphaMap(material, folder)
        folder.addSeparator() // -------------------------------------------------
        this.addForDisplacementMap(material, folder)
        folder.addInput(material, 'displacementScale')
        folder.addInput(material, 'displacementBias')
        folder.addSeparator() // -------------------------------------------------
        folder.addInput({depthPacking: material.depthPacking}, 'depthPacking', {
            options: {
                'Basic': BasicDepthPacking,
                'RGBA': RGBADepthPacking,
            }
        }).on('change', ({value}) => {
                material.depthPacking = value
            })
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
    }
    static addForBasicMaterial(material: MeshBasicMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        folder.addInput(material, 'reflectivity')
        folder.addInput(material, 'refractionRatio')
        folder.addSeparator() // -------------------------------------
        this.addForMap(material, folder)
        folder.addSeparator() // -------------------------------------
        this.addForAoMap(material, folder)
        folder.addInput(material, 'aoMapIntensity')
        folder.addSeparator()   // -----------------------------------
        this.addForLightMap(material, folder)
        folder.addInput(material, 'lightMapIntensity')
        folder.addSeparator()   // -----------------------------------
        this.addForAlphaMap(material, folder)
        folder.addSeparator() // ------------------------------------
        this.addForSpecularMap(material, folder)
        folder.addSeparator() // ------------------------------------
        this.addForEnvMap(material, folder)
        folder.addSeparator() // ---------------------------------
        this.addForCombine(material, folder)
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'wireframeLinecap')
        folder.addInput(material, 'wireframeLinejoin')
    }
    static addForStandardMaterial(material: MeshStandardMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        folder.addInput(material, 'roughness')
        folder.addInput(material, 'metalness')
        folder.addSeparator() // ----------------------------------
        this.addForMap(material, folder)
        folder.addSeparator() // ---------------------------------
        this.addForLightMap(material, folder)
        folder.addInput(material, 'lightMapIntensity')
        folder.addSeparator()   // -------------------------------
        this.addForAoMap(material, folder)
        folder.addInput(material, 'aoMapIntensity')
        folder.addSeparator()   // -------------------------------
        this.addForEmissiveMap(material, folder)
        folder.addInput(material, 'emissiveIntensity')
        this.addForEmissiveMap(material, folder)
        folder.addSeparator() // -----------------------------
        this.addForBumpMap(material, folder)
        folder.addSeparator()   // ----------------------------
        this.addForDisplacementMap(material, folder)
        folder.addInput(material, 'displacementScale')
        folder.addInput(material, 'displacementBias')
        folder.addSeparator() // ------------------------------
        this.addForRoughnessMap(material, folder)
        folder.addSeparator() // ------------------------------
        this.addForMetalnessMap(material, folder)
        folder.addSeparator() // ------------------------------
        this.addForAlphaMap(material, folder)
        folder.addSeparator() // ------------------------------
        this.addForEnvMap(material, folder)
        folder.addSeparator() // ------------------------------
        this.addForNormalMapTypes(material, folder)
        folder.addInput(material, 'normalScale')
        folder.addInput(material, 'envMapIntensity')
        folder.addInput(material, 'refractionRatio')
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'flatShading')
    }
    static addForLambertMaterial(material: MeshLambertMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        folder.addSeparator() // ------------------------------
        this.addForMap(material, folder)
        folder.addSeparator() // ------------------------------
        this.addForEmissiveMap(material, folder)
        folder.addInput(material, 'emissiveIntensity')
        folder.addSeparator() // ------------------------------
        this.addForAoMap(material, folder)
        folder.addInput(material, 'aoMapIntensity')
        folder.addSeparator() // ------------------------------
        this.addForLightMap(material, folder)
        folder.addInput(material, 'lightMapIntensity')
        folder.addSeparator() // ------------------------------
        this.addForAlphaMap(material, folder)
        folder.addSeparator() // ------------------------------
        this.addForSpecularMap(material, folder)
        folder.addSeparator() // ------------------------------
        this.addForEnvMap(material, folder)
        folder.addSeparator() // ------------------------------
        this.addForCombine(material, folder)
        folder.addInput(material, 'reflectivity')
        folder.addInput(material, 'refractionRatio')
        folder.addInput(material, 'wireframe')
        folder.addInput(material, 'wireframeLinewidth')
        folder.addInput(material, 'wireframeLinecap')
        folder.addInput(material, 'wireframeLinejoin')
    }
    static addForPhysicalMaterial(material: MeshPhysicalMaterial, folder: FolderApi) {
        this.addForStandardMaterial(material as MeshStandardMaterial, folder)
        folder.addSeparator() // ------------------------------
        folder.addInput(material, 'clearcoat')
        this.addForClearcoatMap(material, folder)
        folder.addSeparator() // ------------------------------
        this.addMapable(material, folder, 'clearcoatRoughnessMap')
        folder.addInput(material, 'clearcoatRoughness')
        this.addMapable(material, folder, 'clearcoatNormalMap')
        folder.addSeparator()   // -----------------------------
        this.addMapable(material, folder, 'transmissionMap')
        folder.addInput(material, 'transmission')
        folder.addSeparator()   // -----------------------------
        folder.addInput(material, 'specularIntensity')
        this.addForSpecularColor(material, folder)
        this.addMapable(material, folder, 'specularIntensityMap')
        this.addMapable(material, folder, 'specularColorMap')
        folder.addSeparator()   // -----------------------------
        folder.addInput(material, 'reflectivity')
        folder.addInput(material, 'ior')
        folder.addInput(material, 'sheen')
        this.addForSheenColor(material, folder)
        folder.addInput(material, 'sheenRoughness')
        folder.addInput(material, 'attenuationDistance')
        this.addForAttenuationColor(material, folder)
    }

    private static addForNormalMapTypes(material:
        | MeshToonMaterial
        | MeshNormalMaterial
        | MeshStandardMaterial,
        folder: FolderApi
    ) {
        folder.addInput({ 'Normal Map Type':  material.normalMapType }, 'Normal Map Type', {
            options: {
                'TangentSpaceNormalMap': TangentSpaceNormalMap,
                'ObjectSpaceNormalMap': ObjectSpaceNormalMap,
            }
        }).on('change', ({value}) => {
            material.normalMapType = value
        })
    }

    private static addForCombine(material:
        | MeshBasicMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        folder.addInput({ combine: material.combine }, 'combine', {
            options: {
                'Multiply': MultiplyOperation,
                'Mix': MixOperation,
                'Add': AddOperation
            }
        }).on('change', ({value}) => {
            material.combine = value
        })
    }

    private static addMapable<T extends Material>(material: T, folder: FolderApi, keyName: keyof T) {
        const obj: {[key: string | number | symbol]: string} = {}
        const workingMaterial = material as any
        obj.image = workingMaterial[keyName]?.image?.src || defaultMapTexture.image.src
        folder.addInput(obj, 'image', {
            view: 'input-image',
            label: keyName as string,
        }).on('change', async (change) => {
            const value = change.value as unknown as {src: string}
            if(value.src !== defaultMapTexture.image.src) {
                const texture = await TxLoader.loadAsync(value.src)
                workingMaterial[keyName] = texture
                material.needsUpdate = true
            }
        })
        folder.addInput({a: 0}, 'a', {
            view: 'radiogrid',
            groupName: 'scale',
            size: [1, 1],
            cells: () => ({
                title: '[X]',
            }),
            label: 'Remove',
        })
        .on('change', () => {
            workingMaterial[keyName] = null
            obj.image = defaultMapTexture.image.src
        })
        .element.classList.add('__tweakpane-delete-btn', '__tweakpane-material-deleter')
    }
    private static addForMap(material:
            | MeshToonMaterial
            | MeshMatcapMaterial
            | MeshBasicMaterial
            | MeshStandardMaterial
            | MeshLambertMaterial
            | MeshDepthMaterial
            | MeshPhongMaterial
            | MeshPhysicalMaterial,
         folder: FolderApi
    ) {
        this.addMapable(material, folder, 'map')
    }
    private static addForGradientMap(material: MeshToonMaterial, folder: FolderApi) {
        this.addMapable(material, folder, 'gradientMap')
    }
    private static addForLightMap(material:
        | MeshToonMaterial
        | MeshBasicMaterial
        | MeshStandardMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        this.addMapable(material, folder, 'lightMap')
    }
    private static addForAoMap(material:
        | MeshStandardMaterial
        | MeshToonMaterial
        | MeshBasicMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        this.addMapable(material, folder, 'aoMap')
    }
    private static addForBumpMap(material:
         | MeshToonMaterial
         | MeshNormalMaterial
         | MeshMatcapMaterial,
         folder: FolderApi
    ) {
        this.addMapable(material, folder, 'bumpMap')
    }
    private static addForNormalMap(material:
       | MeshToonMaterial
       | MeshNormalMaterial
       | MeshMatcapMaterial,
       folder: FolderApi
    ) {
        this.addMapable(material, folder, 'normalMap')
    }
    private static addForDisplacementMap(material:
        | MeshToonMaterial
        | MeshNormalMaterial
        | MeshDepthMaterial
        | MeshMatcapMaterial,
        folder: FolderApi
    ) {
        this.addMapable(material, folder, 'displacementMap')
    }
    private static addForAlphaMap(material:
        | MeshStandardMaterial
        | MeshToonMaterial
        | MeshPhongMaterial
        | MeshBasicMaterial
        | MeshDepthMaterial
        | MeshMatcapMaterial,
        folder: FolderApi) {
        this.addMapable(material, folder, 'alphaMap')
    }
    private static addForMatcap(material: MeshMatcapMaterial, folder: FolderApi) {
        this.addMapable(material, folder, 'matcap')
    }
    private static addForMetalnessMap(material: MeshStandardMaterial, folder: FolderApi) {
        this.addMapable(material, folder, 'metalnessMap')
    }
    private static addForSpecularMap(material:
        | MeshBasicMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        this.addMapable(material, folder, 'specularMap')
    }
    private static addForRoughnessMap(material:
        | MeshStandardMaterial
        | MeshPhysicalMaterial,
        folder: FolderApi
    ) {
        this.addMapable(material, folder, 'roughnessMap')
    }
    private static addForEnvMap(material:
        | MeshStandardMaterial
        | MeshBasicMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        this.addMapable(material, folder, 'envMap')
    }
    private static addForClearcoatMap(material: MeshPhysicalMaterial, folder: FolderApi) {
        this.addMapable(material, folder, 'clearcoatMap')
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
    private static addForEmissiveMap(material:
        | MeshToonMaterial
        | MeshLambertMaterial
        | MeshPhongMaterial
        | MeshStandardMaterial,
        folder: FolderApi
    ) {
        this.addMapable(material, folder, 'emissive')
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
                    newMaterial = new MeshDepthMaterial(materialParams as MeshDepthMaterialParameters)
                    break;
                case 'MeshToonMaterial':
                    newMaterial = new MeshToonMaterial(materialParams as MeshToonMaterialParameters)
                    break;
                case 'MeshBasicMaterial':
                    newMaterial = new MeshBasicMaterial(materialParams as MeshBasicMaterialParameters)
                    break;
                case 'MeshMatcapMaterial':
                    newMaterial = new MeshMatcapMaterial(materialParams as MeshMatcapMaterialParameters)
                    break;
                case 'MeshNormalMaterial':
                    newMaterial = new MeshNormalMaterial(materialParams as MeshNormalMaterialParameters)
                    break;
                case 'MeshPhongMaterial':
                    newMaterial = new MeshPhongMaterial(materialParams as MeshPhongMaterialParameters)
                    break;
                case 'MeshStandardMaterial':
                    newMaterial = new MeshStandardMaterial(materialParams as MeshStandardMaterialParameters)
                    break;
                case 'MeshLambertMaterial':
                    newMaterial = new MeshLambertMaterial(materialParams as MeshLambertMaterialParameters)
                    break;
                default:
                    newMaterial = new MeshPhysicalMaterial(materialParams as MeshPhysicalMaterialParameters)
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