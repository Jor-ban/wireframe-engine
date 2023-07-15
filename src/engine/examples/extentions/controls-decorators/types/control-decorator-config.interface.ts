export interface ControlDecoratorConfigInterface {
    name?: string
    addInDev?: boolean
    type: String | Number
    min?: number
    max?: number
    step?: number
    defaultValue?: string | number
    onUpdate?: (object: any) => void
}