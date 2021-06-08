import { map } from 'rxjs/operators'
import { deepCombineLatest } from './deepCombineLatest'
import { observableDeep } from './observableDeep'

export function nestedCombineLatest(model) {
    let deep = observableDeep(model)
    return deepCombineLatest(deep) 
        |> map(deep => deep.toObject())
}
