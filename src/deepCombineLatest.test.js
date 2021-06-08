import { BehaviorSubject, timer } from 'rxjs'
import { map } from 'rxjs/operators'
import { deepCombineLatest } from './deepCombineLatest'
import { observableDeep } from './observableDeep'

const model = {
    a: {
        b: new BehaviorSubject(0),
        c: new BehaviorSubject(1),
    },
    x: [new BehaviorSubject(2), new BehaviorSubject(3)]
}

test('test Deep entries', done => {
    let deep = observableDeep(model)
    expect(deep.entries).toEqual([
        [['a', 'b'], model.a.b],
        [['a', 'c'], model.a.c],
        [['x', 0], model.x[0]],
        [['x', 1], model.x[1]],

    ])

    done()
})

test('test Deep toobject', done => {


    let deep = observableDeep(model)
    let y = deep.toObject()
    expect(y).toEqual(model)

    done()
})


test('test deepCombineLatest', done => {

    const source = {
        a: {
            b: new BehaviorSubject(0),
            c: new BehaviorSubject(1),
        },
        x: [new BehaviorSubject(2), new BehaviorSubject(3)]
    }

    let deep = observableDeep(model)

    let states = []

    deepCombineLatest(deep)
        //|> map(deep => deep.entries)
        |> (obs => obs.subscribe({
            next: data => {
                console.log(data.entries)
                //states.push(data)
            }
        }))

    //expect(states).toEqual([[
    //    [['a', 'b'], 0],
    //    [['a', 'c'], 1],
    //    [['x', 0], 2],
    //    [['x', 1], 3],
    //]])

    source.a.b.next(10)
    source.a.c.next(11)

    done()

})

