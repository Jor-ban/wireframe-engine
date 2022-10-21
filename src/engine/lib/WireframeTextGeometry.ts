import {TextGeometry, TextGeometryParameters} from "three/examples/jsm/geometries/TextGeometry";

export class WireframeTextGeometry extends TextGeometry {
    text: string;
    constructor(text: string, parameters: TextGeometryParameters) {
        super(text, parameters);
        this.text = text;
    }
}