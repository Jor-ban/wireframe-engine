import {Font} from "three/examples/jsm/loaders/FontLoader";

export type PlaneGeometryJson = {
    width?: number
    height?: number
    widthSegments?: number
    heightSegments?: number
}

export type BoxGeometryJson = PlaneGeometryJson & {
    depth?: number
    depthSegments?: number
}
export type CircleGeometryJson = {
    radius?: number
    segments?: number
    thetaStart?: number
    thetaLength?: number
}
export type RingGeometryJson = CircleGeometryJson & {
    thetaSegments?: number,
    phiSegments?: number
    outerRadius?: number
}
export type ConeGeometryJson = {
    radius?: number
    height?: number
    radialSegments?: number
    heightSegments?: number
    openEnded?: boolean
    thetaStart?: number
    thetaLength?: number
}
export type CylinderGeometryJson = ConeGeometryJson & {
    radiusBottom?: number
}
export type DodecahedronGeometryJson = {
    radius?: number
    detail?: number
}
export type SphereGeometryJson = {
    radius?: number
    widthSegments?: number
    heightSegments?: number
    phiStart?: number
    phiLength?: number
    thetaStart?: number
    thetaLength?: number
}
export type TextGeometryJson = {
    text?: string
    size?: number | undefined;
    height?: number | undefined;
    curveSegments?: number | undefined;
    bevelEnabled?: boolean | undefined;
    bevelThickness?: number | undefined;
    bevelSize?: number | undefined;
    bevelOffset?: number | undefined;
    bevelSegments?: number | undefined;
    font?: Font | string
}

export type GeometryJson = (
    PlaneGeometryJson &
    BoxGeometryJson &
    CircleGeometryJson &
    RingGeometryJson &
    ConeGeometryJson &
    CylinderGeometryJson &
    DodecahedronGeometryJson &
    TextGeometryJson &
    SphereGeometryJson ) & {
        type: 'plane' | 'box' | 'cube' | 'circle' | 'ring' | 'cone' | 'cylinder' | 'dodecahedron' | 'sphere' | 'ball' | 'text'
    }