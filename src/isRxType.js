import { isObservable, Subscription } from 'rxjs'

export function isRxType(obj) {
    return obj && typeof obj === 'object' &&
        (isObservable(obj) || obj instanceof Subscription)
}
