
import {MeshGenerator} from "./utils/generators/MeshGenerator";
import {Light, OrthographicCamera, PerspectiveCamera, Scene} from "three";
import {HiddenMenuOption} from "./UI/hiddenMenu";
import {LightGenerator} from "./utils/generators/lightGenerator";
import {ChangeDetector} from "./changeDetector/changeDetector";
import {WireframeMesh} from "../../lib";

export function getMeshAddingOptions(scene: Scene, mainCamera: PerspectiveCamera | OrthographicCamera): HiddenMenuOption[] {
    return [{
        name: 'Mesh',
        subOptions: [
            {
                name: "Cube ▣",
                onclick: () => addMesh(MeshGenerator.addCube(mainCamera), scene),
            }, {
                name: "Sphere ⦿",
                onclick: () => addMesh(MeshGenerator.addSphere(mainCamera), scene),
            }, {
                name: "Plane □",
                onclick: () => addMesh(MeshGenerator.addPlane(mainCamera), scene),
            }, {
                name: "Ring ◌",
                onclick: () => addMesh(MeshGenerator.addRing(mainCamera), scene),
            }, {
                name: "Circle ❍",
                onclick: () => addMesh(MeshGenerator.addCircle(mainCamera), scene),
            }, {
                name: "Cone △",
                onclick: () => addMesh(MeshGenerator.addCone(mainCamera), scene),
            }, {
                name: "Cylinder □",
                onclick: () => addMesh(MeshGenerator.addCylinder(mainCamera), scene),
            }, {
                name: "Dodecahedron ◇",
                onclick: () => addMesh(MeshGenerator.addDodecahedron(mainCamera), scene),
            }, {
                name: "Text (...)",
                onclick: async () => addMesh(await MeshGenerator.addText(mainCamera), scene),
            },
        ]
    },{
        name: 'Light',
        subOptions: [
            {
                name: "Point light",
                onclick: () => addMesh(LightGenerator.addPointLight(mainCamera), scene),
            }
        ]
    }
]}
function addMesh(mesh: WireframeMesh | Light | undefined, scene: Scene) {
    if(mesh) {
        scene.add(mesh)
        ChangeDetector.addedObject$.next(mesh)
    }
}