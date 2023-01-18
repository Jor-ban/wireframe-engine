import {CubeTextureLoader, sRGBEncoding} from "three";

import negY from "./assets/skybox/sky_negY.jpg"
import negX from "./assets/skybox/sky_negX.jpg"
import posY from "./assets/skybox/sky_posY.jpg"
import posX from "./assets/skybox/sky_posX.jpg"
import posZ from "./assets/skybox/sky_posZ.jpg"
import negZ from "./assets/skybox/sky_negZ.jpg"

export const defaultSkyboxSides = [posX, negX, posY, negY, posZ, negZ]
export const CubeTextureLoaderService = new CubeTextureLoader()
export const defaultSkybox = CubeTextureLoaderService.load(defaultSkyboxSides)
defaultSkybox.encoding = sRGBEncoding