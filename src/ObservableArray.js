import { Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { arrayInsert, arrayRemove } from 'structural-comparison'

export class ObservableArray extends Array {
    constructor(...args) {
        if (args.length > 0) {
            throw new Error('不能有参数')
        }
        super()

        this.action = new Subject()

        this.insertBefore$ = this.action
            |> filter(([action]) => action === 'insertBefore')
            |> map(([_, item, index]) => [item, index])

        this.removeChild$ = this.action
            |> filter(([action]) => action === 'removeChild')
            |> map(([_, index]) => index)

        this.replaceChild$ = this.action
            |> filter(([action]) => action === 'replaceChild')
            |> map(([_, item, index]) => [item, index])
    }

    insertBefore(item, index = this.length) {
        arrayInsert(this, item, index)
        this.action.next(['insertBefore', item, index])
    }

    removeChild(index = this.length - 1) {
        arrayRemove(this, index)
        this.action.next(['removeChild', index])
    }

    replaceChild(item, index) {
        this[index] = item
        this.action.next(['replaceChild', item, index])
    }
}
