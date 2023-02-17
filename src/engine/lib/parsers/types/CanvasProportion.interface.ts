export interface CanvasProportion {
    width: number;
    height: number;
    updateStyle ?: boolean;
    disableResizeUpdate ?: boolean // do nothing if window is resized
}