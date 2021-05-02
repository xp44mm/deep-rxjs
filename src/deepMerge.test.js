import { BehaviorSubject } from 'rxjs'
import { deepMerge } from './deepMerge'

test('test deepMerge', done => {
    const source = {
        wetAir: new BehaviorSubject(true),
        oxiair: new BehaviorSubject(true),
        x: { c: [new BehaviorSubject(true)] },
    }

    let states = []


    deepMerge(source)
        |> (obs => obs.subscribe(data => { states.push(data) }))

    source.wetAir.next(false)
    source.oxiair.next(false)
    source.x.c[0].next(false)

    expect(states).toEqual([
        [['oxiair'], true],
        [['wetAir'], true],
        [['x', 'c', 0], true],

        [['wetAir'], false],
        [['oxiair'], false],
        [['x', 'c', 0], false],
    ])

    done()
})
