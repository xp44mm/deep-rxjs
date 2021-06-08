# deep-rxjs之deepMerge与deepCombineLatest

和对象的普通视图提供`nestedMerge`，`nestedCombineLatest`一样，`deep-rxjs`为Deep视图提供了两个函数`deepMerge`，`deepCombineLatest`，Deep是对象的扁平化视图的一个类。

先说对象的扁平化视图的概念，这个数据模型为：

```js
    const source = {
        a: {
            b: new BehaviorSubject(0),
            c: new BehaviorSubject(1),        
        },
        x: [
            new BehaviorSubject(2), 
            new BehaviorSubject(3),
        ]
    }
```

这个模型分解到`BehaviorSubject`节点：

```js
let entries = [
[['a', 'b'], source.a.b],
[['a', 'c'], source.a.c],
[['x', 0], source.x[0]],
[['x', 1], source.x[1]], 
]
```

这个词条数组就是对象的扁平化视图。用这个视图，读写比较都非常容易，扁平化视图的常用操作都包含在Deep中，我们将扁平化数据用`Deep`包装起来：

```js
let deep = new Deep(entries)
```

Deep视图的属性和操作，详见`structural-comparison`。

我们不必手写生成Deep视图

```js
let deep = observableDeep(source)
```

这得到的结果和上面一样。

## deepMerge(deep)

```js
deepMerge(deep)
```

返回一个`Observable`。每当输入deep中的`Observable`属性值发射值，`deepMerge`就发射一个数组，第一个元素是动作属性的路径，第二个元素是动作属性发射的值。

为了检测功能，我们订阅此操作函数

```js
deepMerge(deep).subscribe(console.log)
```

我们通过`BehaviorSubject`发射值：

```js
source.a.b.next(10)
```

我们得到`deepMerge`的通知：

```js
[['a', 'b'], 10],
```

再发射数组元素的值：

```js
source.x[1].next(13)
```

通知：

```js
[['x', 1], 13],
```



## deepCombineLatest(deep)

```js
deepCombineLatest(deep)
```

返回一个`Observable`。每当输入deep中的`Observable`属性值发射值，`deepCombineLatest`就发射一个和输入deep相同结构的Deep实例，deep结构的每个属性是输入`Observable`的最新值。

为了检测功能，我们订阅此操作函数

```js
    deepCombineLatest(deep)
        |> map(deep => deep.entries)
        |> (obs => obs.subscribe(console.log))
```

这里将输出的Deep类，转换成可打印的entries数组，判断deep类是否相同，就看它的entries属性。

我们通过`BehaviorSubject`发射值：

```js
source.a.b.next(10)
```

我们得到`deepCombineLatest`的通知：

```js
[
    [ [ "a", "b" ], 10 ],
    [ [ "a", "c" ], 1 ],
    [ [ "x", 0 ], 2 ],
    [ [ "x", 1 ], 3 ]
]
```

再发射数组元素的值：

```js
source.x[1].next(13)
```

通知：

```js
[
    [ [ "a", "b" ], 10 ],
    [ [ "a", "c" ], 1 ],
    [ [ "x", 0 ], 2 ],
    [ [ "x", 1 ], 13 ]
]
```

总结这个通知，`deepMerge`是模型最小的变化，仅发射变化的单条条目。`deepCombineLatest`则是获得模型当前整个状态的`Deep`通知。

## 参考

`Deep`类位于`structural-comparison`函数库，开源于GitHub，见xp44mm/structural-comparison仓库。

`deep-rxjs`函数库扩展rxjs库的功能，开源于GitHub，见xp44mm/deep-rxjs仓库。

