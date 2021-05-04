import { of } from 'rxjs'
import { take } from 'rxjs/operators'
import { deepCombineLatest } from './deepCombineLatest'
import { observableDeep } from './observableDeep'

let obj = {
    a: of(0),
    b: 1,
    c: [of(1), of(2)],
    d: {},
}

test('test observableDeep', done => {
    let deep = observableDeep(obj)
    let entries = [[['a'], 0], [['c', 0], 1], [['c', 1], 2]]
    expect.assertions(1);
    deepCombineLatest(deep)
        |> take(1)
        |> (o => o.subscribe({
            next: deep => {
                expect(deep.entries).toEqual(entries)
            },
            complete: done
        }))

})
