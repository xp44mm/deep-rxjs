import { BehaviorSubject } from 'rxjs'
import { nestedMerge } from './nestedMerge'

test('test nestedMerge 1', done => {
    const source = {
        a: {
            b: new BehaviorSubject(0),
            c: new BehaviorSubject(1),
        },
        x: [new BehaviorSubject(2), new BehaviorSubject(3)]
    }

    let states = []
    nestedMerge(source).subscribe(data => { states.push(data) })

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


test('test nestedMerge', done => {
    const source = {
        a: new BehaviorSubject(true),
        b: new BehaviorSubject(true),
        x: { c: [new BehaviorSubject(true)] },
    }
    let states = []
    nestedMerge(source)
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
