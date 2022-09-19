import {
    BoxGeometry, BufferGeometry,
    CircleGeometry,
    ConeGeometry,
    CylinderGeometry,
    DodecahedronGeometry,
    PlaneGeometry,
    RingGeometry, SphereGeometry
} from "three";
import {FolderApi, TabPageApi} from "tweakpane";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {Geometry} from "three/examples/jsm/deprecated/Geometry";

export class GeometryControls {
    // TODO work on this, does not work
    static addMeshControls(geometry: Geometry | BufferGeometry, folder: TabPageApi | FolderApi) {
        if(geometry instanceof BoxGeometry) {
            folder.addInput(geometry.parameters, 'width')
            folder.addInput(geometry.parameters, 'height')
            folder.addInput(geometry.parameters, 'depth')
            folder.addInput(geometry.parameters, 'widthSegments')
            folder.addInput(geometry.parameters, 'heightSegments')
            folder.addInput(geometry.parameters, 'depthSegments')
        } else if(geometry instanceof PlaneGeometry) {
            folder.addInput(geometry.parameters, 'width')
            folder.addInput(geometry.parameters, 'height')
            folder.addInput(geometry.parameters, 'widthSegments')
            folder.addInput(geometry.parameters, 'heightSegments')
        } else if(geometry instanceof CircleGeometry) {
            folder.addInput(geometry.parameters, 'radius')
            folder.addInput(geometry.parameters, 'segments')
            folder.addInput(geometry.parameters, 'thetaStart')
            folder.addInput(geometry.parameters, 'thetaLength')
        } else if(geometry instanceof RingGeometry) {
            folder.addInput(geometry.parameters, 'innerRadius')
            folder.addInput(geometry.parameters, 'outerRadius')
            folder.addInput(geometry.parameters, 'thetaSegments')
            folder.addInput(geometry.parameters, 'phiSegments')
            folder.addInput(geometry.parameters, 'thetaStart')
            folder.addInput(geometry.parameters, 'thetaLength')
        } else if(geometry instanceof ConeGeometry) {
            folder.addInput(geometry.parameters, 'radiusTop')
            folder.addInput(geometry.parameters, 'radiusBottom')
            folder.addInput(geometry.parameters, 'height')
            folder.addInput(geometry.parameters, 'radialSegments')
            folder.addInput(geometry.parameters, 'heightSegments')
            folder.addInput(geometry.parameters, 'openEnded')
            folder.addInput(geometry.parameters, 'thetaStart')
            folder.addInput(geometry.parameters, 'thetaLength')
        } else if(geometry instanceof CylinderGeometry) {
            folder.addInput(geometry.parameters, 'radiusTop')
            folder.addInput(geometry.parameters, 'radiusBottom')
            folder.addInput(geometry.parameters, 'height')
            folder.addInput(geometry.parameters, 'radialSegments')
            folder.addInput(geometry.parameters, 'heightSegments')
            folder.addInput(geometry.parameters, 'openEnded')
            folder.addInput(geometry.parameters, 'thetaStart')
            folder.addInput(geometry.parameters, 'thetaLength')
        } else if(geometry instanceof DodecahedronGeometry) {
            folder.addInput(geometry.parameters, 'radius')
            folder.addInput(geometry.parameters, 'detail')
        } else if(geometry instanceof SphereGeometry) {
            folder.addInput(geometry.parameters, 'radius')
            folder.addInput(geometry.parameters, 'widthSegments')
            folder.addInput(geometry.parameters, 'heightSegments')
            folder.addInput(geometry.parameters, 'phiStart')
            folder.addInput(geometry.parameters, 'phiLength')
            folder.addInput(geometry.parameters, 'thetaStart')
            folder.addInput(geometry.parameters, 'thetaLength')
        } else if(geometry instanceof TextGeometry) {
            folder.addInput(geometry.parameters, 'size')
            folder.addInput(geometry.parameters, 'height')
            folder.addInput(geometry.parameters, 'curveSegments')
            folder.addInput(geometry.parameters, 'bevelEnabled')
            folder.addInput(geometry.parameters, 'bevelThickness')
            folder.addInput(geometry.parameters, 'bevelSize')
            folder.addInput(geometry.parameters, 'bevelOffset')
            folder.addInput(geometry.parameters, 'bevelSegments')
        }
    }
}