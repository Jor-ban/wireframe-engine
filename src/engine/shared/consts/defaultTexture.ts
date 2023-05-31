import { Texture } from "three";
import { WireframeLoaders } from "../loaders";
import white from "../assets/white.png?url";

export let defaultMapTexture: Texture
export let whiteTexture: Texture
(async function() {
    defaultMapTexture = await WireframeLoaders.textureLoader.loadAsync(white)
    whiteTexture = await WireframeLoaders.textureLoader.loadAsync(white)
})()
