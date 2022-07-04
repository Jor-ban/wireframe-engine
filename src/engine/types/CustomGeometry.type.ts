import {Font} from "three/examples/jsm/loaders/FontLoader";

export type CustomPlaneGeometry = {
    width?: number
    height?: number
    widthSegments?: number
    heightSegments?: number
}

export type CustomBoxGeometry = CustomPlaneGeometry & {
    depth?: number
    depthSegments?: number
}
export type CustomCircleGeometry = {
    radius?: number
    segments?: number
    thetaStart?: number
    thetaLength?: number
}
export type CustomRingGeometry = CustomCircleGeometry & {
    thetaSegments?: number,
    phiSegments?: number
    outerRadius?: number
}
export type CustomConeGeometry = {
    radius?: number
    height?: number
    radialSegments?: number
    heightSegments?: number
    openEnded?: boolean
    thetaStart?: number
    thetaLength?: number
}
export type CustomCylinderGeometry = CustomConeGeometry & {
    radiusBottom?: number
}
export type CustomDodecahedronGeometry = {
    radius?: number
    detail?: number
}
export type CustomSphereGeometry = {
    radius?: number
    widthSegments?: number
    heightSegments?: number
    phiStart?: number
    phiLength?: number
    thetaStart?: number
    thetaLength?: number
}
export type CustomTextGeometry = {
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

export type CustomGeometry = (
    CustomPlaneGeometry &
    CustomBoxGeometry &
    CustomCircleGeometry &
    CustomRingGeometry &
    CustomConeGeometry &
    CustomCylinderGeometry &
    CustomDodecahedronGeometry &
    CustomTextGeometry &
    CustomSphereGeometry ) & {
        type: 'plane' | 'box' | 'cube' | 'circle' | 'ring' | 'cone' | 'cylinder' | 'dodecahedron' | 'sphere' | 'ball' | 'text'
    }