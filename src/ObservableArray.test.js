import { ObservableArray } from './ObservableArray'

test('ObservableArray is Array', () => {
    let arr = new ObservableArray()
    expect(Array.isArray(arr)).toEqual(true)
})

test('test insert', done => {
    let states = []
    let arr = new ObservableArray()

    arr.insert$.subscribe(([item, index]) => { states.push(['insert', item, index]) })
    arr.insert(4)
    arr.insert(3)
    arr.insert(2, 0)

    expect(states).toEqual([
        ['insert', 4, 0],
        ['insert', 3, 1],
        ['insert', 2, 0],
    ])

    expect([...arr]).toEqual([2, 4, 3])


    done()
})

test('test remove', done => {
    let states = []
    let arr = new ObservableArray()

    //arr.insert$.subscribe(([item, index]) => { states.push(['insert', item, index]) })
    arr.remove$.subscribe(index => { states.push(['remove', index]) })

    arr.insert(4)
    arr.insert(3)

    expect([...arr]).toEqual([4, 3])

    arr.remove()
    arr.remove(0)


    expect(states).toEqual([
        ['remove', 1],
        ['remove', 0],
    ])

    expect([...arr]).toEqual([])

    done()
})


test('test replace', done => {
    let states = []
    let arr = new ObservableArray()

    arr.replace$.subscribe(([item, index]) => { states.push(['replace', item, index]) })

    arr.insert(4)
    arr.insert(3)
    arr.insert(2, 0)

    expect([...arr]).toEqual([2, 4, 3])

    arr.replace('4', 1)

    expect(states).toEqual([
        ['replace', '4', 1],
    ])

    expect([...arr]).toEqual([2, '4', 3])

    done()
})
