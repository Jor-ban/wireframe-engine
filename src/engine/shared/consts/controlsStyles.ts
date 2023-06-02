import {ChangeDetector} from "⚙️/devEngine/changeDetector";

export let topBarHeight: number = 20 as const
export let leftControlsWidth: number = 260 as const
export let rightControlsWidth: number = 360 as const
export let bottomControlsHeight: number = 360 as const

export function updateBottomControlsHeight(value: number, element?: HTMLElement): void {
    bottomControlsHeight = value
    ChangeDetector.controlStyleChanged$.next({
        controlName: 'bottom',
        element,
        value,
    })
}