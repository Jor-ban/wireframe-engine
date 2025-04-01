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
    MeshDepthMaterialParameters,
    MeshToonMaterialParameters,
    MeshBasicMaterialParameters,
    MeshMatcapMaterialParameters,
    MeshNormalMaterialParameters,
    MeshPhongMaterialParameters,
    MeshStandardMaterialParameters, MeshLambertMaterialParameters, MeshPhysicalMaterialParameters,
} from 'three';
import { FolderApi, TabPageApi } from "tweakpane";
import {
    AddOperation, BasicDepthPacking,
    MixOperation,
    MultiplyOperation,
    ObjectSpaceNormalMap, RGBADepthPacking, Side,
    TangentSpaceNormalMap,
} from 'three/src/constants';
import { WMesh } from "⚙️/lib";
import { FileInputField } from '⚙️/devEngine/utils/fileInputField';

export class MaterialControlsUtil {
    static addForMaterial(material: Material, folder: FolderApi | TabPageApi) {
        material.needsUpdate = true
        folder.addBinding(material, 'transparent')
        folder.addBinding(material, 'opacity', {min: 0, max: 1})
            .on('change', ({value}) => {
                material.opacity = value
            })
        folder.addBinding(material, 'visible')
        folder.addBinding({side: 0}, 'side', {
            options: {
                'FrontSide': FrontSide,
                'BackSide': BackSide,
                'DoubleSide': DoubleSide,
            }
        }).on('change', ({value}) => {
            material.side = value as Side
        })
        folder.addBinding(material, 'clipIntersection')
        folder.addBinding(material, 'clipShadows')
        folder.addBinding(material, 'colorWrite')
    }
    static addDetails(material: Material, folder: FolderApi | TabPageApi) {
        // TODO add clippingPlanes : Plane
        // TODO add depthFunc: DepthModes
        folder.addBinding(material, 'depthTest')
        folder.addBinding(material, 'depthWrite')
        folder.addBinding(material, 'alphaTest', {min: 0, max: 1})
        folder.addBinding(material, 'alphaToCoverage')
        // TODO add blendDst : BlendingDsrFactor & blendDstAlpha ; number & blendEquation : BlendingEquation & blendEquationAlpha : number
        // TODO add blending : Blending & blendSrc : BlendingSrcFactor | BlendingDsrFactor & blendSrcAlpha : number
        folder.addBinding(material, 'polygonOffset')
        folder.addBinding(material, 'polygonOffsetFactor')
        folder.addBinding(material, 'polygonOffsetUnits')
        folder.addBinding({precision: 0}, 'precision', {
            options: {
                'null': 0,
                'highp': 1,
                'mediump': 2,
                'lowp': 3
            }
        }).on('change', ({value}) => {
            material.precision = value === 0 ? null : value === 1 ? 'highp' : value === 2 ? 'mediump' : 'lowp'
        })
        folder.addBinding(material, 'toneMapped')
        folder.addBinding(material, 'vertexColors')
        // TODO add format : PixelFormat
        folder.addBinding(material, 'stencilWrite')
        // TODO add stencilFunc: StencilFunc
        folder.addBinding(material, 'stencilRef')
        folder.addBinding(material, 'stencilWriteMask')
        folder.addBinding(material, 'stencilFuncMask')
        // TODO add stencilFail : StencilOp & stencilZFail : StencilOp & stencilZPass : StencilOp
    }
    static addForToonMaterial(material: MeshToonMaterial, folder: FolderApi) {
        // TODO add onchange event
        this.addForColor(material, folder)
        folder.addBlade({ view: 'separator' }) // -------------------------------------------------
        this.addForMap(material, folder)
        folder.addBlade({ view: 'separator' }) // -------------------------------------------------
        this.addForGradientMap(material, folder)
        folder.addBlade({ view: 'separator' }) // -------------------------------------------------
        this.addForLightMap(material, folder)
        folder.addBinding(material, 'lightMapIntensity')
        folder.addBlade({ view: 'separator' })   // -------------------------------------------------
        this.addForAoMap(material, folder)
        folder.addBinding(material, 'aoMapIntensity')
        folder.addBlade({ view: 'separator' })   // -------------------------------------------------
        this.addForEmissiveMap(material, folder)
        folder.addBinding(material, 'emissiveIntensity')
        folder.addBlade({ view: 'separator' })   // -------------------------------------------------
        this.addForBumpMap(material, folder)
        folder.addBinding(material, 'bumpScale')
        folder.addBlade({ view: 'separator' })   // -------------------------------------------------
        this.addForNormalMap(material, folder)
        this.addForNormalMapTypes(material, folder)
        folder.addBinding(material, 'normalScale')
        folder.addBlade({ view: 'separator' })   // -------------------------------------------------
        this.addForDisplacementMap(material, folder)
        folder.addBinding(material, 'displacementScale')
        folder.addBinding(material, 'displacementBias')
        folder.addBlade({ view: 'separator' }) // -------------------------------------------------
        this.addForAlphaMap(material, folder)
        folder.addBlade({ view: 'separator' }) // --------------------------------------------
        folder.addBinding(material, 'wireframe')
        folder.addBinding(material, 'wireframeLinewidth')
        folder.addBinding(material, 'wireframeLinecap')
        folder.addBinding(material, 'wireframeLinejoin')
    }
    static addForMatcapMaterial(material: MeshMatcapMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------------------------
        this.addForMap(material, folder)
        folder.addBlade({ view: 'separator' }) // --------------------------------
        this.addForMatcap(material, folder)
        folder.addBlade({ view: 'separator' }) // --------------------------------
        this.addForBumpMap(material, folder)
        folder.addBinding(material, 'bumpScale')
        folder.addBlade({ view: 'separator' })   // ---------------------------------
        this.addForNormalMap(material, folder)
        folder.addBinding(material, 'normalScale')
        folder.addBlade({ view: 'separator' })   // ------------------------------------
        this.addForDisplacementMap(material, folder)
        folder.addBinding(material, 'displacementScale')
        folder.addBinding(material, 'displacementBias')
        folder.addBlade({ view: 'separator' })   // ----------------------------------
        this.addForAlphaMap(material, folder)
        folder.addBlade({ view: 'separator' }) // -----------------------------------
        folder.addBinding(material, 'flatShading')
    }
    static addForNormalMaterial(material: MeshNormalMaterial, folder: FolderApi) {
        this.addForNormalMap(material, folder)
        folder.addBinding(material, 'normalScale')
        this.addForNormalMapTypes(material, folder)
        folder.addBlade({ view: 'separator' }) // ----------------------------------
        this.addForBumpMap(material, folder)
        folder.addBinding(material, 'bumpScale')
        folder.addBlade({ view: 'separator' }) // ----------------------------------
        this.addForDisplacementMap(material, folder)
        folder.addBinding(material, 'displacementScale')
        folder.addBinding(material, 'displacementBias')
        folder.addBlade({ view: 'separator' })   // -------------------------------
        folder.addBinding(material, 'wireframe')
        folder.addBinding(material, 'wireframeLinewidth')
        folder.addBinding(material, 'flatShading')
    }
    static addForPhongMaterial(material: MeshPhongMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        this.addForSpecular(material, folder)
        folder.addBinding(material, 'shininess')
        folder.addBinding(material, 'reflectivity')
        folder.addBinding(material, 'refractionRatio')
        folder.addBlade({ view: 'separator' })   // ------------------------------
        this.addForMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForLightMap(material, folder)
        folder.addBinding(material, 'lightMapIntensity')
        folder.addBlade({ view: 'separator' }) // --------------------------------
        this.addForAoMap(material, folder)
        folder.addBinding(material, 'aoMapIntensity')
        folder.addBlade({ view: 'separator' })   // -----------------------------
        this.addForEmissiveMap(material, folder)
        folder.addBinding(material, 'emissiveIntensity')
        folder.addBlade({ view: 'separator' })   // ----------------------------
        this.addForBumpMap(material, folder)
        folder.addBinding(material, 'bumpScale')
        folder.addBlade({ view: 'separator' })   // ------------------------------
        this.addForNormalMap(material, folder)
        this.addForNormalMapTypes(material, folder)
        folder.addBinding(material, 'normalScale')
        folder.addBlade({ view: 'separator' })   // -----------------------------
        this.addForDisplacementMap(material, folder)
        folder.addBinding(material, 'displacementScale')
        folder.addBinding(material, 'displacementBias')
        folder.addBlade({ view: 'separator' })   // -----------------------------
        this.addForSpecularMap(material, folder)
        folder.addBlade({ view: 'separator' }) // -----------------------------
        this.addForEnvMap(material, folder)
        folder.addBlade({ view: 'separator' }) // --------------------------
        this.addForAlphaMap(material, folder)
        folder.addBlade({ view: 'separator' }) // --------------------------
        this.addForCombine(material, folder)
        folder.addBinding(material, 'wireframe')
        folder.addBinding(material, 'wireframeLinewidth')
        folder.addBinding(material, 'wireframeLinejoin')
        folder.addBinding(material, 'flatShading')
    }
    static addForDepthMaterial(material: MeshDepthMaterial, folder: FolderApi) {
        this.addForMap(material, folder)
        folder.addBlade({ view: 'separator' }) // -------------------------------------------------
        this.addForAlphaMap(material, folder)
        folder.addBlade({ view: 'separator' }) // -------------------------------------------------
        this.addForDisplacementMap(material, folder)
        folder.addBinding(material, 'displacementScale')
        folder.addBinding(material, 'displacementBias')
        folder.addBlade({ view: 'separator' }) // -------------------------------------------------
        folder.addBinding({depthPacking: material.depthPacking}, 'depthPacking', {
            options: {
                'Basic': BasicDepthPacking,
                'RGBA': RGBADepthPacking,
            }
        }).on('change', ({value}) => {
                material.depthPacking = value
            })
        folder.addBinding(material, 'wireframe')
        folder.addBinding(material, 'wireframeLinewidth')
    }
    static addForBasicMaterial(material: MeshBasicMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        folder.addBinding(material, 'reflectivity')
        folder.addBinding(material, 'refractionRatio')
        folder.addBlade({ view: 'separator' }) // -------------------------------------
        this.addForMap(material, folder)
        folder.addBlade({ view: 'separator' }) // -------------------------------------
        this.addForAoMap(material, folder)
        folder.addBinding(material, 'aoMapIntensity')
        folder.addBlade({ view: 'separator' })   // -----------------------------------
        this.addForLightMap(material, folder)
        folder.addBinding(material, 'lightMapIntensity')
        folder.addBlade({ view: 'separator' })   // -----------------------------------
        this.addForAlphaMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------------
        this.addForSpecularMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------------
        this.addForEnvMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ---------------------------------
        this.addForCombine(material, folder)
        folder.addBinding(material, 'wireframe')
        folder.addBinding(material, 'wireframeLinewidth')
        folder.addBinding(material, 'wireframeLinecap')
        folder.addBinding(material, 'wireframeLinejoin')
    }
    static addForStandardMaterial(material: MeshStandardMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        folder.addBinding(material, 'roughness')
        folder.addBinding(material, 'metalness')
        folder.addBlade({ view: 'separator' }) // ----------------------------------
        this.addForMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ---------------------------------
        this.addForLightMap(material, folder)
        folder.addBinding(material, 'lightMapIntensity')
        folder.addBlade({ view: 'separator' })   // -------------------------------
        this.addForAoMap(material, folder)
        folder.addBinding(material, 'aoMapIntensity')
        folder.addBlade({ view: 'separator' })   // -------------------------------
        this.addForEmissiveMap(material, folder)
        folder.addBinding(material, 'emissiveIntensity')
        this.addForEmissiveMap(material, folder)
        folder.addBlade({ view: 'separator' }) // -----------------------------
        this.addForBumpMap(material, folder)
        folder.addBlade({ view: 'separator' })   // ----------------------------
        this.addForDisplacementMap(material, folder)
        folder.addBinding(material, 'displacementScale')
        folder.addBinding(material, 'displacementBias')
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForRoughnessMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForMetalnessMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForAlphaMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForEnvMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForNormalMapTypes(material, folder)
        folder.addBinding(material, 'normalScale')
        folder.addBinding(material, 'envMapIntensity')
        folder.addBinding(material, 'wireframe')
        folder.addBinding(material, 'wireframeLinewidth')
        folder.addBinding(material, 'flatShading')
    }
    static addForLambertMaterial(material: MeshLambertMaterial, folder: FolderApi) {
        this.addForColor(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForEmissiveMap(material, folder)
        folder.addBinding(material, 'emissiveIntensity')
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForAoMap(material, folder)
        folder.addBinding(material, 'aoMapIntensity')
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForLightMap(material, folder)
        folder.addBinding(material, 'lightMapIntensity')
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForAlphaMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForSpecularMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForEnvMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        this.addForCombine(material, folder)
        folder.addBinding(material, 'reflectivity')
        folder.addBinding(material, 'refractionRatio')
        folder.addBinding(material, 'wireframe')
        folder.addBinding(material, 'wireframeLinewidth')
        folder.addBinding(material, 'wireframeLinecap')
        folder.addBinding(material, 'wireframeLinejoin')
    }
    static addForPhysicalMaterial(material: MeshPhysicalMaterial, folder: FolderApi) {
        this.addForStandardMaterial(material as MeshStandardMaterial, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        folder.addBinding(material, 'clearcoat')
        this.addForClearcoatMap(material, folder)
        folder.addBlade({ view: 'separator' }) // ------------------------------
        FileInputField.addMapable(material, folder, 'clearcoatRoughnessMap')
        folder.addBinding(material, 'clearcoatRoughness')
        FileInputField.addMapable(material, folder, 'clearcoatNormalMap')
        folder.addBlade({ view: 'separator' })   // -----------------------------
        FileInputField.addMapable(material, folder, 'transmissionMap')
        folder.addBinding(material, 'transmission')
        folder.addBlade({ view: 'separator' })   // -----------------------------
        folder.addBinding(material, 'specularIntensity')
        this.addForSpecularColor(material, folder)
        FileInputField.addMapable(material, folder, 'specularIntensityMap')
        FileInputField.addMapable(material, folder, 'specularColorMap')
        folder.addBlade({ view: 'separator' })   // -----------------------------
        folder.addBinding(material, 'reflectivity')
        folder.addBinding(material, 'ior')
        folder.addBinding(material, 'sheen')
        this.addForSheenColor(material, folder)
        folder.addBinding(material, 'sheenRoughness')
        folder.addBinding(material, 'attenuationDistance')
        this.addForAttenuationColor(material, folder)
    }

    private static addForNormalMapTypes(material:
        | MeshToonMaterial
        | MeshNormalMaterial
        | MeshPhongMaterial
        | MeshStandardMaterial,
        folder: FolderApi
    ) {
        folder.addBinding({ 'Normal Map Type':  material.normalMapType }, 'Normal Map Type', {
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
        | MeshLambertMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        folder.addBinding({ combine: material.combine }, 'combine', {
            options: {
                'Multiply': MultiplyOperation,
                'Mix': MixOperation,
                'Add': AddOperation
            }
        }).on('change', ({value}) => {
            material.combine = value
        })
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
        FileInputField.addMapable(material, folder, 'map')
    }
    private static addForGradientMap(material: MeshToonMaterial, folder: FolderApi) {
        FileInputField.addMapable(material, folder, 'gradientMap')
    }
    private static addForLightMap(material:
        | MeshToonMaterial
        | MeshBasicMaterial
        | MeshStandardMaterial
        | MeshLambertMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        FileInputField.addMapable(material, folder, 'lightMap')
    }
    private static addForAoMap(material:
        | MeshStandardMaterial
        | MeshToonMaterial
        | MeshBasicMaterial
        | MeshLambertMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        FileInputField.addMapable(material, folder, 'aoMap')
    }
    private static addForBumpMap(material:
        | MeshToonMaterial
        | MeshNormalMaterial
        | MeshMatcapMaterial
        | MeshStandardMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        FileInputField.addMapable(material, folder, 'bumpMap')
    }
    private static addForNormalMap(material:
        | MeshToonMaterial
        | MeshNormalMaterial
        | MeshPhongMaterial
        | MeshMatcapMaterial,
        folder: FolderApi
    ) {
        FileInputField.addMapable(material, folder, 'normalMap')
    }
    private static addForDisplacementMap(material:
        | MeshToonMaterial
        | MeshNormalMaterial
        | MeshDepthMaterial
        | MeshPhongMaterial
        | MeshStandardMaterial
        | MeshMatcapMaterial,
        folder: FolderApi
    ) {
        FileInputField.addMapable(material, folder, 'displacementMap')
    }
    private static addForAlphaMap(material:
        | MeshStandardMaterial
        | MeshToonMaterial
        | MeshPhongMaterial
        | MeshBasicMaterial
        | MeshDepthMaterial
        | MeshLambertMaterial
        | MeshMatcapMaterial,
        folder: FolderApi) {
        FileInputField.addMapable(material, folder, 'alphaMap')
    }
    private static addForMatcap(material: MeshMatcapMaterial, folder: FolderApi) {
        FileInputField.addMapable(material, folder, 'matcap')
    }
    private static addForMetalnessMap(material: MeshStandardMaterial, folder: FolderApi) {
        FileInputField.addMapable(material, folder, 'metalnessMap')
    }
    private static addForSpecularMap(material:
        | MeshBasicMaterial
        | MeshLambertMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        FileInputField.addMapable(material, folder, 'specularMap')
    }
    private static addForRoughnessMap(material:
        | MeshStandardMaterial
        | MeshPhysicalMaterial,
        folder: FolderApi
    ) {
        FileInputField.addMapable(material, folder, 'roughnessMap')
    }
    private static addForEnvMap(material:
        | MeshStandardMaterial
        | MeshBasicMaterial
        | MeshLambertMaterial
        | MeshPhongMaterial,
        folder: FolderApi
    ) {
        FileInputField.addMapable(material, folder, 'envMap')
    }
    private static addForClearcoatMap(material: MeshPhysicalMaterial, folder: FolderApi) {
        FileInputField.addMapable(material, folder, 'clearcoatMap')
    }


    private static addColorable<T extends Material>(material: T, folder: FolderApi, colorName: keyof T) {
        const color = material[colorName] as unknown as Color
        const headerName: string = typeof colorName === 'string' ? colorName : 'color'
        const obj: {[key: string]: string} = {}
        obj[headerName] = '#' + color.getHexString()
        folder.addBinding(obj, headerName)
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
        FileInputField.addMapable(material, folder, 'emissive')
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

    static materialConverter(material: Material, mesh: WMesh, folder: FolderApi | TabPageApi, callback: () => void) {
        folder.addBinding({'Change Material Type': material.type}, 'Change Material Type', {
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