import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import {ExtrudeGeometry, Group, Material} from "three";
import {WMesh} from "⚙️/lib";
import {MaterialJson} from "⚙️/lib/parsers/types/MaterialJson.type";
import {MeshParser} from "⚙️/lib/parsers/MeshParser";
import {ExtrudeGeometryOptions} from "three/src/geometries/ExtrudeGeometry";
import {ExtrudeFromSvgJson} from "⚙️/lib/parsers/types/ExtrudeFromSvgJson.type";

const loader = new SVGLoader();

export class ExtrudeFromSvgParser {
    static parse(json: ExtrudeFromSvgJson): Promise<Group> {
        return new Promise((resolve) => {
            if(json.svgContent) {
                resolve(this.parseFromSvg(json.svgContent, json.extrudeOptions, json.material))
            } else if(json.url) {
                this.parseFromUrl(json.url, json.extrudeOptions, json.material).then(resolve)
            } else {
                throw new Error("[ExtrudeFromSvg -> parse]: Cannot parse svg without url or svgContent")
            }
        }).then((group: Group) => {
            MeshParser.setParameters(group, json.parameters)
            return group
        })
    }
    static parseFromSvg(svgContent: string, extrudeOptions?: ExtrudeGeometryOptions, material?: Material | MaterialJson): Group {
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
    static parseFromUrl(url: string, extrudeOptions?: ExtrudeGeometryOptions, material?: Material | MaterialJson): Promise<Group> {
        return fetch(url)
            .then(res => res.text())
            .then(svgContent => this.parseFromSvg(svgContent, extrudeOptions, material))
    }
}