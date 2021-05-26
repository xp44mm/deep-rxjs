import { ObservableArray } from './ObservableArray'

test('ObservableArray is Array', () => {
    let arr = new ObservableArray()
    expect(Array.isArray(arr)).toEqual(true)
})

test('test insertBefore', done => {
    let states = []
    let arr = new ObservableArray()

    arr.insertBefore$.subscribe(([item, index]) => { states.push(['insertBefore', item, index]) })
    arr.insertBefore(4)
    arr.insertBefore(3)
    arr.insertBefore(2, 0)

    expect(states).toEqual([
        ['insertBefore', 4, 0],
        ['insertBefore', 3, 1],
        ['insertBefore', 2, 0],
    ])

    expect([...arr]).toEqual([2, 4, 3])
    expect(arr.length).toEqual(3)

    done()
})

test('test removeChild', done => {
    let states = []
    let arr = new ObservableArray()
    arr.removeChild$.subscribe(index => { states.push(['removeChild', index]) })

    arr.insertBefore(4)
    arr.insertBefore(3)

    expect([...arr]).toEqual([4, 3])
    expect(arr.length).toEqual(2)
    arr.removeChild()
    arr.removeChild(0)
    expect(arr.length).toEqual(0)

    expect(states).toEqual([
        ['removeChild', 1],
        ['removeChild', 0],
    ])

    expect([...arr]).toEqual([])

    done()
})

test('test default argument', done => {
    let arr = new ObservableArray()

    arr.insertBefore(4)
    arr.insertBefore(3)

    expect([...arr]).toEqual([4, 3])
    arr.insertBefore(2)
    expect([...arr]).toEqual([4, 3, 2])

    arr.removeChild()
    expect([...arr]).toEqual([4, 3])

    arr.removeChild()
    expect([...arr]).toEqual([4])


    done()
})




test('test replaceChild', done => {
    let states = []
    let arr = new ObservableArray()

    arr.replaceChild$.subscribe(([item, index]) => { states.push(['replaceChild', item, index]) })

    arr.insertBefore(4)
    arr.insertBefore(3)
    arr.insertBefore(2, 0)

    expect([...arr]).toEqual([2, 4, 3])

    arr.replaceChild('4', 1)

    expect(states).toEqual([
        ['replaceChild', '4', 1],
    ])

    expect([...arr]).toEqual([2, '4', 3])

    done()
})

test('test action', done => {
    let states = []
    let arr = new ObservableArray()

    arr.action.subscribe(a => { states.push(a) })

    arr.insertBefore('a')
    arr.replaceChild('b', 0)
    arr.removeChild()

    expect(states).toEqual([
        ['insertBefore', 'a', 0],
        ['replaceChild', 'b', 0],
        ['removeChild', 0],

    ])

    expect([...arr]).toEqual([])

    done()
})

