import { combineLatest, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Deep, replaceValueDeep } from 'structural-comparison'


///同combineLatest操作符，不同於合并數組，本函數合并的為Deep對象。

/**
 * 
 * @param {Deep} deep
 * @returns {Observable}
 */
export function deepCombineLatest(deep = new Deep()) {
    return (
        combineLatest(deep.getValues())
        |> map(values =>
            deep |> replaceValueDeep(values))
    )
}
