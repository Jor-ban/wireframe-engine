import {
    BoxGeometry, BufferGeometry, ConeGeometry, CylinderGeometry, DodecahedronGeometry,
    Mesh,
    MeshBasicMaterial,
    OrthographicCamera,
    PerspectiveCamera, RingGeometry,
    SphereGeometry,
} from "three";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import {Font} from "three/examples/jsm/loaders/FontLoader";
const helvetiker = require('three/examples/fonts/helvetiker_regular.typeface.json')

export class MeshGenerator {
    static addCube(camera: PerspectiveCamera | OrthographicCamera): Mesh {
        return this.createMesh(new BoxGeometry(), camera)
    }
    static addSphere(camera: PerspectiveCamera | OrthographicCamera): Mesh {
        return this.createMesh(new SphereGeometry(1), camera)
    }
    static addRing(camera: PerspectiveCamera | OrthographicCamera): Mesh {
        return this.createMesh(new RingGeometry(), camera)
    }
    static addCircle(camera: PerspectiveCamera | OrthographicCamera): Mesh {
        return this.createMesh(new RingGeometry(), camera)
    }
    static addCone(camera: PerspectiveCamera | OrthographicCamera): Mesh {
        return this.createMesh(new ConeGeometry(), camera)
    }
    static addCylinder(camera: PerspectiveCamera | OrthographicCamera): Mesh {
        return this.createMesh(new CylinderGeometry(), camera)
    }
    static addDodecahedron(camera: PerspectiveCamera | OrthographicCamera): Mesh {
        return this.createMesh(new DodecahedronGeometry(), camera)
    }
    static async addText(camera: PerspectiveCamera | OrthographicCamera): Promise<Mesh | undefined> {
        const text = prompt("Enter text to add")
        if (text) {
            const textGeometry = new TextGeometry(text, {
                font: new Font(helvetiker),
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            })
            return this.createMesh(textGeometry, camera)
        } else {
            return ;
        }
    }
    private static createMesh(geometry: BufferGeometry, camera: PerspectiveCamera | OrthographicCamera) {
        const mesh = new Mesh(
            geometry,
            new MeshBasicMaterial({color: 'grey'})
        )
        mesh.position.set( // creating new position depending on camera position and orientation
            Math.round((camera.position.x - Math.sin(camera.rotation.y) * 5) * 10) / 10,
            Math.round((camera.position.y + Math.sin(camera.rotation.x) * 5) * 10) / 10,
            Math.round((camera.position.z - Math.cos(camera.rotation.z) * 5) * 10) / 10,
        )
        mesh.rotation.copy(camera.rotation)
        return mesh
    }
}