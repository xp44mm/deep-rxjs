# deep-rxjs之ObservableArray

可观察数组继承自普通数组。javascript语言特性，Array的任何方法都可以通过派生类ObservableArray访问。其中的读取方法，比如`arr.length`，可以随意使用。初学者不要使用Array自带的修改方法，比如`push`，`pop`。而要使用`ObservableArray`包装的可发射通知的三个方法。

> observable array名称来自knockout中。

> Observable Array位于`deep-rxjs`库中。请用npm安装。

> `deep-rxjs`是开源的前端库。位于github上，见xp44mm/deep-rxjs仓库。

## 构造器

```js
import { ObservableArray } from './ObservableArray'
let arr = new ObservableArray()
```

可观察数组初始化，不能有参数，此时是空数组。这是因为为数组添加元素将会有其他关联的数据随之变化。这个关联需要在添加元素之前进行配置。请继续阅读。

## insertBefore与insertBefore$

`insertBefore`插入新元素到数组指定索引位置。后面的元素依次向后移动一个索引。其语法

```js
array.insertBefore(e, i=this.length)
```

`e`是被插入的新元素，`i`是插入的位置，缺省是数组末尾。每次执行`insertBefore`时，会通过`insertBefore$`发射Observable通知。通知的数据即是`insertBefore`的输入参数数组。

```js
test('test insertBefore', done => {
    let states = []
    let arr = new ObservableArray()

    arr.insertBefore$.subscribe(([item, index]) => { 
        states.push(['insertBefore', item, index]) 
    })
    
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

我们在订阅中执行向外部数组`states`附加记录。我们检测所作的副作用，并且可观察数组的当前状态。

## removeChild与removeChild$

`removeChild`删除数组中指定索引位置的元素，后面的元素依次向前补位。其语法

```js
removeChild(index = this.length - 1)
```

索引是其唯一输入参数。其可以省略，默认是数组的最后的索引。每次执行`removeChild`时，会通过`removeChild$`发射observable通知。通知的数据即是`removeChild`的输入参数。

```js
test('test removeChild', done => {
    let states = []
    let arr = new ObservableArray()
    arr.removeChild$.subscribe(index => { 
        states.push(['removeChild', index]) 
    })

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

e是用户提供的新元素，i是旧元素的索引位置。用新元素e，替换数组i位置的现有元素。并没有其他变化。每次执行`replaceChild`时，会通过`replaceChild$`发射observable通知。通知的数据即是`replaceChild`的输入参数数组。

```js
test('test replaceChild', done => {
    let states = []
    let arr = new ObservableArray()

    arr.replaceChild$.subscribe(([item, index]) => { 
        states.push(['replaceChild', item, index]) 
    })

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

以上三个方法的通知，`insertBefore$`，`removeChild$`，`replaceChild`三个`Observable`可观察数组成员。实际上是action发射的，其类型为`Subject`。发射通知数据是一个数组，元素依次为动作名称，动作参数。

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

## 已知问题

当使用许多从array继承来的方法时，这些方法会自动使用派生类的构造函数，有时可能会引发错误，解决方案是克隆可观察数组为内建数组

```js
observableArray.map(x=>x)
```

`map`会在映射后调用ObservableArray构造函数构造一个ObservableArray，这违反ObservableArray构造函数参数表必须为空的限制条件。解决方案是读取元素，克隆到另一个数组：

```js
[...observableArray].map(x=>x)
```



