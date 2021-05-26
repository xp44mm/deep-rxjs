import { from, isObservable, Observable } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { Deep, objectToDeep } from 'structural-comparison'
import { isRxType } from './isRxType'

/**
 * 追蹤對象是哪個屬性發生了變化。
 * @param {Deep} model
 * @returns {Observable}
 */
export function deepMerge(model) {
    let deep = objectToDeep(model, v => isRxType(v))
        .filter(([keyPath, value]) => isObservable(value))

    return from(deep.entries)
        |> mergeMap(([keyPath, value]) => value |> map(value => [keyPath, value]))
}
