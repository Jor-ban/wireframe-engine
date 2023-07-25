import CANNON from "cannon-es";

export interface CannonPhysicsJsonInterface {
    mass?: number
    shape?: 'box' | 'sphere' | 'plane' | 'particle'
    type?: 1 | 2 | 4 | 'Dynamic' | 'Static' | 'Kinematic'
    size?: CANNON.Vec3 | [number, number, number]
    position?: CANNON.Vec3 |  [number, number, number]
    quaternion?: CANNON.Quaternion |  [number, number, number]
    contactMaterial?: {
        friction?: number;
        restitution?: number;
        contactEquationStiffness?: number;
        contactEquationRelaxation?: number;
        frictionEquationStiffness?: number;
        frictionEquationRelaxation?: number;
        relativeTo ?: CANNON.Material
    },
    material?: CANNON.Material
    collisionFilterGroup?: number
    collisionFilterMask?: number
    collisionResponse?: boolean
    velocity?: CANNON.Vec3 |  [number, number, number]
    linearDamping?: number
    allowSleep?: boolean
    sleepSpeedLimit?: number
    sleepTimeLimit?: number
    angularVelocity?: CANNON.Vec3 |  [number, number, number]
    fixedRotation?: boolean
    angularDamping?: number
    linearFactor?: CANNON.Vec3 |  [number, number, number]
    angularFactor?: CANNON.Vec3 |  [number, number, number]
    isTrigger?: boolean
    bindToMesh?: boolean | {
        position?: boolean
        quaternion?: boolean
    }
    alwaysShow?: boolean
}

export interface CannonPhysicsBodyInterface {
    collisionFilterGroup?: number
    collisionFilterMask?: number
    collisionResponse?: boolean
    position?: CANNON.Vec3
    velocity?: CANNON.Vec3
    mass?: number
    material?: CANNON.Material
    linearDamping?: number
    type?: CANNON.BodyType
    allowSleep?: boolean
    sleepSpeedLimit?: number
    sleepTimeLimit?: number
    quaternion?: CANNON.Quaternion
    angularVelocity?: CANNON.Vec3
    fixedRotation?: boolean
    angularDamping?: number
    linearFactor?: CANNON.Vec3
    angularFactor?: CANNON.Vec3
    shape?: CANNON.Shape
    isTrigger?: boolean
}