import { BehaviorSubject } from 'rxjs'
import { extractProperty } from 'structural-comparison'
import { behaviorSubjectDeep } from './behaviorSubjectDeep'

test('test behaviorSubjectDeep', () => {
    let obj = {
        a: new BehaviorSubject(0),
        b: 1,
        c: [new BehaviorSubject(1), new BehaviorSubject(2)],
        d: {},
    }
    let keys = [
        ['a'],
        ['c', 0],
        ['c', 1],
    ]
    let entries = keys.map(k => [k, extractProperty(obj, k)])
    let deep = behaviorSubjectDeep(obj)

    expect(deep.keys).toEqual(keys)
    expect(deep.entries).toEqual(entries)
})
