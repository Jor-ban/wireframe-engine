import { TabPageApi } from "tweakpane";
import {ConsoleOptionsDropdown} from "⚙️/devEngine/UI/bottom/consoleOptionsDropdown";

declare global {
    interface Window { [key: string]: Function; }
}

export class Console {
    private readonly input: HTMLInputElement
    private listeners: ((value: string) => void)[] = []
    constructor(pane: TabPageApi) {
        const container = pane.addFolder({ title: 'Console' }).element
        container.classList.add('__wireframe-console')
        container.innerHTML = '<span> ❱ </span>'
        this.input = document.createElement('input')
        this.input.classList.add('__wireframe-console-input')
        this.input.placeholder = 'Type here...'
        const dropDown = new ConsoleOptionsDropdown(this.input)

        this.input.addEventListener('keyup', (e) => {
            if(e.key === 'Enter') {
                const value = this.input.value
                this.input.value = ''
                this.listeners.forEach(listener => listener(value))
                try {
                    console.log(eval(value))
                } catch(err) {
                    console.error(err)
                }
            } else {
                dropDown.setValue(this.input.value)
            }
        })
        container.appendChild(this.input)
    }

    public addInputListener(listener: (value: string) => void): void {
        this.listeners.push(listener)
    }

    public addFunction(func: Function): void
    public addFunction(name: string, func: Function): void
    public addFunction(nameOrFunction: string | Function, func?: Function): void {
        if(typeof nameOrFunction === 'function' && nameOrFunction.name) {
            const name = nameOrFunction.name
            if(window[name])
                throw new Error(`[Console -> addFunction]: Function with name ${name} already exists`)
            window[name] = nameOrFunction
        } else if(typeof nameOrFunction === 'string' && func) {
            if(window[nameOrFunction])
                throw new Error(`[Console -> addFunction]: Function with name ${nameOrFunction} already exists`)
            window[nameOrFunction] = func
        } else if(typeof nameOrFunction === 'string' && func) {
            throw new Error('[Console -> addFunction]: function is not specified (expected name and/or non-lambda function')
        } else {
            throw new Error('[Console -> addFunction]: Invalid arguments (expected name and/or non-lambda function)')
        }
    }
}