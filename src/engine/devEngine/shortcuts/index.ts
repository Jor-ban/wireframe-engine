import {filter, merge, Observable, Subject} from "rxjs";

export interface ShortcutKeyOptions {
    CtrlPressed ?: boolean | undefined
    ShiftPressed ?: boolean | undefined
    AltPressed ?: boolean | undefined,
    stopPropagation ?: boolean | undefined,
    preventDefault ?: boolean | undefined,
    StopImmediatePropagation ?: boolean | undefined
}

class ShortcutsFactory extends Subject<KeyboardEvent> {
    private _keyDown: Subject<KeyboardEvent> = new Subject<KeyboardEvent>()
    constructor() {
        super();
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            if(!(e.target instanceof HTMLInputElement)) {
                this.next(e)
            }
        })
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if(!(e.target instanceof HTMLInputElement)) {
                this._keyDown.next(e)
            }
        })
    }
    key(
        key: string | number,
        keyOptions : ShortcutKeyOptions | undefined = undefined
    ) : Observable<KeyboardEvent> {
        return this.listenTo(this, key, keyOptions)
    }
    keyUp(
        key: string | number,
        keyOptions : ShortcutKeyOptions | undefined = undefined
    ): Observable<KeyboardEvent> {
        return this.listenTo(this, key, keyOptions)
    }
    keyDown(
        key: string | number,
        keyOptions : ShortcutKeyOptions | undefined = undefined
    ) : Observable<KeyboardEvent> {
        return this.listenTo(this._keyDown, key, keyOptions)
    }
    private listenTo($: Observable<KeyboardEvent>, key: string | number, keyOptions : ShortcutKeyOptions | undefined = undefined) {
        return $.pipe(filter((e: KeyboardEvent) => {
            let res = true
            if(keyOptions) {
                const { CtrlPressed, ShiftPressed, AltPressed } = keyOptions
                if (CtrlPressed !== undefined) {
                    res = res && e.ctrlKey === CtrlPressed
                }
                if (ShiftPressed !== undefined) {
                    res = res && e.shiftKey === ShiftPressed
                }
                if (AltPressed !== undefined) {
                    res = res && e.altKey === AltPressed
                }
            }
            res = res && (
                e.key === key ||
                e.code === key ||
                e.code.replace(/key|digit|numpad/i, '').toLowerCase() == String(key).toLowerCase()
            )
            if(res) {
                if(keyOptions?.stopPropagation) {
                    e.stopPropagation()
                }
                if(keyOptions?.preventDefault) {
                    e.preventDefault()
                }
                if(keyOptions?.StopImmediatePropagation) {
                    e.stopImmediatePropagation()
                }
            }
            return res
        }))
    }
    figureKey(key: 'Ctrl' | 'Shift' | 'Alt'): Observable<KeyboardEvent> {
        let validKeyName: string = key
        if(key === 'Ctrl') {
            validKeyName = 'Control'
        }
        const keyUp = this.pipe( filter((e: KeyboardEvent) => {
            return e.code.replace(/Left|Right/i, '') === validKeyName
        }))
        const _keyDown = this._keyDown.pipe( filter((e: KeyboardEvent) => {
            return e.code.replace(/Left|Right/i, '') === validKeyName
        }))
        return merge(keyUp, _keyDown)
    }
}

export const KeyEvent = new ShortcutsFactory()