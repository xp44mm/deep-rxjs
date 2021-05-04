import { BehaviorSubject } from "rxjs";
import { Deep, objectToDeep } from "structural-comparison";
import { isRxType } from "./isRxType";

export function behaviorSubjectDeep(obj) {
    let deep = objectToDeep(obj, isRxType)
    let entries = deep.entries.filter(([path, v]) => v instanceof BehaviorSubject)
    return new Deep(entries)
}