import * as CANNON from "cannon-es";
import { Box3, Object3D, SphereGeometry, Vector3 } from "three";
import {
    CannonPhysicsBodyInterface,
    CannonPhysicsJsonInterface
} from "⚙️/examples/extentions/cannon-physics/types/object-with-physics.interface";

export class PhysicsParser {
    static parse(object: Object3D, physics: CannonPhysicsJsonInterface | true = true): CANNON.Body {
        if(physics === true) physics = {}
        const bodyJson: CannonPhysicsBodyInterface = {}
        if('collisionFilterGroup' in physics) bodyJson.collisionFilterGroup
        if('collisionFilterMask' in physics) bodyJson.collisionFilterMask
        if('collisionResponse' in physics) bodyJson.collisionResponse

        if(physics.position) {
            if(Array.isArray(physics.position))
                bodyJson.position = new CANNON.Vec3(physics.position[0], physics.position[1], physics.position[2])
            else
                bodyJson.position = physics.position
        } else {
            const positionVector = new Vector3()
            object.getWorldPosition(positionVector)
            bodyJson.position = new CANNON.Vec3(positionVector.x, positionVector.y, positionVector.z)
        }
        if(physics.velocity) {
            if(Array.isArray(physics.velocity))
                bodyJson.velocity = new CANNON.Vec3(physics.velocity[0], physics.velocity[1], physics.velocity[2])
            else
                bodyJson.velocity = physics.velocity
        }
        bodyJson.mass = physics.mass ?? 0
        if(physics.material) {
            bodyJson.material = new CANNON.Material()
            if(physics.material.friction) bodyJson.material.friction = physics.material.friction
            if(physics.material.restitution) bodyJson.material.restitution = physics.material.restitution
        }
        if('linearDamping' in physics) bodyJson.linearDamping = physics.linearDamping
        if(physics.type) {
            bodyJson.type = this.getBodyType(physics.type)
        }
        if('allowSleep' in physics) bodyJson.allowSleep = physics.allowSleep
        if('sleepSpeedLimit' in physics) bodyJson.sleepSpeedLimit = physics.sleepSpeedLimit
        if('sleepTimeLimit' in physics) bodyJson.sleepTimeLimit = physics.sleepTimeLimit
        if(physics.quaternion) {
            if(Array.isArray(physics.quaternion))
                bodyJson.quaternion = new CANNON.Quaternion(physics.quaternion[0], physics.quaternion[1], physics.quaternion[2])
            else
                bodyJson.quaternion = physics.quaternion
        }
        if(physics.angularVelocity) {
            if(Array.isArray(physics.angularVelocity))
                bodyJson.angularVelocity = new CANNON.Vec3(physics.angularVelocity[0], physics.angularVelocity[1], physics.angularVelocity[2])
            else
                bodyJson.angularVelocity = physics.angularVelocity
        }
        if('fixedRotation' in physics) bodyJson.fixedRotation = physics.fixedRotation
        if('angularDamping' in physics) bodyJson.angularDamping = physics.angularDamping
        if('angularFactor' in physics) {
            if(Array.isArray(physics.angularFactor))
                bodyJson.angularFactor = new CANNON.Vec3(physics.angularFactor[0], physics.angularFactor[1], physics.angularFactor[2])
            else
                bodyJson.angularFactor = physics.angularFactor
        }
        if('linearFactor' in physics) {
            if(Array.isArray(physics.linearFactor))
                bodyJson.linearFactor = new CANNON.Vec3(physics.linearFactor[0], physics.linearFactor[1], physics.linearFactor[2])
            else
                bodyJson.linearFactor = physics.linearFactor
        }
        bodyJson.shape = this.getShape(physics, object)
        if('isTrigger' in physics) bodyJson.isTrigger = physics.isTrigger

        return new CANNON.Body(bodyJson)
    }
    static getShape(data: CannonPhysicsJsonInterface, object: Object3D): CANNON.Shape {
        let size: CANNON.Vec3 | undefined
        if('size' in data) {
            if(Array.isArray(data.size))
                size = new CANNON.Vec3(data.size[0], data.size[1], data.size[2])
            else
                size = data.size
        } else {
            size = this.getHalfExtents(object)
        }
        switch(data.shape) {
            case 'box': return new CANNON.Box(size)
            case 'sphere': return new CANNON.Sphere(size.x)
            case 'plane': return new CANNON.Plane()
            case 'particle': return new CANNON.Particle()
            default:
                if('geometry' in object) {
                    if(object.geometry instanceof SphereGeometry) {
                        return new CANNON.Sphere(size.x)
                    } else {
                        return new CANNON.Box(size)
                    }
                } else {
                    throw new Error('[Cannon-es Physics] -> Cannot get shape for object')
                }
        }
    }
    static getHalfExtents(object: Object3D): CANNON.Vec3 {
        const v = new Box3().setFromObject(object).getSize(new Vector3()).divideScalar(2)
        return new CANNON.Vec3(v.x, v.y, v.z)
    }
    static getBodyType(type: 1 | 2 | 4 | 'Dynamic' | 'Static' | 'Kinematic' | undefined): CANNON.BodyType {
        if(type === 1 || type === 'Dynamic') return CANNON.BODY_TYPES.DYNAMIC
        if(type === 4 || type === 'Kinematic') return CANNON.BODY_TYPES.KINEMATIC
        return CANNON.BODY_TYPES.STATIC
    }
}