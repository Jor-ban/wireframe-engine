import { TabPageApi } from 'tweakpane';
import { BehaviorSubject } from "rxjs";

export const defaultConsole = {
	error : console.error,
	log   : console.log,
	warn  : console.warn,
	clear : console.clear,
	info  : console.info
}

const errorsNum = new BehaviorSubject(0)
export const errorsCount = errorsNum.asObservable()
const warnsNum = new BehaviorSubject(0)
export const warnsCount = warnsNum.asObservable()

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

	public inputLog(msg: string) {
		const div = document.createElement('div')
		div.classList.add('__wireframe-flex')
		div.innerHTML = `<small> ${this.getTime()} &nbsp;&nbsp;&nbsp;&nbsp; </small> ${msg}`
		this.element.appendChild(div)
	}

	private error(...message: (any)[]): void {
		errorsNum.next(errorsNum.value + 1)
		const err = document.createElement('div')
		err.classList.add('__wireframe-error')
		this.element.appendChild(err)
		for(const msg of message) {
			if(msg instanceof Error) {
				this.logSimpleData(err, msg.message)
			} else if (msg instanceof Object) {
				this.logTimeAndObject(msg, err)
			} else {
				this.logSimpleData(err, msg)
			}
		}
		defaultConsole.error(...message)
	}
	private log(...message: (any)[]): void {
		for(const msg of message) {
			if(msg instanceof Object) {
				this.logTimeAndObject(msg, this.element)
			} else {
				this.logSimpleData(this.element, msg)
			}
		}
		defaultConsole.log(...message)
	}
	private warn(...message: (any)[]): void {
		warnsNum.next(warnsNum.value + 1)
		const warn = document.createElement('div')
		warn.classList.add('__wireframe-warn')
		this.element.appendChild(warn)
		for(const msg of message) {
			if (msg instanceof Object) {
				this.logObject(msg, false, warn)
			} else {
				this.logSimpleData(warn, msg)
			}
		}
		defaultConsole.warn(...message)
	}
	public clear(): void {
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
				this.logSimpleData(info, msg)
			}
		}
		defaultConsole.info(...message)
	}
	private logObject(obj: Array<any> | Object, expanded: boolean = false, element: HTMLElement | null = null, firstInChain: boolean = true) {
		this.toggleObject(obj, expanded, element || this.element, true, firstInChain)
	}
	private logSimpleData(container: HTMLElement, msg: any): void {
		const div = document.createElement('div')
		div.classList.add('__wireframe-flex')
		div.innerHTML = `<small> ← ${this.getTime()} &nbsp;&nbsp;&nbsp;&nbsp; ${msg} </small>`
		container.appendChild(div)
	}
	private logTimeAndObject(obj: Object | Array<any>, root: HTMLElement) {
		const parent = document.createElement('div')
		parent.classList.add('__wireframe-flex')
		root.appendChild(parent)
		const time = document.createElement('div')
		time.innerHTML = `<small> ← ${ this.getTime() } &nbsp;&nbsp;&nbsp;&nbsp; </small>`
		parent.appendChild(time)
		this.logObject(obj, false, parent)
	}
	private toggleObject(
		obj: Object,
		expanded: boolean = false,
		element: HTMLElement,
		create: boolean = false,
		firstInChain: boolean = true
	) {
		const keys = Object.keys(obj)
		const values = Object.values(obj)
		if(create) {
			const button = document.createElement('button')
			button.innerText = '▼'
			const parent = document.createElement('span')
			let expanded: boolean = false

			button.addEventListener('click', () => {
				if(expanded) {
					button.classList.remove('__wireframe-button-opened')
					button.innerText = '▼'
					this.toggleObject(obj, false, element, false, firstInChain)
					element.classList.remove('__wireframe-logs_first-object')
					expanded = false
				} else {
					button.classList.add('__wireframe-button-opened')
					this.toggleObject(obj, true, element, false, firstInChain)
					button.innerHTML = this.styleCollabsedKey(Object.getPrototypeOf(obj).constructor.name + ' ►')
					expanded = true
				}
			})

			if(keys.length) {
				element.appendChild(button)
				parent.addEventListener('click', (event: MouseEvent) => {
					event.stopImmediatePropagation()
					if(!expanded) {
						button.classList.add('__wireframe-button-opened')
						this.toggleObject(obj, true, element, false, firstInChain)
						button.innerHTML = this.styleCollabsedKey(Object.getPrototypeOf(obj).constructor.name + ' ►')
						expanded = true
					}
				})
			}
			element.appendChild(parent)
			element = parent
		}
		element.innerHTML = ''
		if(!expanded) { // for shortened version
			element.classList.remove('__wireframe-logs_data-area')
			element.innerHTML += Array.isArray(obj) ? '[ ' : '{ '
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i]
				const value = values[i]
				if (i > 3) {
					element.innerHTML += this.styleCollabsedKey('...')
					break;
				}
				element.innerHTML +=
					(Array.isArray(obj) ? '' : this.styleCollabsedKey(key) + ': ') +
					(
						Array.isArray(value) ? `Array(${value.length})` :
						typeof value === 'object' ? '{...}' :
						this.styleFieldValue(value)
					)
					+ (i !== keys.length - 1 ? ', ' : '')
			}
			element.innerHTML += (Array.isArray(obj) ? ' ]' : ' }') +' <br/>'
		} else { // for expanded version
			element.classList.add('__wireframe-logs_data-area')
			if(firstInChain)
				element.classList.add('__wireframe-logs_first-object')

			for (let i = 0; i < keys.length; i++) {
				const key = keys[i]
				const value = values[i]
				if(typeof value === 'function') {
					const text = document.createElement('div')
					text.innerHTML = `${ this.styleFieldKey(key) }: ${ this.styleFieldValue(value) }, </br>`
					element.appendChild(text)
				} else if(value instanceof Object) { // for objects and arrays
					const innerText = document.createElement('span')
					innerText.innerHTML = `${ this.styleFieldKey(key) } : `
					element.appendChild(innerText)
					this.logObject(value, false, element, false)
				} else {
					const text = document.createElement('div')
					text.innerHTML = `${ this.styleFieldKey(key) }: ${ this.styleFieldValue(value) }, </br>`
					element.appendChild(text)
				}
			}
		}
	}
	private getTime() {
		const d = new Date();
		const h = d.getHours();
		const m = d.getMinutes();
		const s = d.getSeconds()
		return `${ h > 9 ? h : '0' + h }:${ m > 9 ? m : '0' + m }:${ s > 9 ? s : '0' + s }`
	}
	private styleFieldKey(key: string) {
		return `<span class="__wireframe-logs_field-key">${ key }</span>`
	}
	private styleCollabsedKey(key: string) {
		return `<span class="__wireframe-logs_collapsed-key">${ key }</span>`
	}
	private styleFieldValue(value: any) {
		let classes: string = `__wireframe-logs_field-value `
		if(typeof value === 'function') {
			classes += '__wireframe-logs-field-value-function'
			return `<span class="${ classes }">${ value.name + ' f()' }</span>`
		}
		else if(typeof value === 'number')
			classes += '__wireframe-logs_field-value-number'
		else if(typeof value === 'boolean')
			classes += '__wireframe-logs_field-value-boolean'
		else if(typeof value === 'string')
			classes += '__wireframe-logs_field-value-string'

		return `<span class="${ classes }">${ value }</span>`
	}
}
