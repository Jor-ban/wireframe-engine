import {CubeTextureLoader, sRGBEncoding} from "three";

const negY = require("./assets/skybox/sky_negY.jpg");
const negX = require("./assets/skybox/sky_negX.jpg");
const posY = require("./assets/skybox/sky_posY.jpg");
const posX = require("./assets/skybox/sky_posX.jpg");
const posZ = require("./assets/skybox/sky_posZ.jpg");
const negZ = require("./assets/skybox/sky_negZ.jpg");

export const defaultSkyboxSides = [posX, negX, posY, negY, posZ, negZ]
export const CubeTextureLoaderService = new CubeTextureLoader()
export const defaultSkybox = CubeTextureLoaderService.load(defaultSkyboxSides)
defaultSkybox.encoding = sRGBEncoding