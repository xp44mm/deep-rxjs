import { Observable } from 'rxjs'
import { deepMerge } from './deepMerge'
import { observableDeep } from './observableDeep'

/**
 * 追蹤對象是哪個屬性發生了變化。
 * @param {any} model
 * @returns {Observable}
 */
export function nestedMerge(model) {
    let deep = observableDeep(model)
    return deepMerge(deep)
}
