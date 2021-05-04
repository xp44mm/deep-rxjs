import { isObservable } from "rxjs";
import { Deep, objectToDeep } from "structural-comparison";
import { isRxType } from "./isRxType";

export function observableDeep(obj) {
    let deep = objectToDeep(obj, isRxType)
    let entries = deep.entries.filter(([path, v]) => isObservable(v))
    return new Deep(entries)
}