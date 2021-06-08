import { from, Observable } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { Deep } from 'structural-comparison'

/**
 * 追蹤對象是哪個屬性發生了變化。
 * @param {Deep} deep
 * @returns {Observable}
 */
export function deepMerge(deep) {
    return from(deep.entries)
        |> mergeMap(([keyPath, value]) =>
            value
            |> map(value => [keyPath, value])
        )
}
