import {Color} from "three";

type MaterialCommon = {
    opacity?: number
    depthTest?: boolean
    alphaTest?: number
    depthWrite?: boolean
    side?: 'frontSide' | 'backSide' | 'doubleSide'
}

export type CustomToonMaterial = {
    color?: string | Color
    map?: string
    gradientMap?: string
    alphaMap?: string
}

export type CustomDepthMaterial = MaterialCommon & {
    color?: string | Color
    opacity?: number
    depthTest?: boolean
    depthWrite?: boolean
    wireframe?: boolean
    fog?: boolean
}

export type CustomBasicMaterial = CustomDepthMaterial & {
    vertexColors?: boolean
    combine?: 'none' | 'multiply' | 'mix'
    reflectivity?: number
    refractionRatio?: number
    envMap?: string
    map?: string
    alphaMap?: string
}

export type CustomLambertMaterial = CustomBasicMaterial & {
    emissive?: string | Color
}

export type CustomMatcapMaterial = CustomDepthMaterial & {
    flatShading?: boolean
    matcap?: string
    alphaMap?: string
}

export type CustomNormalMaterial = MaterialCommon & {
    flatShading?: boolean
    wireframe?: boolean
}

export type CustomPhongMaterial = CustomLambertMaterial & CustomMatcapMaterial & {
    specular?: string | Color
    shininess?: number
}

export type CustomStandardMaterial = CustomLambertMaterial & CustomNormalMaterial & {
    roughness?: number
    roughnessMap: string
    metalness?: number
}

export type CustomPhysicalMaterial = CustomStandardMaterial & {
    reflectivity?: number
    clearcoat?: number
    clearcoatRoughness?: number
}

export type CustomMaterial = ( CustomToonMaterial |
    CustomDepthMaterial |
    CustomBasicMaterial |
    CustomLambertMaterial |
    CustomMatcapMaterial |
    CustomNormalMaterial |
    CustomPhongMaterial |
    CustomStandardMaterial |
    CustomPhysicalMaterial ) & {
        type: 'toon' | 'depth' | 'basic' | 'lambert' | 'matcap' | 'normal' | 'phong' | 'standard' | 'physical'
    }
