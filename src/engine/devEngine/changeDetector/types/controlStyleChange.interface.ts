export interface IControlStyleChange {
    controlName: 'top' | 'left' | 'right' | 'bottom';
    element ?: HTMLElement;
    value: number;
}
