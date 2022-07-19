import { TabPageApi } from 'tweakpane';

const defaultConsole = {
	error : console.error,
	log   : console.log,
	warn  : console.warn,
	clear : console.clear,
	info  : console.info
}
export class Logger {
	element: HTMLElement;
	constructor(pane: TabPageApi) {
		this.element = pane.addFolder({ title: 'Logs' }).element
		this.element.classList.add('__wireframe-logs')
		this.element.innerHTML = ''
		console.error = this.error.bind(this)
		console.log = this.log.bind(this)
		console.warn = this.warn.bind(this)
		console.clear = this.clear.bind(this)
		console.info = this.info.bind(this)
	}
	private error(...message: (any)[]): void {
		const err = document.createElement('div')
		err.classList.add('__wireframe-error')
		this.element.appendChild(err)
		for(const msg of message) {
			if (msg instanceof Object) {
				this.logTimeAndObject(msg, err)
			} else {
				err.innerHTML += `
				<p>
					${ this.getTime() } &nbsp;&nbsp;&nbsp;&nbsp;
					${ msg }
				</p>`
			}
		}
		defaultConsole.error(...message)
	}
	private log(...message: (any)[]): void {
		for(const msg of message) {
			if(msg instanceof Object) {
				this.logTimeAndObject(msg, this.element)
			} else {
				this.element.innerHTML += `
				<p>
					${ this.getTime() } &nbsp;&nbsp;&nbsp;&nbsp;
					<span>${ msg }</span>
				</p>`
			}
		}
		defaultConsole.log(...message)
	}
	private warn(...message: (any)[]): void {
		const warn = document.createElement('div')
		warn.classList.add('__wireframe-warn')
		this.element.appendChild(warn)
		for(const msg of message) {
			if (msg instanceof Object) {
				this.logObject(msg, false, warn)
			} else {
				warn.innerHTML += `
				<p>
					${ this.getTime() } &nbsp;&nbsp;&nbsp;&nbsp;
					${ msg }
				</p>`
			}
		}
		defaultConsole.warn(...message)
	}
	private clear(): void {
		this.element.innerHTML = ''
		defaultConsole.clear()
	}
	private info(...message: (any)[]): void {
		const info = document.createElement('div')
		info.classList.add('__wireframe-info')
		this.element.appendChild(info)
		for(const msg of message) {
			if (msg instanceof Object) {
				this.logTimeAndObject(msg, info)
			} else {
				info.innerHTML += `
				<p>
					${ this.getTime() } &nbsp;&nbsp;&nbsp;&nbsp;
					${ msg }
				</p>`
			}
		}
		defaultConsole.info(...message)
	}
	private logObject(obj: Array<any> | Object, expanded: boolean = false, element: HTMLElement | null = null) {
		if (Array.isArray(obj)) {
			this.toggleArray(obj, expanded, element || this.element, true)
		} else {
			this.toggleObject(obj, expanded, element || this.element, true)
		}
	}
	private logTimeAndObject(obj: Object | Array<any>, root: HTMLElement) {
		const parent = document.createElement('div')
		parent.classList.add('__wireframe-flex')
		root.appendChild(parent)
		const time = document.createElement('div')
		time.innerHTML = `${ this.getTime() } &nbsp;&nbsp;&nbsp;&nbsp;`
		parent.appendChild(time)
		this.logObject(obj, false, parent)
	}
	private toggleArray(arr: Array<any>, expanded: boolean = false, element: HTMLElement, create: boolean = false) {
		if(create) {
			const parent = document.createElement('div')
			parent.classList.add('__wireframe-flex')
			element.appendChild(parent)
			const button = document.createElement('button')
			button.innerText = '▼'
			parent.appendChild(button)
			button.addEventListener('click', () => {
				if(button.classList.contains('__wireframe-button-opened')) {
					button.classList.remove('__wireframe-button-opened')
					button.innerText = '▼'
					this.toggleArray(arr, false, element)
				} else {
					if(arr.length) {
						button.classList.add('__wireframe-button-opened')
						this.toggleArray(arr, true, element)
					}
					button.innerText = '►'
				}
			})
			const dataArea = document.createElement('div')
			parent.appendChild(dataArea)
			element = dataArea
		}
		element.innerHTML = ''
		if(!expanded) {
			element.innerHTML += '['
			for (let i = 0; i < arr.length; i++) {
				if (i > 5) {
					element.innerHTML += '...'
					break;
				}
				element.innerHTML += (arr[i] instanceof Array ? `Array(${arr[i].length})` : arr[i])
					+ (i !== arr.length - 1 ? ', ' : '')
			}
			element.innerHTML += ']'
		} else {
			element.innerHTML += '[ <br>'
			for (let i = 0; i < arr.length; i++) {
				if(arr[i] instanceof Object) {
					const parent = document.createElement('div')
					parent.classList.add('__wireframe-flex')
					element.appendChild(parent)
					const innerText = document.createElement('span')
					innerText.innerHTML = `&nbsp;&nbsp; ${ i } : `
					const innerObject = document.createElement('div')
					parent.appendChild(innerText)
					parent.appendChild(innerObject)
					this.logObject(arr[i], false, innerObject)
				} else {
					element.innerHTML += `&nbsp;&nbsp; ${ i } : ${ arr[i] }, <br>`
				}
			}
			const close = document.createElement('span')
			close.innerText = ']'
			element.appendChild(close)
		}
	}
	private toggleObject(obj: Object, expanded: boolean = false, element: HTMLElement, create: boolean = false) {
		const keys = Object.keys(obj)
		const values = Object.values(obj)
		if(create) {
			const parent = document.createElement('div')
			parent.classList.add('__wireframe-flex')
			element.appendChild(parent)
			const button = document.createElement('button')
			button.innerText = '▼'
			parent.appendChild(button)
			button.addEventListener('click', () => {
				if(button.classList.contains('__wireframe-button-opened')) {
					button.classList.remove('__wireframe-button-opened')
					button.innerText = '▼'
					this.toggleObject(obj, false, element)
				} else {
					if(keys.length) {
						button.classList.add('__wireframe-button-opened')
						this.toggleObject(obj, true, element)
					}
					button.innerText = '►'
				}
			})
			const dataArea = document.createElement('div')
			parent.appendChild(dataArea)
			element = dataArea
		}
		element.innerHTML = ''
		if(!expanded) {
			element.innerHTML += '{ '
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i]
				const value = values[i]
				if (i > 3) {
					element.innerHTML += '...'
					break;
				}
				element.innerHTML += key + ': ' +
					(value instanceof Array ? `Array(${value.length})` : value)
					+ (i !== keys.length - 1 ? ', ' : '')
			}
			element.innerHTML += ' }'
		} else {
			element.innerHTML += '{ <br>'
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i]
				const value = values[i]
				if(value instanceof Object) {
					const parent = document.createElement('div')
					parent.classList.add('__wireframe-flex')
					element.appendChild(parent)
					const innerText = document.createElement('span')
					innerText.innerHTML = `&nbsp;&nbsp; ${ key } : `
					const innerObject = document.createElement('div')
					parent.appendChild(innerText)
					parent.appendChild(innerObject)
					this.logObject(value, false, innerObject)
				} else {
					const text = document.createElement('div')
					text.innerHTML = `&nbsp;&nbsp; ${ key }: ${ value }, </br>`
					element.appendChild(text)
				}
			}
			const close = document.createElement('span')
			close.innerText = '}'
			element.appendChild(close)
		}
	}
	private getTime() {
		const d = new Date();
		const h = d.getHours();
		const m = d.getMinutes();
		const s = d.getSeconds()
		return `${ h > 9 ? h : '0' + h }:${ m > 9 ? m : '0' + m }:${ s > 9 ? s : '0' + s }`
	}
}
