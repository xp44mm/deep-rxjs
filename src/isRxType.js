import { isObservable, Subscription } from 'rxjs'

export function isRxType(obj) {
    return isObservable(obj) ||
        obj instanceof Subscription
}
