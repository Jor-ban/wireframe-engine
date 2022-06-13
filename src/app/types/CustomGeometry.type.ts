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
    text: string
    size: number
    height: number
    font?: string
}

export type CustomGeometry = ( CustomPlaneGeometry |
    CustomBoxGeometry |
    CustomCircleGeometry |
    CustomRingGeometry |
    CustomConeGeometry |
    CustomCylinderGeometry |
    CustomDodecahedronGeometry |
    CustomSphereGeometry ) & {
        type: 'plane' | 'box' | 'cube' | 'circle' | 'ring' | 'cone' | 'cylinder' | 'dodecahedron' | 'sphere' | 'ball' | 'text'
    }