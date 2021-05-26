import { BehaviorSubject } from 'rxjs'
import { deepMerge } from './deepMerge'

test('test deepMerge', done => {
    const source = {
        a: new BehaviorSubject(true),
        b: new BehaviorSubject(true),
        x: { c: [new BehaviorSubject(true)] },
    }
    let states = []
    deepMerge(source)
        |> (obs => obs.subscribe(data => { states.push(data) }))
    source.a.next(false)
    source.b.next(false)
    source.x.c[0].next(false)
    expect(states).toEqual([
        [['a'], true],
        [['b'], true],
        [['x', 'c', 0], true],
        [['a'], false],
        [['b'], false],
        [['x', 'c', 0], false],
    ])
    done()
})
