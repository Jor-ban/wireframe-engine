import { Mesh, Object3D, Texture } from 'three';

export function dispose(obj: Object3D, deep: boolean = true) {
	if(obj instanceof Mesh) {
		if(obj.geometry instanceof Array) {
			for (let geometry of obj.geometry) {
				geometry.dispose()
			}
		} else {
			obj.geometry.dispose()
		}
		if(deep) {
			for(let key in obj) {
				Object.values(obj).forEach(value => {
					if(value instanceof Texture) {
						value.dispose()
					}
				})
			}
		}
		obj.material.dispose()
	}
	obj.parent?.remove(obj)

	if(obj.children.length && deep) {
		for(const child of obj.children) {
			dispose(child, true)
		}
	}
}