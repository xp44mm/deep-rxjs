import { BehaviorSubject } from 'rxjs'
import { deepMerge } from './deepMerge'
import { observableDeep } from './observableDeep'

test('test deepMerge 1', done => {
    let states = []

    const source = {
        a: {
            b: new BehaviorSubject(0),
            c: new BehaviorSubject(1),
        },
        x: [new BehaviorSubject(2), new BehaviorSubject(3)]
    }
    let deep = observableDeep(source)

    deepMerge(deep).subscribe(data => { states.push(data) })

    source.a.b.next(10)
    source.x[1].next(13)

    expect(states).toEqual([
        [['a', 'b'], 0],
        [['a', 'c'], 1],
        [['x', 0], 2],
        [['x', 1], 3],
        [['a', 'b'], 10],
        [['x', 1], 13],
    ])

    done()
})

