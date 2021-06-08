import { of } from 'rxjs'
import { nestedCombineLatest } from './nestedCombineLatest'

test('test deepCombineLatest', complete => {
    const model = {
        a: {
            b: of(0),
            c: of(1),
        },
        x: [of(2), of(3)],
    }

    nestedCombineLatest(model).subscribe({
        next: data => {
            expect(data).toEqual({
                a: {
                    b: 0,
                    c: 1,
                },
                x: [2, 3],
            })
        },
        complete,
    })
})
