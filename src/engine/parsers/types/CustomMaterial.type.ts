import {
    MeshBasicMaterialParameters,
    MeshDepthMaterialParameters,
    MeshLambertMaterialParameters,
    MeshMatcapMaterialParameters,
    MeshNormalMaterialParameters, MeshPhongMaterialParameters, MeshPhysicalMaterialParameters,
    MeshStandardMaterialParameters,
    MeshToonMaterialParameters,
} from "three";

export type CustomMaterial = (
    MeshToonMaterialParameters &
    MeshDepthMaterialParameters &
    MeshBasicMaterialParameters &
    MeshLambertMaterialParameters &
    MeshMatcapMaterialParameters &
    MeshNormalMaterialParameters &
    MeshPhongMaterialParameters &
    MeshStandardMaterialParameters &
    MeshPhysicalMaterialParameters ) & {
        type?: 'toon' | 'depth' | 'basic' | 'lambert' | 'matcap' | 'normal' | 'phong' | 'standard' | 'physical'
    }
