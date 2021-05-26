import { BehaviorSubject } from 'rxjs'
import { pickBehaviorSubject } from './pickBehaviorSubject'
import { ObservableArray } from './ObservableArray'

test('BehaviorSubject happy', done => {
    let source = new BehaviorSubject(0)
    let y = pickBehaviorSubject(source)
    expect(y).toEqual(0)
    done()
})

test('array happy', done => {
    let source = [new BehaviorSubject(0), new BehaviorSubject(1)]
    let y = pickBehaviorSubject(source)
    expect(y).toEqual([0, 1])
    done()
})

test('array error test', done => {
    let source = [new BehaviorSubject(0), 'error']
    expect(() => {
        pickBehaviorSubject(source)
    }).toThrow('dense Array')

    done()
})

test('object happy', done => {
    let source = { a: new BehaviorSubject(0), b: new BehaviorSubject(1) }
    let y = pickBehaviorSubject(source)
    expect(y).toEqual({ a: 0, b: 1 })
    done()
})

test('object ignore all', done => {
    let source = { a: 0, b: 1 }

    expect(() => {
        pickBehaviorSubject(source)
    }).toThrow('pickBehaviorSubject')

    done()
})

test('object ignore some', done => {
    let source = {
        a: new BehaviorSubject(0), b: 1, c: [], d: {}
    }
    let y = pickBehaviorSubject(source)

    expect(y).toEqual({ a: 0 })
    done()
})

test('pick observable array ignore some', done => {
    let source = {
        a: new ObservableArray()
    }

    source.a.insertBefore(new BehaviorSubject(0))
    source.a.insertBefore(new BehaviorSubject(1))
    source.a.insertBefore(new BehaviorSubject(2))

    source.a[1].next('1')
    let y = pickBehaviorSubject(source)

    expect(y).toEqual({ a: [0,'1',2] })
    done()
})

test('object pickeys', done => {
    let source = {
        a: new BehaviorSubject(0),
        b: new BehaviorSubject(0),
        pickeys() {
            return ['a']
        }
    }
    let y = pickBehaviorSubject(source)
    expect(y).toEqual({ a: 0 })

    done()
})





