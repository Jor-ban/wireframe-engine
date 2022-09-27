import {BehaviorSubject} from "rxjs";
import {Object3D} from "three";

export interface DetectedChange {
    type: ChangeType,
    object?: Object3D,
}
export enum ChangeType {
    CLICKED_OBJECT,
    HOVERED_OBJECT,
    ADDED_OBJECT,
    REMOVED_OBJECT,
    UPDATED_OBJECT,
    VOID,
}
export const changeDetector = new BehaviorSubject<DetectedChange>({ type: ChangeType.VOID })


