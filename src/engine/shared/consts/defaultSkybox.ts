import {CubeTextureLoader} from "three";

import negY from "../assets/skybox/sky_negY.jpg?url"
import negX from "../assets/skybox/sky_negX.jpg?url"
import posY from "../assets/skybox/sky_posY.jpg?url"
import posX from "../assets/skybox/sky_posX.jpg?url"
import posZ from "../assets/skybox/sky_posZ.jpg?url"
import negZ from "../assets/skybox/sky_negZ.jpg?url"

export const defaultSkyboxSides = [posX, negX, posY, negY, posZ, negZ]
export const CubeTextureLoaderService = new CubeTextureLoader()
export const defaultSkybox = CubeTextureLoaderService.load(defaultSkyboxSides)