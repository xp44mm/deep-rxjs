import { of } from 'rxjs'
import { extractProperty } from 'structural-comparison'
import { observableDeep } from './observableDeep'

test('test observableDeep', () => {
    let obj = {
        a: of(0),
        b: 1,
        c: [of(1), of(2)],
        d: {},
    }

    let deep = observableDeep(obj)

    let keys = [['a'], ['c', 0], ['c', 1]]
    expect(deep.keys).toEqual(keys)

    let entries = keys.map(k => [k, extractProperty(obj, k)])
    expect(deep.entries).toEqual(entries)
})
