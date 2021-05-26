import { BehaviorSubject } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { behaviorSubjectDeep } from './behaviorSubjectDeep'
import { deepCombineLatest } from './deepCombineLatest'

test('test deepCombineLatest', done => {
    let observables = {
        a: new BehaviorSubject(0),
        b: new BehaviorSubject(0),
        c: [
            new BehaviorSubject(0),
            new BehaviorSubject(0),
            {
                e: new BehaviorSubject(0),
            },
        ],
    }

    let e = { a: 0, b: 0, c: [0, 0, { e: 0 }] }

    let deep = behaviorSubjectDeep(observables)

    deepCombineLatest(deep)
        |> take(1)
        |> map(deep => deep.toObject())
        |> (obs =>
            obs.subscribe({
                next: data => {
                    expect(data).toEqual(e)
                },
                complete: done
            }))
})
