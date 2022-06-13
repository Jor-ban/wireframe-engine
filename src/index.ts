import {BoxGeometry, Group, Mesh, MeshBasicMaterial, SphereGeometry} from "three";
import {WireframeEngine} from "./app/engine";
const minecraft = require("../assets/minecraft.jpg"); //"../assets/kolobok.jpg";

const material = new MeshBasicMaterial( { color: 0xffff00 } );
const box = new Mesh( new BoxGeometry( 1, 1, 1 ), material );
const sphere = new Mesh( new SphereGeometry( 1, 32, 16 ), material )
const group = new Group()
group.add(box)
group.add(sphere)

new WireframeEngine('#canvas', {
    scene: {
        skybox: [minecraft, minecraft, minecraft, minecraft, minecraft, minecraft]
    },
    objects: [
        group
    ],
})