import { BehaviorSubject } from 'rxjs'
import { behaviorSubjectDeep } from './behaviorSubjectDeep'

let obj = {
    a: new BehaviorSubject(0),
    b: 1,
    c: [new BehaviorSubject(1), new BehaviorSubject(2)],
    d: {},
}

test('test behaviorSubjectDeep', () => {
    let deep = behaviorSubjectDeep(obj)
    let y = deep.entries.map(([k, bs]) => [k, bs.value])
    let entries = [[['a'], 0], [['c', 0], 1], [['c', 1], 2]]

    expect(y).toEqual(entries)
})
