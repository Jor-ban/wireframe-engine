import * as THREE from 'three'
export interface OnInit<T extends THREE.Object3D = THREE.Object3D> {
    onInit: (object: THREE.Object3D) => void
}
export interface OnInitCamera extends OnInit<THREE.Camera> {}
export interface OnInitMesh extends OnInit<THREE.Mesh> {}
export interface OnInitLight extends OnInit<THREE.Light> {}
export interface OnInitObject3D extends OnInit<THREE.Object3D> {}
export interface OnInitEmptyObject extends OnInit<THREE.Object3D> {}
export interface OnInitGroup extends OnInit<THREE.Group> {}
export interface OnInitAsyncGroup extends OnInit<THREE.Group> {}
export interface OnInitFromFile extends OnInit<THREE.Group> {}
