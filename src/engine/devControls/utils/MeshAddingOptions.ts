
import {MeshGenerator} from "./generators/MeshGenerator";
import {Light, OrthographicCamera, PerspectiveCamera, Scene} from "three";
import {HiddenMenuOption} from "../UI/utils/hiddenMenu";
import {DevLightGenerator} from "./generators/devLightGenerator";
import {ChangeDetector} from "../changeDetector/changeDetector";
import {WireframeMesh} from "../../lib";
import {DevLight} from "../../lib/devLights/DevLight";

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
                onclick: () => addMesh(DevLightGenerator.addPointLight(mainCamera), scene),
            }, {
                name: "Spot light",
                onclick: () => addMesh(DevLightGenerator.addSpotLight(mainCamera), scene),
            }, {
                name: "Directional light",
                onclick: () => addMesh(DevLightGenerator.addDirectionalLight(mainCamera), scene),
            }, {
                name: "Hemisphere light",
                onclick: () => addMesh(DevLightGenerator.addHemisphereLight(mainCamera), scene),
            }
        ]
    }
]}
function addMesh(obj: WireframeMesh | Light | undefined, scene: Scene) {
    if(obj) {
        if(obj instanceof Light && DevLight.ifDevLight(obj)) {
            obj.addToScene(scene)
        } else {
            scene.add(obj)
        }
        ChangeDetector.addedObject$.next(obj)
    }
}