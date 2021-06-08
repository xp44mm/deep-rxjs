import { combineLatest, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Deep, replaceValueDeep } from 'structural-comparison'

/**
 * 返回一个Observable实例，组合成同形状的Deep发射，词条值为对应源Observable的值。
 * @param {Deep} deep
 * @returns {Observable}
 */
export function deepCombineLatest(deep = new Deep([])) {
    return combineLatest(deep.getValues())
        |> map(values => deep |> replaceValueDeep(values))
}
