import { BehaviorSubject } from 'rxjs'
import { ObservableArray } from './ObservableArray'
import { pickBehaviorSubject } from './pickBehaviorSubject'
import { restore } from './restore'

test('BehaviorSubject happy', done => {
    let source = new BehaviorSubject(0)
    restore(source, 1)
    expect(source.value).toEqual(1)
    done()
})

test('array happy', done => {
    let source = [
        new BehaviorSubject(0),
        new BehaviorSubject(0),
    ]
    restore(source, [1, 2])
    let y = pickBehaviorSubject(source)
    expect(y).toEqual([1, 2])
    done()
})

test('array less', done => {
    let source = [
        new BehaviorSubject(0),
        new BehaviorSubject(0),
    ]
    restore(source, [1])
    let y = pickBehaviorSubject(source)
    expect(y).toEqual([1, 0])
    done()
})

test('nested happy', done => {
    let model = {
        title: new BehaviorSubject('compiler'),
        keywords: [
            new BehaviorSubject('lex'),
            new BehaviorSubject('yacc'),
        ]
    }
    let src = {
        title: 'lang',
        keywords: [
            'js',
            'fs',
        ]
    }
    restore(model, src)

    expect(model.title.value).toEqual(src.title)
    expect(model.keywords[0].value).toEqual(src.keywords[0])
    expect(model.keywords[1].value).toEqual(src.keywords[1])
    done()
})


test('array too much', done => {
    let source = [
        new BehaviorSubject(0),
        new BehaviorSubject(0),
    ]
    restore(source, [1, 2, 3])
    let y = pickBehaviorSubject(source)
    expect(y).toEqual([1, 2])
    done()
})

test('object ignore member', done => {
    let source = {
        a: new BehaviorSubject(0),
        b: 0
    }
    restore(source, { a: 1, b: 1 })
    let y = pickBehaviorSubject(source)
    expect(y).toEqual({ a: 1 })
    done()
})

test('observable array happy', done => {
    let source = new ObservableArray()

    source.insertBefore(new BehaviorSubject(0))
    source.insertBefore(new BehaviorSubject(0))
    source.insertBefore(new BehaviorSubject(0))

    restore(source, [1, 2, 3])
    let y = pickBehaviorSubject(source)
    expect(y).toEqual([1, 2, 3])
    done()
})

test('observable array cut off', done => {
    let source = new ObservableArray()

    source.insertBefore(new BehaviorSubject(0))
    source.insertBefore(new BehaviorSubject(0))
    source.insertBefore(new BehaviorSubject(0))
    source.insertBefore(new BehaviorSubject(0))

    restore(source, [1, 2, 3])
    let y = pickBehaviorSubject(source)
    expect(y).toEqual([1, 2, 3])
    done()
})


test('observable array complement', done => {
    let model = new ObservableArray()
    model.appendChild = (i) => model.insertBefore(new BehaviorSubject(0), i)

    model.insertBefore(new BehaviorSubject(0))

    let src = [1, 2, 3]
    restore(model, src)

    expect(model[0].value).toEqual(src[0])
    expect(model[1].value).toEqual(src[1])
    expect(model[2].value).toEqual(src[2])
    done()
})






