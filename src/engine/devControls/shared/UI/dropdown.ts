import {HiddenMenu, HiddenMenuOption} from "./hiddenMenu";

export class WireframeDropdown {
    constructor(element: HTMLElement, name: string, options: HiddenMenuOption[]) {
        const dropdownContainer = document.createElement("div")
        dropdownContainer.classList.add("__wireframe-dropdown-container")
        element.appendChild(dropdownContainer)

        const dropdownButton = document.createElement("button")
        dropdownButton.classList.add("__wireframe-dropdown-button")
        dropdownButton.innerHTML = name
        dropdownContainer.appendChild(dropdownButton)

        const dropdownContent = document.createElement("div")
        dropdownContent.classList.add("__wireframe-dropdown-content")
        dropdownContainer.appendChild(dropdownContent);

        const menu = new HiddenMenu(dropdownContent, options)
        window.addEventListener("click", (event) => {
            if(event.target === dropdownButton && menu.isClosed) {
                menu.open()
                dropdownContainer.classList.add("__wireframe-dropdown-container--active")
            } else {
                menu.close()
                dropdownContainer.classList.remove("__wireframe-dropdown-container--active")
            }
        })
    }
}