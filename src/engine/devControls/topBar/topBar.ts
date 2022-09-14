const logoUrl = require('../assets/wireframe-logo.svg');

export class TopBar {
    bar: HTMLElement;

    constructor() {
        this.bar = document.createElement("div")
        this.bar.classList.add("__wireframe-top-bar")
        document.body.appendChild(this.bar)
        this.addLogo()
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
}