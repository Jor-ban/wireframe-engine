import {Light, Object3D} from 'three';
import {WMesh} from "../lib";

export function dispose(obj: Object3D, deep: boolean = true, disposeGeometry: boolean = true, disposeMaterial: boolean = false) {
	if(obj instanceof WMesh) {
		if(Array.isArray(obj.geometry) && disposeGeometry) {
			for (let geometry of obj.geometry) {
				geometry.dispose()
			}
		} else if(disposeGeometry) {
			obj.geometry.dispose()
		}

		if(disposeMaterial) {
			obj.material.dispose()
		}
	} else if(obj instanceof Light) {
		obj.dispose()
	}

	if(obj.children.length && deep) {
		for(const child of obj.children) {
			dispose(child, true)
		}
	}
	obj.parent?.remove(obj)
}