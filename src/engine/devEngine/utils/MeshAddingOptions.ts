
import { MeshGenerator } from "./generators/MeshGenerator";
import { Group, Light, Object3D, PerspectiveCamera, Scene } from "three";
import { HiddenMenuOption } from "./hiddenMenu";
import { LightWithHelperGenerator } from "./generators/LightWithHelperGenerator";
import { ChangeDetector } from "../changeDetector/changeDetector";
import { WireframeMesh } from "../../lib";
import { LightWithHelper } from "../../lib/devClasses/lightsWithHelper";
import { icons } from '../assets/icons'

let activeObject: Object3D | null = null

ChangeDetector.clickedObject$.subscribe(object => {
    activeObject = object
})

export function getMeshAddingOptions(scene: Scene, devCamera: PerspectiveCamera): HiddenMenuOption[] {
    return [{
        name: `<img src="${icons.box}" alt="Box" class="list-icon" /> Mesh ▸ `,
        subOptions: [
            {
                name: `<img src="${icons.box}" alt="Box" class="list-icon" /> Box`,
                onclick: () => addMesh(MeshGenerator.addCube(devCamera), scene),
            }, {
                name: `<img src="${icons.sphere}" alt="Sphere" class="list-icon" /> Sphere`,
                onclick: () => addMesh(MeshGenerator.addSphere(devCamera), scene),
            }, {
                name: `<img src="${icons.plane}" alt="Plane" class="list-icon" /> Plane`,
                onclick: () => addMesh(MeshGenerator.addPlane(devCamera), scene),
            }, {
                name: `<img src="${icons.circle}" alt="Circle" class="list-icon" /> Circle`,
                onclick: () => addMesh(MeshGenerator.addCircle(devCamera), scene),
            }, {
                name: `<img src="${icons.ring}" alt="Ring" class="list-icon" /> Ring`,
                onclick: () => addMesh(MeshGenerator.addRing(devCamera), scene),
            }, {
                name: `<img src="${icons.cone}" alt="Cone" class="list-icon" /> Cone`,
                onclick: () => addMesh(MeshGenerator.addCone(devCamera), scene),
            }, {
                name: `<img src="${icons.cylinder}" alt="Cylinder" class="list-icon" /> Cylinder`,
                onclick: () => addMesh(MeshGenerator.addCylinder(devCamera), scene),
            }, {
                name: `<img src="${icons.dodecahedron}" alt="Dodecahedron" class="list-icon" /> Dodecahedron`,
                onclick: () => addMesh(MeshGenerator.addDodecahedron(devCamera), scene),
            }, {
                name: `<img src="${icons.text}" alt="Text" class="list-icon"/> Text`,
                onclick: async () => addMesh(await MeshGenerator.addText(devCamera), scene),
            },
        ]
    },{
        name: `<img src="${icons.pointLight}" alt="Text" class="list-icon"/> Light ▸ `,
        subOptions: [
            {
                name: `<img src="${icons.pointLight}" alt="Text" class="list-icon"/> Point light`,
                onclick: () => addMesh(LightWithHelperGenerator.addPointLight(devCamera), scene),
            }, {
                name: `<img src="${icons.spotLight}" alt="Text" class="list-icon"/> Spot light`,
                onclick: () => addMesh(LightWithHelperGenerator.addSpotLight(devCamera), scene),
            }, {
                name: `<img src="${icons.directionalLight}" alt="Text" class="list-icon"/> Directional light`,
                onclick: () => addMesh(LightWithHelperGenerator.addDirectionalLight(devCamera), scene),
            }, {
                name: `<img src="${icons.hemisphereLight}" alt="Text" class="list-icon"/> Hemisphere light`,
                onclick: () => addMesh(LightWithHelperGenerator.addHemisphereLight(devCamera), scene),
            }
        ]
    }
]}
function addMesh(obj: WireframeMesh | Light | undefined, scene: Scene) {
    if(obj) {
        let parent: Scene | Object3D = scene
        if(activeObject instanceof Group) {
            parent = activeObject
        } else if(activeObject?.parent) {
            parent = activeObject.parent
        }
        if(LightWithHelper.isLightWithHelper(obj)) {
            obj.addToScene(parent)
        } else {
            parent.add(obj)
        }
        ChangeDetector.addedObject$.next(obj)
    }
}