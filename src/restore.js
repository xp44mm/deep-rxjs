import { BehaviorSubject } from 'rxjs'
import { isRxType } from './isRxType'
import { ObservableArray } from './ObservableArray'

/**
 * 更新ViewModel为新值src。
 * @param {any} model
 * @param {any} src 新值
 */
export const restore = (model, src) => {
    loop(model, src)
    return model
}

const loop = (o, src) => {
    if (o instanceof BehaviorSubject) {
        //输入值
        o.next(src)
    } else if (o === null || typeof o !== 'object' || isRxType(o)) {
        //noop
    } else if (o instanceof ObservableArray) {
        let len = o.length
        let diffcount = len - src.length
        if (diffcount > 0) {
            //截長
            Array.from({ length: diffcount })
                .map((e, i) => len - 1 - i)
                .forEach((last) => {
                    o.removeChild(last)
                })
        } else if (diffcount < 0) {
            //補短
            Array.from({ length: -diffcount })
                .map((e, i) => len + i)
                .forEach(i => {
                    //Add an item to the end of an Array
                    o.appendChild(i)
                })
        }

        //对齐后，修改各元素的值
        for (let i of o.keys()) {
            loop(o[i], src[i])
        }
    } else if (o instanceof Array) {
        //普通数组,元组
        let indexes = o.length < src.length ? o : src
        //src多余忽略尾部，不足的无操作noop，
        for (let i of indexes.keys()) {
            // todo: 当o[i]为不可设置时抛出异常？
            loop(o[i], src[i])
        }
    } else if (typeof o === 'object') {
        //普通对象成员递归
        Object.entries(o)
            .filter(([k, v]) => k in src) //交集
            .forEach(([k, v]) => {
                loop(v, src[k])
            })
    }
}
