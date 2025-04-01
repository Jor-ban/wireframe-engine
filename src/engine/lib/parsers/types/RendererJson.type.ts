import {ShadowMapType, ToneMapping} from "three";

export type RendererJson = {
    antialias ?: boolean
    physicallyCorrectLights ?: boolean
    toneMapping ?:ToneMapping
    toneMappingExposure ?: number
    shadowMap ?: boolean
    shadowMapType ?: ShadowMapType
    pixelRatio ?: number
    alpha ?: boolean
}