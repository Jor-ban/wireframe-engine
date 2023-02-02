// @ts-ignore
import { Texture } from "three";
import { WireframeTextureLoader } from "../loaders";
import white from "../assets/white.png?url";

export let defaultMapTexture: Texture
export let whiteTexture: Texture
(async function() {
    defaultMapTexture = await WireframeTextureLoader.loadAsync(white)
    whiteTexture = await WireframeTextureLoader.loadAsync(white)
})()