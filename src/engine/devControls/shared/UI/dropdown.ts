export interface WireframeDropdownOption {
    name: string;
    onclick: (event: MouseEvent) => void;
    subOptions?: WireframeDropdownOption[];
}

export class WireframeDropdown {
    static addDropdown(element: HTMLElement, name: string, options: WireframeDropdownOption[]) {
        const dropdownContainer = document.createElement("div")
        dropdownContainer.classList.add("__wireframe-dropdown-container")
        element.appendChild(dropdownContainer)

        const dropdownButton = document.createElement("button")
        dropdownButton.classList.add("__wireframe-dropdown-button")
        dropdownButton.innerHTML = name
        dropdownContainer.appendChild(dropdownButton)

        const dropdownContent = document.createElement("div")
        dropdownContent.classList.add("__wireframe-dropdown-content")
        dropdownContent.style.display = "none"
        dropdownContainer.appendChild(dropdownContent);

        window.addEventListener("click", (event) => {
            if(event.target === dropdownButton && dropdownContent.style.display === "none") {
                dropdownContent.style.display = "block"
                dropdownContainer.classList.add("__wireframe-dropdown-container--active")
            } else {
                dropdownContent.style.display = "none"
                dropdownContainer.classList.remove("__wireframe-dropdown-container--active")
            }
        })

        for (let option of options) {
            const optionElement = document.createElement("button")
            optionElement.classList.add("__wireframe-dropdown-option")
            optionElement.innerHTML = option.name
            optionElement.addEventListener("click", option.onclick)
            dropdownContent.appendChild(optionElement)

            if (option.subOptions) {
                
            }
        }
    }
}