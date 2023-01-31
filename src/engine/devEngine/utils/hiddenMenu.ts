export interface HiddenMenuOption {
    name: string;
    onclick?: (event: MouseEvent) => void;
    subOptions?: HiddenMenuOption[];
    disabled?: boolean;
}

export class HiddenMenu {
    container: HTMLElement;
    public isClosed: boolean = true;

    constructor(container: HTMLElement, options: HiddenMenuOption[]) {
        this.container = container;
        this.container.style.display = "none"
        for (let option of options) {
            const optionElement = document.createElement("button")
            optionElement.classList.add("__wireframe-hidden-menu-option")
            optionElement.innerHTML = `<span class="__wireframe-hidden-menu-option__content">${option.name}</span>`
            optionElement.disabled = option.disabled ?? false
            if(option.onclick && !option.disabled) {
                optionElement.addEventListener("click", option.onclick)
            }
            container.appendChild(optionElement)

            if (option.subOptions?.length && !option.disabled) {
                const subMenuContainer = document.createElement("div")
                subMenuContainer.classList.add("__wireframe-submenu-container")
                optionElement.appendChild(subMenuContainer)

                const subMenu = new HiddenMenu(subMenuContainer, option.subOptions || [])
                optionElement.addEventListener("mouseover", () => {
                    subMenu.open()
                })
                optionElement.addEventListener("mouseout", () => {
                    subMenu.close()
                })
            }
        }
    }
    open() {
        this.isClosed = false
        this.container.style.display = "block"
    }
    close() {
        this.isClosed = true
        this.container.style.display = "none"
    }
}