import {PerspectiveCamera, Scene} from "three";
import {WireframeDropdown} from "../../utils/dropdown";
import {getMeshAddingOptions} from "../../utils/MeshAddingOptions";

import logoUrl from '../../assets/wireframe-logo.svg'

export class TopBar {
    bar: HTMLElement;
    devCamera: PerspectiveCamera;
    scene: Scene;

    constructor(devCamera: PerspectiveCamera, scene: Scene) {
        this.devCamera = devCamera;
        this.scene = scene;
        this.bar = document.createElement("div")
        this.bar.classList.add("__wireframe-top-bar", '__wireframe-controls')
        document.body.appendChild(this.bar)
        this.addLogo()
        this.addMeshAddingDropdown()
        this.addTestPlayButton()
    }
    addLogo(): void {
        const logo = document.createElement("img")
        logo.src = logoUrl
        logo.classList.add("__wireframe-logo")
        this.bar.appendChild(logo)
    }
    addTestPlayButton() {
        const button = document.createElement("a")
        button.href = window.location.href + '?mode=test'
        button.target = '_blank'
        button.classList.add("__wireframe-test-play-button")
        button.innerHTML = "▶ Run in test mode"
        button.style.marginLeft = 'auto'
        this.bar.appendChild(button)
    }
    addMeshAddingDropdown() {
        const addBtn = document.createElement("button")
        addBtn.innerHTML = "Add [ + ]"
        new WireframeDropdown(this.bar, addBtn, getMeshAddingOptions(this.scene, this.devCamera))
    }
}