import {
    BoxGeometry, BufferGeometry,
    CircleGeometry,
    ConeGeometry,
    CylinderGeometry,
    DodecahedronGeometry,
    PlaneGeometry, RingGeometry,
    SphereGeometry
} from "three";
import {TpChangeEvent} from "tweakpane";
import {WireframeMesh, WireframeTextGeometry} from "../../../lib";
import {TextGeometryParameters} from "three/examples/jsm/geometries/TextGeometry";
import { Font } from "three/examples/jsm/loaders/FontLoader";
const helvetiker = require('three/examples/fonts/helvetiker_regular.typeface.json')

export class GeometryRedactor {
    static recreateMesh(mesh: WireframeMesh, change: TpChangeEvent<any>): WireframeMesh | undefined {
        const geometry = mesh.geometry
        if(geometry instanceof BoxGeometry) {
            const newGeometry = this.recreateBoxGeometry(geometry, change)
            return this.createMesh(mesh, newGeometry)
        } else if(geometry instanceof PlaneGeometry) {
            const newGeometry = this.recreatePlaneGeometry(geometry, change)
            return this.createMesh(mesh, newGeometry)
        } else if(geometry instanceof CircleGeometry) {
            const newGeometry = this.recreateCircleGeometry(geometry, change)
            return this.createMesh(mesh, newGeometry)
        } else if(geometry instanceof ConeGeometry) {
            const newGeometry = this.recreateConeGeometry(geometry, change)
            return this.createMesh(mesh, newGeometry)
        } else if(geometry instanceof CylinderGeometry) {
            const newGeometry = this.recreateCylinderGeometry(geometry, change)
            return this.createMesh(mesh, newGeometry)
        } else if(geometry instanceof DodecahedronGeometry) {
            const newGeometry = this.recreateDodecahedronGeometry(geometry, change)
            return this.createMesh(mesh, newGeometry)
        } else if(geometry instanceof SphereGeometry) {
            const newGeometry = this.recreateSphereGeometry(geometry, change)
            return this.createMesh(mesh, newGeometry)
        } else if(geometry instanceof RingGeometry) {
            const newGeometry = this.recreateRingGeometry(geometry, change)
            return this.createMesh(mesh, newGeometry)
        } else if(geometry instanceof WireframeTextGeometry) {
            const newGeometry = this.recreateTextGeometry(geometry, change)
            return this.createMesh(mesh, newGeometry)
        }
    }
    static createMesh(mesh: WireframeMesh, geometry: BufferGeometry): WireframeMesh {
        const material = mesh.material
        return new WireframeMesh(geometry, material)
    }
    // @ts-ignore
    private static setParameter<T extends BufferGeometry>(geometry: T, change: TpChangeEvent<{ presetKey: keyof T }>): T['parameters'] {
        // @ts-ignore
        const parameters = geometry instanceof WireframeTextGeometry ? geometry.parameters.options : geometry.parameters
        if(change.presetKey) {
            const key = change.presetKey
            parameters[key] = change.value
        }
        return parameters
    }

    static recreateBoxGeometry(geometry: BoxGeometry, change: TpChangeEvent<any>): BoxGeometry {
        const parameters = this.setParameter(geometry, change)
        return new BoxGeometry(
            parameters.width, parameters.height, parameters.depth,
            parameters.widthSegments, parameters.heightSegments, parameters.depthSegments
        )
    }
    static recreatePlaneGeometry(geometry: PlaneGeometry, change: TpChangeEvent<any>): PlaneGeometry {
        const parameters = this.setParameter(geometry, change)
        return new PlaneGeometry(
            parameters.width, parameters.height,
            parameters.widthSegments, parameters.heightSegments
        )
    }
    static recreateCircleGeometry(geometry: CircleGeometry, change: TpChangeEvent<any>): CircleGeometry {
        const parameters = this.setParameter(geometry, change)
        return new CircleGeometry(
            parameters.radius, parameters.segments, parameters.thetaStart, parameters.thetaLength,
        )
    }
    static recreateConeGeometry(geometry: ConeGeometry, change: TpChangeEvent<any>): ConeGeometry {
        const parameters = this.setParameter(geometry, change)
        return new ConeGeometry(
            parameters.radiusBottom, parameters.height, parameters.radialSegments, parameters.heightSegments,
            parameters.openEnded, parameters.thetaStart, parameters.thetaLength
        )
    }
    static recreateCylinderGeometry(geometry: CylinderGeometry, change: TpChangeEvent<any>): CylinderGeometry {
        const parameters = this.setParameter(geometry, change)
        return new CylinderGeometry(
            parameters.radiusTop, parameters.radiusBottom, parameters.height, parameters.radialSegments,
            parameters.heightSegments, parameters.openEnded, parameters.thetaStart, parameters.thetaLength
        )
    }
    static recreateDodecahedronGeometry(geometry: DodecahedronGeometry, change: TpChangeEvent<any>): DodecahedronGeometry {
        const parameters = this.setParameter(geometry, change)
        return new DodecahedronGeometry( parameters.radius, parameters.detail )
    }
    static recreateSphereGeometry(geometry: SphereGeometry, change: TpChangeEvent<any>): SphereGeometry {
        const parameters = this.setParameter(geometry, change)
        return new SphereGeometry(
            parameters.radius, parameters.widthSegments, parameters.heightSegments, parameters.phiStart,
            parameters.phiLength, parameters.thetaStart, parameters.thetaLength
        )
    }
    static recreateRingGeometry(geometry: RingGeometry, change: TpChangeEvent<any>): RingGeometry {
        const parameters = this.setParameter(geometry, change)
        return new RingGeometry(
            parameters.innerRadius, parameters.outerRadius, parameters.thetaSegments,
            parameters.phiSegments, parameters.thetaStart, parameters.thetaLength
        )
    }
    static recreateTextGeometry(geometry: WireframeTextGeometry, change: TpChangeEvent<any>): WireframeTextGeometry {
        const parameters: TextGeometryParameters = this.setParameter(geometry, change)
        parameters.font = new Font(helvetiker)
        return new WireframeTextGeometry(geometry.text, parameters)
    }
}