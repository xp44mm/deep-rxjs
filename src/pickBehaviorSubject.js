import { BehaviorSubject, isObservable } from 'rxjs'
import { pickObject } from 'structural-comparison'
import { isRxType } from './isRxType'
import { ObservableArray } from './ObservableArray'

/**
 * 拾取对象中的BehaviorSubject值，作爲葉子節點，忽略其他值。
 * @param {{}} value
 *
 */
export function pickBehaviorSubject(value) {
    let x = loop(value, '', null)
    if (x.length === 1) {
        return x[0][1]
    } else {
        throw new Error('pickBehaviorSubject')
    }
}

const loop = (value, key, parent) => {
    if (isObservable(value) && value instanceof BehaviorSubject) {
        //保存葉節點
        return [[key, value.value]]
    } else if (value === null || typeof value !== 'object' || isRxType(value)) {
        return []
    } else if (value instanceof ObservableArray) {
        let v = [...value].map((e, i) => {
            let pelem = loop(e, i, value)
            if (pelem.length === 1) {
                return pelem[0][1]
            } else {
                throw new Error('dense Array')
            }
        })
        return [[key, v]]
    } else if (value instanceof Array) {
        if (value.length === 0) {
            return []
        } else {
            let v = value.map((e, i) => {
                let pelem = loop(e, i, value)
                if (pelem.length === 1) {
                    return pelem[0][1]
                } else {
                    throw new Error('dense Array')
                }
            })

            return [[key, v]]
        }
    } else if ('pickeys' in value) {
        return loop(pickObject(value, value.pickeys()), key, parent)
    } else {
        let entries = Object.entries(value)
        if (entries.length === 0) {
            return []
        } else {
            let ee = entries
                .map(([k, v]) => loop(v, k, parent))
                .reduce((acc, val) => [...acc, ...val], [])
            if (ee.length === 0) {
                return []
            } else {
                return [[key, Object.fromEntries(ee)]]
            }
        }
    }
}
