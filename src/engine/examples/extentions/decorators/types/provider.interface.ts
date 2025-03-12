export interface IProvider {
    add: (...objects: object[]) => void
    remove: (...objects: object[]) => void
}