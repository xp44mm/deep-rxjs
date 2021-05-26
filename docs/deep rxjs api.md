# deep rxjs api

## isRxType

签名

```js
import { restore } from 'deep-rxjs'
let bool = isRxType(obj)
```

判断`obj`是否为`rxjs`中的类型。包括`Observable`或`Subscription`及他们的派生类型。

## pickBehaviorSubject

签名

```js
import { pickBehaviorSubject } from 'deep-rxjs'
let obj = pickBehaviorSubject(model)
```

`BehaviorSubject`表示一个状态，并且当状态变化时，会向下游发出通知。`BhaviorSubject`表示的状态经常被组织好，放在一个结构化的对象中，这个对象常常用作为数据模型。`pickBehaviorSubject`用来读取数据模型model的最新状态值。

> `pickBehaviorSubject`是`restore`的反函数。

```js
test('array happy', done => {
    let source = [new BehaviorSubject(0), new BehaviorSubject(1)]
    let y = pickBehaviorSubject(source)
    expect(y).toEqual([0, 1])
    done()
})

test('object happy', done => {
    let source = { a: new BehaviorSubject(0), b: new BehaviorSubject(1) }
    let y = pickBehaviorSubject(source)
    expect(y).toEqual({ a: 0, b: 1 })
    done()
})
```

1. 支持数据模型嵌套递归。
2. 空对象，空数组整个忽略。
3. 对象属性如果不是`BehaviorSubject`，忽略这个属性。
4. 数组如果所有元素必须都是`BehaviorSubject`，部分元素是`BehaviorSubject`抛出错误。全部元素都是其他类型，整个数组忽略。
5. `pickBehaviorSubject`读取的数据模型，里面允许`ObservableArray`，它是数组的一个派生类型。其读取元素的规则同普通数组。
6. 如果模型对象具有`pickeys`，它是一个函数，接受空参数表，返回字符数组，表示需要读取的属性名。

```js
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
```



## restore

签名

```js
import { restore } from 'deep-rxjs'
let void = restore(model, src)
```

restore用于设置model中的`BehaviorSubject`类型的属性，使该属性的当前值对应为src同样路径的值。

> `restore`是`pickBehaviorSubject`的反函数。

```js
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
```

补充说明：

对象的属性，取model和src的共有部分，且model非`BehaviorSubject`属性被忽略。

数组的元素，取最前面的对应设置值。

restrore可以修改`ObservableArray`，截长补短。补短时需要`ObservableArray`对象提供补短`appendChild`成员方法。

```js
import { ObservableArray } from 'structural-comparison'

test('observable array complement', done => {
    let model = new ObservableArray()
    model.appendChild = (i) => model.insert(new BehaviorSubject(0), i)

    model.insert(new BehaviorSubject(0))

    let src = [1, 2, 3]
    restore(model, src)

    expect(model[0].value).toEqual(src[0])
    expect(model[1].value).toEqual(src[1])
    expect(model[2].value).toEqual(src[2])
    done()
})
```

以下函数需要`structural-comparison`库`Deep`支持。

## observableDeep

```js
observableDeep(obj)
```

递归嵌套找出obj中所有类型为Observable的属性，并前置每个属性的路径，构成一个Deep。

```js
import { of } from 'rxjs'
import { extractProperty } from 'structural-comparison'
import { observableDeep } from 'deep-rxjs'

test('test observableDeep', () => {
    let obj = {
        a: of(0),
        b: 1,
        c: [of(1), of(2)],
        d: {},
    }

    let deep = observableDeep(obj)

    let keys = [
        ['a'],
        ['c', 0],
        ['c', 1],
    ]
    expect(deep.keys).toEqual(keys)

    let entries = keys.map(k => [k, extractProperty(obj, k)])
    expect(deep.entries).toEqual(entries)
})
```



## behaviorSubjectDeep

```js
behaviorSubjectDeep(obj)
```

递归嵌套找出obj中所有类型为BehaviorSubject的属性，并前置每个属性的路径，构成一个Deep。

```js
import { BehaviorSubject } from 'rxjs'
import { extractProperty } from 'structural-comparison'
import { behaviorSubjectDeep } from 'deep-rxjs'

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
```

## deepCombineLatest

```js
deepCombineLatest(deep)
```

同combineLatest操作符，不同於合并數組，本操作合并的為Deep對象。deep的每个值都是Observable，每当有Observable发射值，取deep每个值的最新值，保持deep的形状，创造新的Observable。

```js
import { BehaviorSubject } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { behaviorSubjectDeep } from 'deep-rxjs'
import { deepCombineLatest } from 'deep-rxjs'

test('test deepCombineLatest', done => {
    let observables = {
        a: new BehaviorSubject(0),
        b: new BehaviorSubject(0),
        c: [
            new BehaviorSubject(0),
            new BehaviorSubject(0),
            {
                e: new BehaviorSubject(0),
            },
        ],
    }
    let e = { a: 0, b: 0, c: [0, 0, { e: 0 }] }
    let deep = behaviorSubjectDeep(observables)
    deepCombineLatest(deep)
        |> take(1)
        |> map(deep => deep.toObject())
        |> (obs =>
            obs.subscribe({
                next: data => {
                    expect(data).toEqual(e)
                },
                complete: done
            }))
})
```

## deepMerge

```js
deepMerge(model)
```

model是包含observable属性的容器对象。每当model中的observable发射值时，订阅者会知道发射属性的路径，并发射值。

```js
import { BehaviorSubject } from 'rxjs'
import { deepMerge } from 'deep-rxjs'

test('test deepMerge', done => {
    const source = {
        a: new BehaviorSubject(true),
        b: new BehaviorSubject(true),
        x: { c: [new BehaviorSubject(true)] },
    }
    let states = []
    deepMerge(source)
        |> (obs => obs.subscribe(data => { states.push(data) }))
    source.a.next(false)
    source.b.next(false)
    source.x.c[0].next(false)
    expect(states).toEqual([
        [['a'], true],
        [['b'], true],
        [['x', 'c', 0], true],
        [['a'], false],
        [['b'], false],
        [['x', 'c', 0], false],
    ])
    done()
})
```

状态数组中，前三项为真，是初始化时发射的值，后三项是next改变的值。
