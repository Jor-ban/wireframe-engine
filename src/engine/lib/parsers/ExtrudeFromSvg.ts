import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import {ExtrudeGeometry, Group, Material} from "three";
import {WMesh} from "⚙️/lib";
import {MaterialJson} from "⚙️/lib/parsers/types/MaterialJson.type";
import {MeshParser} from "⚙️/lib/parsers/MeshParser";
import {ExtrudeGeometryOptions} from "three/src/geometries/ExtrudeGeometry";

const loader = new SVGLoader();

export class ExtrudeFromSvg {
    static parse(svgContent: string, extrudeOptions?: ExtrudeGeometryOptions, material?: Material | MaterialJson): Group {
        const svgData = loader.parse(svgContent);
        const svgGroup = new Group();
        svgGroup.scale.y *= -1;

        const svgMaterial = MeshParser.parseMaterial(material)

        svgData.paths.forEach((path) => {
            const shapes = path.toShapes(true);

            shapes.forEach((shape) => {
                const geometry = new ExtrudeGeometry(shape, extrudeOptions);
                const mesh = new WMesh(geometry, svgMaterial);

                svgGroup.add(mesh);
            });
        });
        return svgGroup
    }
    static parseFromUrl(url: string): Promise<Group> {
        return fetch(url)
            .then(res => res.text())
            .then(svgContent => this.parse(svgContent))
    }
}