import {ShadowMapType, TextureEncoding, ToneMapping} from "three";

export type RendererJson = {
    antialias ?: boolean
    physicallyCorrectLights ?: boolean
    encoding ?: TextureEncoding
    toneMapping ?:ToneMapping
    toneMappingExposure ?: number
    shadowMap ?: boolean
    shadowMapType ?: ShadowMapType
    pixelRatio ?: number
    alpha ?: boolean
}