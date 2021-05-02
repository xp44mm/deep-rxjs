import { Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { arrayInsert, arrayRemove } from 'structural-comparison'

export class ObservableArray extends Array {
    constructor(...args) {
        if (args.length > 0) {
            throw new Error('不能有参数')
        }
        super(...args)

        this.action = new Subject()

        this.insert$ = this.action
            |> filter(([action]) => action === 'insert')
            |> map(([_, item, index]) => [item, index])

        this.remove$ = this.action
            |> filter(([action]) => action === 'remove')
            |> map(([_, index]) => index)

        this.replace$ = this.action
            |> filter(([action]) => action === 'replace')
            |> map(([_, item, index]) => [item, index])
    }

    insert(item, index = [...this].length) {
        arrayInsert(this, item, index)
        this.action.next(['insert', item, index])
    }

    remove(index = [...this].length - 1) {
        arrayRemove(this, index)
        this.action.next(['remove', index])
    }

    replace(item, index) {
        this[index] = item
        this.action.next(['replace', item, index])
    }
}
