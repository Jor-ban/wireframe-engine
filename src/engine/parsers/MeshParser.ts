import {
    BoxGeometry,
    BufferGeometry, CircleGeometry, ConeGeometry, CylinderGeometry, DodecahedronGeometry,
    Material, MeshBasicMaterial, MeshDepthMaterial,
    MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial,
    MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial,
    MeshToonMaterial,
    Object3D, PlaneGeometry, RingGeometry, SphereGeometry
} from "three";
import {Custom3dObjectParameters, Positionable, Rotatable, Scalable} from "./types/Custom3dObject.type";
import {CustomMesh} from "./types/CustomMesh.type";
import {CustomMaterial} from "./types/CustomMaterial.type";
import {CustomGeometry} from "./types/CustomGeometry.type";
import { TextGeometryParameters } from 'three/examples/jsm/geometries/TextGeometry';
import {LightParser} from "./lightParser";
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import {WireframeMesh, WireframeTextGeometry} from "../lib";

const fl = new FontLoader()

export class MeshParser {
    static parse(object: CustomMesh): Object3D {
        if(object instanceof Object3D) {
            return object
        } else {
            const mesh = new WireframeMesh(
                this.parseGeometry(object.geometry),
                this.parseMaterial(object.material)
            )
            this.setParameters(mesh, object.parameters)
            return mesh
        }
    }
    static parseGeometry(geometry: BufferGeometry | CustomGeometry | undefined): BufferGeometry {
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
                            fl.load(geometry.font, (loadedFont) => {
                                font = loadedFont
                            })
                        }
                    } else {
                        fl.load('./assets/helvetiker_regular.typeface.json', (loadedFont) => {
                            font = loadedFont
                        })
                    }
                    geometry.font = font
                    delete geometry.text
                    return new WireframeTextGeometry(text, geometry as TextGeometryParameters)
            }
        }
    }
    static parseMaterial(material?: Material | CustomMaterial): Material {
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
    static setParameters(mesh: Object3D, parameters: Custom3dObjectParameters | undefined): Object3D {
        this.position(mesh, parameters)
        this.scale(mesh, parameters)
        this.rotate(mesh, parameters)
        return mesh
    }
    static position(object: Object3D, positions?: Positionable): Object3D {
        if(positions) {
            object.position.set(positions.x ?? 0, positions.y ?? 0, positions.z ?? 0);
        }
        return object
    }
    static scale(object: Object3D, scales?: Scalable): Object3D {
        if(scales){
            object.scale.set(scales.scaleX ?? 1, scales.scaleY ?? 1, scales.scaleY ?? 1)
        }
        return object
    }
    static rotate(object: Object3D, rotation: Rotatable | undefined): Object3D {
        if(rotation){
            object.rotation.set(
                rotation.rotateX ? rotation.rotateX * Math.PI / 180 : 0,
                rotation.rotateY ? rotation.rotateY * Math.PI / 180 : 0,
                rotation.rotateZ ? rotation.rotateZ * Math.PI / 180 : 0
            )
        }
        return object
    }
}