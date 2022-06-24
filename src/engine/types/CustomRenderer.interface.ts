import {ShadowMapType, TextureEncoding, ToneMapping} from "three";

export interface CustomRenderer {
    antialias ?: boolean
    physicallyCorrectLights ?: boolean
    encoding ?: TextureEncoding
    toneMapping ?:ToneMapping
    toneMappingExposure ?: number
    shadowMap ?: boolean
    shadowMapType ?: ShadowMapType
    pixelRatio ?: number
}