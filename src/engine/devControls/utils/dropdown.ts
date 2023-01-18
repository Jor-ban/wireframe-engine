import {HiddenMenu, HiddenMenuOption} from "./hiddenMenu";

export class WireframeDropdown {
    constructor(container: HTMLElement, buttonText: string, options: HiddenMenuOption[])
    constructor(container: HTMLElement, button: HTMLButtonElement, options: HiddenMenuOption[])
    constructor(container: HTMLElement, button: string | HTMLButtonElement, options: HiddenMenuOption[]) {
        const dropdownContainer = document.createElement("div")
        dropdownContainer.classList.add("__wireframe-dropdown-container")

        if(typeof button === "string") {
            const buttonText = button
            button = document.createElement("button")
            button.innerHTML = buttonText
        }
        dropdownContainer.appendChild(button)

        container.appendChild(dropdownContainer)

        let dropdownButton: HTMLButtonElement = button
        dropdownButton.classList.add("__wireframe-dropdown-button")
        
        const dropdownContent = document.createElement("div")
        dropdownContent.classList.add("__wireframe-dropdown-content")
        dropdownContainer.appendChild(dropdownContent)

        const menu = new HiddenMenu(dropdownContent, options)

        let buttonClicked = false
        button.addEventListener("click", () => {
            buttonClicked = true
            menu.open()
            dropdownButton.classList.add("__wireframe-dropdown-button--active")
        })

        window.addEventListener("click", () => {
            if(buttonClicked) {
                buttonClicked = false
            } else {
                menu.close()
                dropdownButton.classList.remove("__wireframe-dropdown-button--active")
            }
        })
    }
}