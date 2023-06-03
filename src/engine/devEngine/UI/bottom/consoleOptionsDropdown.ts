import { Subject } from "rxjs";

export class ConsoleOptionsDropdown {
    public selectEmitter: Subject<string> = new Subject<string>();
    private value: string = '';
    private options: string[] = [];
    private activeOption: number = 0;
    private stableValue: string = '';
    private inputFocused: boolean = false;
    private activeElement: HTMLElement | null = null;

    constructor(private container: HTMLElement, input: HTMLInputElement) {
        window.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowDown' && this.inputFocused && this.options.length) {
                e.stopImmediatePropagation()
                e.preventDefault()
                this.selectNext()
            } else if(e.key === 'ArrowUp' && this.inputFocused && this.options.length) {
                e.stopImmediatePropagation()
                e.preventDefault()
                this.selectPrev()
            } else if(e.key === 'Tab' && this.inputFocused && this.options.length) {
                e.stopImmediatePropagation()
                e.preventDefault()
                this.choose()
            }
        }, false)
        input.addEventListener('focusin', () => {
            this.inputFocused = true
            this.container.style.display = 'inline-block'
        })
        input.addEventListener('focusout', () => {
            this.inputFocused = false
            this.container.style.display = 'none'
        })
    }
    public setValue(value: string): void {
        if(this.value !== value) {
            this.value = value
            this.calculateOptions(value)
            this.container.style.marginLeft = (value.length * 7 - 12) + 'px'
        }
    }
    private calculateOptions(value: string): void {
        if(!value) {
            return
        }
        const arr = value.split(/[^a-zA-Z0-9_]/)

        const last = arr.splice( - 1, 1)[0]
        let workingObj: { [key: string]: any } = window
        for(const key of arr) {
            if(workingObj[key] instanceof Object) {
                workingObj = workingObj[key]
            }
        }
        const keys = this.getKeys(workingObj)
        this.stableValue = value.replace(new RegExp(last + '$'), '')
        this.options = keys.filter(key => new RegExp('^' + last).test(key) && key !== last)
        this.activeOption = 0
        this.renderOptions()
    }
    private getKeys(obj: {[key: string]: any, prototype?: Object, __proto__?: Object}): string[] {
        const keys = Object.keys(obj)
        if(obj.__proto__) {
            return keys.concat(this.getKeys(obj.__proto__))
        } else if(obj.prototype) {
            return keys.concat(this.getKeys(obj.prototype))
        }
        return keys
    }
    private selectNext(): void {
        if(this.activeOption < this.options.length - 1) {
            this.activeOption++
            this.renderOptions()
        }
    }
    private selectPrev(): void {
        if(this.activeOption > 0) {
            this.activeOption--
            this.renderOptions()
        }
    }
    private choose(): void {
        this.selectEmitter.next(this.stableValue + this.options[this.activeOption])
    }
    private renderOptions(): void {
        this.container.innerHTML = ''
        for(let i = 0; i < this.options.length; i++) {
            const option = document.createElement('div')
            option.classList.add('__wireframe-console-dropdown-option')
            option.innerHTML = this.options[i]
            if(i === this.activeOption) {
                option.classList.add('__wireframe-console-dropdown-option--active')
            }
            option.addEventListener('mouseenter', () => {
                this.activeElement?.classList.remove('__wireframe-console-dropdown-option--active')
                this.activeOption = i
                this.activeElement = option
                this.activeElement.classList.add('__wireframe-console-dropdown-option--active')
            })
            option.addEventListener('mousedown', () => {
                this.activeOption = i
                this.choose()
            })
            option.addEventListener('mouseleave', () => {
                this.activeElement?.classList.remove('__wireframe-console-dropdown-option--active')
            })
            this.container.appendChild(option)
        }
    }
}