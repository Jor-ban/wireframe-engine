import {BindingParams} from "@tweakpane/core/src/blade/common/api/params";

export interface IProvider {
    add: (...objects: object[]) => void
    remove: (...objects: object[]) => void
    addTweak: <K extends object>(obj: K, key: keyof K, params: BindingParams & {onChangeFn: (value: K[keyof K]) => void}) => void
}