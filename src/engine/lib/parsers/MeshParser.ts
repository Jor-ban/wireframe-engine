import {
    BoxGeometry,
    BufferGeometry, CircleGeometry, ConeGeometry, CylinderGeometry, DodecahedronGeometry,
    Material, MeshBasicMaterial, MeshDepthMaterial,
    MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial,
    MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial,
    MeshToonMaterial,
    Object3D, PlaneGeometry, RingGeometry, SphereGeometry
} from "three";
import { MeshJson } from "./types/MeshJson.type";
import { MaterialJson } from "./types/MaterialJson.type";
import { GeometryJson } from "./types/GeometryJson.type";
import { TextGeometryParameters } from 'three/examples/jsm/geometries/TextGeometry';
import { LightParser } from "./lightParser";
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { WMesh } from "⚙️/lib";
import { WTextGeometry } from "⚙️/lib";
import { WireframeLoaders } from "⚙️/shared/loaders";
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { ParserDataType } from "⚙️/lib/guards/parser-data-type";
import { Object3dParser } from "⚙️/lib/parsers/Object3dParser";

export class MeshParser extends Object3dParser {
    public static parse(object: MeshJson): Promise<Object3D> {
        return new Promise<Object3D>((resolve) => {
            if (object instanceof Object3D) {
                resolve(object)
            } else if(ParserDataType.isJsonWithPath(object)) {
                WireframeLoaders.load3dObject(object.url)
                    .then(obj => this.setParameters(obj, object.parameters))
                    .then(resolve)
            } else {
                const mesh = new WMesh(
                    this.parseGeometry(object.geometry),
                    this.parseMaterial(object.material)
                )
                this.setParameters(mesh, object.parameters)
                if (object.uuid) {
                    mesh.uuid = object.uuid
                }
                resolve(mesh)
            }
        })
    }
    public static parseGeometry(geometry: BufferGeometry | GeometryJson | undefined): BufferGeometry {
        if(!geometry) {
            return new BoxGeometry(1, 1, 1)
        } else if(geometry instanceof BufferGeometry) {
            return geometry
        } else {
            switch(geometry.type) {
                case 'plane':
                    return new PlaneGeometry(
                        geometry.width,
                        geometry.height,
                        geometry.widthSegments,
                        geometry.heightSegments,
                    )
                case 'cube':
                case 'box':
                    return new BoxGeometry(
                        geometry.width,
                        geometry.height,
                        geometry.depth,
                        geometry.widthSegments,
                        geometry.heightSegments,
                        geometry.depthSegments,
                    )
                case 'circle':
                    return new CircleGeometry(
                        geometry.radius,
                        geometry.segments,
                        geometry.thetaStart,
                        geometry.thetaLength
                    )
                case 'ring':
                    return new RingGeometry(
                        geometry.radius,
                        geometry.outerRadius,
                        geometry.thetaSegments,
                        geometry.phiSegments,
                        geometry.thetaStart,
                        geometry.thetaLength
                    )
                case 'cone':
                    return new ConeGeometry(
                        geometry.radius,
                        geometry.height,
                        geometry.radialSegments,
                        geometry.heightSegments,
                        geometry.openEnded,
                        geometry.thetaStart,
                        geometry.thetaLength
                    )
                case 'cylinder':
                    return new CylinderGeometry(
                        geometry.radius,
                        geometry.radiusBottom,
                        geometry.height,
                        geometry.radialSegments,
                        geometry.heightSegments,
                        geometry.openEnded,
                        geometry.thetaStart,
                        geometry.thetaLength
                    )
                case 'dodecahedron':
                    return new DodecahedronGeometry(
                        geometry.radius,
                        geometry.detail
                    )
                case 'ball':
                case 'sphere':
                    return new SphereGeometry(
                        geometry.radius,
                        geometry.widthSegments,
                        geometry.heightSegments,
                        geometry.phiStart,
                        geometry.phiLength,
                        geometry.thetaStart,
                        geometry.phiLength
                    )
                case 'text':
                    const text = geometry.text ?? ''
                    let font !: Font
                    if(geometry.font) {
                        if(geometry.font instanceof Font) {
                            font = geometry.font
                        } else {
                            WireframeLoaders.fontLoader.load(geometry.font, (loadedFont) => {
                                font = loadedFont
                            })
                        }
                    } else {
                        font = new Font(helvetiker)
                    }
                    geometry.font = font
                    delete geometry.text
                    return new WTextGeometry(text, geometry as TextGeometryParameters)
            }
        }
    }
    public static parseMaterial(material?: Material | MaterialJson): Material {
        if(!material) {
            return new MeshBasicMaterial({color: 0xffffff})
        } if(material instanceof Material) {
            return material
        } else {
            material = {
                color: LightParser.parseColor(material.color),
            }
            switch(material.type) {
                case 'toon':
                    return new MeshToonMaterial(material)
                case 'lambert':
                    return new MeshLambertMaterial(material)
                case 'phong':
                    return new MeshPhongMaterial(material)
                case 'depth':
                    return new MeshDepthMaterial(material)
                case 'matcap':
                    return new MeshMatcapMaterial(material)
                case 'normal':
                    return new MeshNormalMaterial(material)
                case 'standard':
                    return new MeshStandardMaterial(material)
                case 'physical':
                    return new MeshPhysicalMaterial(material)
                case 'basic':
                default:
                    return new MeshBasicMaterial(material)
            }
        }
    }
}