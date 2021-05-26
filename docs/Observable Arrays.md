# Observable Arrays

If you want to detect and respond to changes on one object, you’d use `Observable`s. If you want to detect and respond to changes of a *collection of things*, use an `ObservableArray`. This is useful in many scenarios where you’re displaying or editing multiple values and need repeated sections of UI to appear and disappear as items are added and removed.

可观察数组继承自普通数组。javascript语言特性，Array的任何方法都可以通过派生类ObservableArray访问。其中的读取方法，比如`arr.length`，可以随意使用。初学者不要使用Array自带的修改方法，比如`push`，`pop`。而要使用ObservableArray包装的可发射通知的三个方法。

## 构造器

```js
import { ObservableArray } from './ObservableArray'
let arr = new ObservableArray()
```

可观察数组初始化，不能有参数，此时是空数组。

## insertBefore与insertBefore$

insertBefore插入新元素到指定索引位置。其语法

```js
array.insertBefore(e, i=this.length)
```

e是被插入的新元素，i是插入的位置，缺省是数组末尾。每次执行insertBefore时，会通过insertBefore$发射observable通知。通知的数据即是insertBefore的输入参数数组。

```js
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
```

## removeChild与removeChild$

`removeChild`删除指定索引的元素，其语法

```js
removeChild(index = this.length - 1)
```

索引是其唯一输入参数。其可以省略，默认是数组的最后的索引。每次执行removeChild时，会通过removeChild$发射observable通知。通知的数据即是removeChild的输入参数。

```js
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
```

## replaceChild与replaceChild$

`replaceChild`替换指定索引的元素。其语法

```js
array.replaceChild(e,i)
```

e是被插入的新元素，i是旧元素的索引位置。每次执行replaceChild时，会通过replaceChild$发射observable通知。通知的数据即是replaceChild的输入参数数组。

```js
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
```

## action

以上方法的通知，实际上是action发射的，其类型为`Subject`。发射通知数据是一个数组，元素依次为动作名称，动作参数。

```js
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
```

## 问题

当使用许多从array继承来的方法时，这些方法会自动使用派生类的构造函数，有时可能会引发错误，解决方案是克隆可观察数组为内建数组

```js
observableArray.map(x=>x)
```

map会在映射后调用ObservableArray构造函数构造一个ObservableArray，这违反ObservableArray构造函数参数表必须为空的条件。解决方案是：

```js
[...observableArray].map(x=>x)
```



