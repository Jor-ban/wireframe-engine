import { AmbientLight, Camera, CircleGeometry, ConeGeometry, CylinderGeometry, DirectionalLight, DodecahedronGeometry, Group, Light, Object3D, PlaneGeometry, PointLight, RingGeometry, SphereGeometry, SpotLight } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { WMesh } from '⚙️/lib';
import { icons } from '⚙️/devEngine/assets/icons';
import { GroupService } from './group.service';

export function getObjectIcon(obj: Object3D): string {
    if(obj instanceof Group) {
        if(obj.children.length) {
            if(GroupService.isCollapsed(obj)) {
                return icons.collapsedGroup
            } else {
                return icons.group
            }
        } else {
            return icons.emptyGroup
        }
    } else if(obj instanceof Camera) {
        return icons.camera
    } else if(obj instanceof Light) {
        if(obj instanceof AmbientLight) {
            return icons.ambientLight
        } else if(obj instanceof PointLight) {
            return icons.pointLight
        } else if(obj instanceof SpotLight) {
            return icons.spotLight
        } else if(obj instanceof DirectionalLight) {
            return icons.directionalLight
        } else {
            return icons.hemisphereLight
        }
    } else if(obj instanceof WMesh) {
        const geometry = obj.geometry
        if(geometry instanceof CircleGeometry) {
            return icons.circle
        } else if(geometry instanceof ConeGeometry) {
            return icons.cone
        } else if (geometry instanceof SphereGeometry) {
            return icons.sphere
        } else if(geometry instanceof PlaneGeometry) {
            return icons.plane
        } else if (geometry instanceof CylinderGeometry) {
            return icons.cylinder
        } else if(geometry instanceof RingGeometry) {
            return icons.ring
        } else if(geometry instanceof DodecahedronGeometry) {
            return icons.dodecahedron
        } else if(geometry instanceof TextGeometry) {
            return icons.text
        } else {
            return icons.box
        }
    } else {
        return icons.box
    }
}

export function getElementText(obj: Object3D): string {
    let iconText = `<img src="${ getObjectIcon(obj) }" class="list-icon" /> `
    if(obj.name) {
        iconText += obj.name
    } else {
        if(obj instanceof WMesh && obj.geometry) {
            iconText += obj.geometry.type.replace("Geometry", "")
        } else if(obj instanceof Light) {
            iconText += obj.type
        } else {
            iconText += obj.type
        }
    }
    return iconText
}