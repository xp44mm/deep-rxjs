# deep-rxjs之nestedMerge与nestedCombineLatest

假设我们有一个需求，我们有不同种类的商品，他们有不同的价格，当某种商品变化时通知用户。或者用户需要实时知道全部商品的最新报价，以计算总价。像叶子处于一个树上一样，商品是模型对象，亦包括数组，的任意层次的属性。我们引入rxjs的扩展管道操作函数`nestedMerge`与`nestedCombineLatest`

为了演示，我们假设一个数据模型，这个数据模型为：

```js
    const model = {
        a: {
            b: new BehaviorSubject(0),
            c: new BehaviorSubject(1),        },
        x: [
            new BehaviorSubject(2), 
            new BehaviorSubject(3)]
    }
```

我们提供的模型包含有对象和数组，在表示路径的键数组中，对象的属性键为字符串，数组的属性键为整数。



## nestedMerge

`nestedMerge`语法为

```js
nestedMerge(source)
```

`source`是一个直接或间接含有`Observable`属性的嵌套对象或数组。`nestedMerge`合并`source`中的所有`Observable`属性为一个`Observable`。源中任何一个`Observable`属性发射，输出`Observable`将发射一个元组，第一个分量是属性在源中的路径，第二个分量是属性值。元组在JavaScript中用数组表示。

对于本章的前面提供的模型，我们订阅它的`nestedMerge`输出，打印到控制台。

```js
nestedMerge(model).subscribe(x => { console.log(x) })
```

操作模型的属性。

```js
source.a.b.next(10)
source.a.c.next(11)
```

看看控制台输出什么：

```js
[['a', 'b'], 10]
[['x', 1], 13]
```

请对比操作模型代码和输出的的数据，输出元组的第一个分量是属性在源中的路径，第二个分量是属性值。

## nestedCombineLatest

语法为

```js
nestedCombineLatest(source)
```

`source`是一个直接或间接含有`Observable`属性的嵌套对象或数组。`nestedCombineLatest`组合`source`中的所有`Observable`属性为一个`Observable`。源中任何一个`Observable`属性发射，输出`Observable`将发射和源同样形状的对象，输出对象的对应属性为源`Observable`的最新值。

对于本章的前面提供的模型，我们订阅它的`nestedCombineLatest`输出，打印到控制台。

```js
nestedMerge(model).subscribe(x => { console.log(x) })
```

操作模型的属性。

```js
source.a.b.next(10)
source.a.c.next(11)
```

看看控制台输出什么：

```js
{ "a": { "b": 10, "c": 1 }, "x": [ 2, 3 ] }
{ "a": { "b": 10, "c": 11 }, "x": [ 2, 3 ] }
```

请对比模型代码和输出的的数据，每次输出模型的最新状态。

## 参考

`deep-rxjs`函数库扩展rxjs库的功能，开源于GitHub，见xp44mm/deep-rxjs仓库。

