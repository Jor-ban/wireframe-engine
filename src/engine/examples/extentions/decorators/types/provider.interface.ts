import {InputParams} from "tweakpane";

export interface IProvider {
    add: (...objects: object[]) => void
    remove: (...objects: object[]) => void
    addTweak: <K extends object>(obj: K, key: keyof K, params: InputParams & {onChangeFn: (value: K[keyof K]) => void}) => void
}