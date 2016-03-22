### [How to Create and Manipulate Arrays in Javascript](http://www.sitepoint.com/quick-tip-create-manipulate-arrays-in-javascript/)

This article was peer reviewed by Chris Perry and Marcello La Rocca. Thanks to all of SitePoint’s peer reviewers for making SitePoint content the best it can be!

The length property of Array objects is one that many who are relatively new to JavaScript do not understand. Many mistakenly believe that the length tells you exactly how many entries there are in an array whereas this is only true of some arrays. Some beginners do not even realize that length is a writable property of arrays. To clarify just exactly how the length property works, let’s take a look at what happens when we either change its value ourselves or run something that updates the array that also results in the length changing.

Array对象的length属性是让很多新人不理解的。很多人错误的认为length属性能够准确的说明数组有多少条目，然而这只是在某些数组中才正确。很多初学者甚至不知道length是一个可写的属性。为了说明length属性是如何工作的，我们来改变length的值，或者做一些操作能够使length属性改变。

Let’s start at the beginning. A JavaScript array has a property called length and optionally has numbered properties with names between 0 and 4294967294 inclusive. It also has a number of methods for manipulating the properties some of which we will look at as a part of our examination of how the length property works. Note that JavaScript does not support associative arrays and so while you can add named properties to an array, they do not form a part of the array and will be ignored by all the array methods. They also will not affect the length.

To make it easier to show exactly what happens to the array properties as we process various statements, we will run the following function after each piece of code. This will log the length of the array and all of the numbered properties to the browser’s console.

现在我们从最基本的开始,JavaScript数组有一个叫做```length```的属性，可选的有从0-4294967294（包括）编号的数字属性名。同时它也有一系列方法来管理操作属性，我们在下面的测试中也能够看到一部分使用方法。记住Javascript数组不支持关联数组，所以如果你给数组添加带有名字的属性时，它们不会再数组中，并且会被数组的所有方法忽略，同时它们也不会影响数组的```length```属性。

为了能够更好的说明在我们做一些操作时数组到底发生了什么，我们会在每次执行操作之后运行下面的函数。这个函数能够打印数组的长度，以及它所包含的各个属性内容。

```
var test = function(array) {
  console.log('length:'+ array.length);
  array.forEach(function(element, index, array) {
    console.log(index + ':' + element);
  });
};
```

### Creating an Array
We will begin by looking at different ways to create an array in JavaScript. The first two of these examples create arrays where only the length is set and there are no numbered entries at all. The second two create numbered entries from 0 to one less than the length.

An array where the length is greater than the amount of numbered properties is known as a sparse array while one with the length equal to the number of numbered properties is a dense array.

下面我们将通过不同的方式来创建JavaScript数组。前两个例子创建的数组只是设置了```length```属性，第二组创建了索引从0-(length-1)的条目。

```
//Creates an array with no numbered entries

var arr = new Array(5);
test(arr);
// length: 5

var arr = [];
arr.length = 5;
test(arr);
// length: 5
```

Note that the array literal notation (where you define a new array using just empty brackets) is preferred when creating new arrays.

注意： 推荐使用数组字面量来创建新数组。

```
var arr = ['a', 'b', 'c', 'd', 'e'];
test(arr);
// length:5, 0:a, 1:b, 2:c, 3:d, 4:e

var arr = [undefined, undefined, undefined, undefined, undefined];
test(arr);
// length:5, 0:undefined, 1:undefined, 2:undefined, 3:undefined, 4:undefined
```

The array methods that process the numbered properties (forEach in our case) will only process those that exist. If you instead process the array using a for or while loop then the loop will also attempt to process those properties that don’t exist and the array will identify those entries that don’t exist as being undefined. Your code would then be unable to distinguish between the last of the above examples and the first two. You should always use the array methods for processing an array where you are not certain that you are dealing with a dense array.

`foreach`数组方法只能循环的读出存在的数字属性。如果你使用`for`或者`while`循环来输出数组，那么它会尝试输出不存在数组中的元素，数组检测到这些条目并不存在时，就会赋上默认的undefined。这样你的后面的一组例子的结果就和第一组输出一致了。

你应该始终使用数组方法来处理数组，因为你不确定是否你在处理一个超出边界的数组。

### Changing the Length

The following examples look at what happens if we set a new length for the array that is less than the current length.

下面的例子中，我们对当前数组设置一个小于当前数组长度的`length`，看看会发生什么： 

````
var arr = ['a', 'b', 'c', 'd', 'e', 'f'];
test(arr);
// length:6, 0:a, 1:b, 2:c, 3:d, 4:e, 5:f

arr.length = 5;
test(arr);
// length:5, 0:a, 1:b, 2:c, 3:d, 4:e

var arr = ['a','b','c','d','e','f',,,];
test(arr);
// length:8, 0:a, 1:b, 2:c, 3:d, 4:e, 5:f

arr.length = 7;
test(arr);
// length:7, 0:a, 1:b, 2:c, 3:d, 4:e, 5:f
```
Note that when creating an array using [] notation each entry consists of a value followed by a comma. Where the value is omitted then no property is created for that position. The last comma may only be omitted if there is a value supplied for that property as otherwise the length will be reduced by one.

当我们使用[]这种方式创建一个数组，每个条目后面都跟一个逗号。如果最后一个逗号后面没有任何的内容时，我们忽略该位置，```length```的值减1.

### Removing Entries

JavaScript provides three methods pop, shift and splice that can remove entries from the array and which therefore reduce the length of the array. In each case the value (or values) removed are returned by the call.

JavaScript提供三个方法```pop```,```shifit```,```splice```，它们都可以从数组中移除条目，这会导致数组的长度减少。每次调用函数移除的值都会被返回。

```
// pop() removes the last element from an array
var arr = ['a','b','c','d','e','f'];
var el = arr.pop();
test(arr); // length:5, 0:a, 1:b, 2:c, 3:d, 4:e
console.log(el); // f

// shift() removes the first element from an array
var arr = ['a','b','c','d','e','f'];
var el = arr.shift();
test(arr); // length:5, 0:b, 1:c, 2:d, 3:e, 4:f
console.log(el); // a

// splice() can remove existing elements
var arr1 = ['a','b','c','d','e','f'];
var arr2 = arr1.splice(0,2); // remove 2 elements starting at index 0
test(arr1); // length:4, 0:c, 1:d, 2:e, 3:f
test(arr2); // length:2, 0:a, 1:b

var arr1 = ['a','b','c','d','e','f',,,'i'];
var arr2 = arr1.splice(6,2); // remove 2 elements starting at index 6
test(arr1); // length:7, 0:a, 1:b, 2:c, 3:d, 4:e, 5:f, 6:i
test(arr2); // length:2
````

### Adding Entries

We can add a new entry into an array simply by specifying a position in the array for which a numbered property does not yet exist. We can also use one of the three methods JavaScript provides (push, unshift and splice) for inserting new entries and, where necessary, moving the old ones.

我们可以简单的通过不存在的数字属性来完成数组新条目的添加。同样我们也可以使用JavaScript提供的方法```push```,```unshift```,`splice```来新添条目

```
var arr = ['a','b','c','d','e','f',,,'i'];
arr[11] = 'l';
test(arr);
// length:12, 0:a, 1:b, 2:c, 3:d, 5:f, 8:i, 11:l

// push() adds one or more elements to the end of an array
var arr = ['a','b','c','d','e','f',,,,];
arr.push('j');
test(arr);
// length:10, 0:a, 1:b, 2:c, 3:d, 5:f, 9:j

// unshift() adds one or more elements to the beginning of an array
var arr = ['a','b','c','d','e','f',,,,];
arr.unshift('x');
test(arr);
// length:10, 0:x, 1:a, 2:b, 3:c, 4:d, 5:e, 6:f

arr1 = ['a','b','c','d','e','f',,,'i'];
arr2 = arr1.splice(6,0,'g','h'); // removes 0 elements from index 6, and inserts 'g', 'h'
test(arr1); // length:11, 0:a, 1:b, 2:c, 3:d, 5:f, 6:g, 7:h, 10:i
test(arr2); // length:0
```

### Replacing Entries

Where we assign a new value to an entry that already exists, then that entry simply gets a new value and the rest of the array is unaffected. Also by combining the variants of the splice() method that we have already looked at we can replace existing entries or fill gaps in the array.

我们可以简单的通过在一个新的条目上指定一个新值，然后这个条目就获得了一个新的值，并且不会影响到数组中其他的条目。同时也可以使用```splice()```来完成替换。 

```
var arr1 = ['a','b','c','d','e','f',,,'i'];
var arr2 = arr1.splice(6,2,'g','h');
test(arr1); // length:9, 0:a, 1:b, 2:c, 3:d, 5:f, 6:g, 7:h, 8:i
test(arr2); // length:2
```

### Conclusion

The above examples should have given you a better idea of how the length property of an array works. This can be greater or equal to the number of entries in the array. Where it is equal we have a dense array and where it is greater we have a sparse array. Exactly what a particular array method does can depend on whether there is actually a property corresponding to a given position in a sparse array. If we change the length of an array it removes any numbered properties in the array that are in positions that are greater than the new length. If the length was equal to the amount of numbered properties and we increase the length then we convert a dense array to a sparse one. The array methods for deleting and adding properties in the array will move the existing entries around where necessary and will also retain and move any gaps between the properties.

