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
import {WTextGeometry} from "⚙️/lib";
import {TextGeometryParameters} from "three/examples/jsm/geometries/TextGeometry";
import {Font, FontData} from "three/examples/jsm/loaders/FontLoader";
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json?url'

export class GeometryRedactor {
    static recreateGeometry<T extends BufferGeometry>(geometry: T, change: TpChangeEvent<any>): T | undefined {
        if(geometry instanceof BoxGeometry) {
            return this.recreateBoxGeometry(geometry, change) as unknown as T
        } else if(geometry instanceof PlaneGeometry) {
            return this.recreatePlaneGeometry(geometry, change) as unknown as T
        } else if(geometry instanceof CircleGeometry) {
            return this.recreateCircleGeometry(geometry, change) as unknown as T
        } else if(geometry instanceof ConeGeometry) {
            return this.recreateConeGeometry(geometry, change) as unknown as T
        } else if(geometry instanceof CylinderGeometry) {
            return this.recreateCylinderGeometry(geometry, change) as unknown as T
        } else if(geometry instanceof DodecahedronGeometry) {
            return this.recreateDodecahedronGeometry(geometry, change) as unknown as T
        } else if(geometry instanceof SphereGeometry) {
            return this.recreateSphereGeometry(geometry, change) as unknown as T
        } else if(geometry instanceof RingGeometry) {
            return this.recreateRingGeometry(geometry, change) as unknown as T
        } else if(geometry instanceof WTextGeometry) {
            return this.recreateTextGeometry(geometry, change) as unknown as T
        }
        return undefined
    }
    // @ts-ignore
    private static setParameter<T extends BufferGeometry>(geometry: T, change: TpChangeEvent<{ presetKey: keyof T }>): T['parameters'] {
        // @ts-ignore
        const parameters = geometry instanceof WTextGeometry ? geometry.parameters.options : geometry.parameters
        if(change['presetKey']) {
            const key = change['presetKey'] ?? ''
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
    static recreateTextGeometry(geometry: WTextGeometry, change: TpChangeEvent<any>): WTextGeometry {
        const parameters: TextGeometryParameters = {
            font: new Font(helvetiker as unknown as FontData),
            ...this.setParameter(geometry, change),
        }
        return new WTextGeometry(geometry.text, parameters)
    }
}