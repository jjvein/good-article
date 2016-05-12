## [JavaScript’s Strict Mode and Why You Should Use It](http://cjihrig.com/blog/javascripts-strict-mode-and-why-you-should-use-it/)

Posted on December 23, 2011

Starting with ECMAScript 5, developers are able to place their code into a more constrained form of execution known as strict mode.  Strict mode improves JavaScript code by enforcing better programming practices and eliminating some of the language’s insecure and ill-advised features.  Strict mode is enabled by adding the following directive to your code:

```
"use strict";
```
The “use strict”; directive can be used in two ways.  The first method of invoking strict mode is at the file level.  By adding the directive at the beginning of a file (the directive may only be preceded by comments and whitespace), strict mode is enabled in a global context.  This means that all of your code will be evaluated in strict mode.  Caution must be taken when concatenating strict and non-strict scripts together.  Placing a strict script first will force the non-strict script to be evaluated in strict mode.  Placing a non-strict script first will cause the opposite behavior.  This caused some problems for Amazon.

从ECMAScript5开始，我们就可以在程序开发中使用一个更加受限制的解析模式： 严格模式。严格模式通过强制要求更好的编程习惯并排除一些不安全以及不推荐的语言特性。使用严格模式必须在代码中使用下面的指令： 

```
"use strict";
```
"use strict"；可以有两种使用方法。第一种是文件层面的引用严格模式。通过在文件的开始引入该指令（该指令前面只能是空格或者注释），该模式在全局上下文都有用。这意味着你所有的代码都必须是在严格模式下被检查。但是要注意的是对严格模式的文件和非严格模式的文件的合并操作。如果将严格模式的文件放到前面，非严格模式的文件也将使用严格模式进行检查。将非严格模式的文件放到前面将会导致相反的结果，因为上面提到的该指令必须放在文件的开始，所以这就意味着该指令在合并之后的文件中不生效。

The second way to enable strict mode is at the function level.  To enable this level of strict mode, place the “use strict”; directive at the beginning of the function body.  As with global strict mode, the directive may only be preceded by whitespace and comments.  Using strict mode at the function level allows a programmer to mix and match strict and non-strict functions in the same file.  This is useful when some legacy code relies on features that have been deprecated in strict mode.  The following example shows how strict and non-strict functions can coexist in a single file.

```
function foo() {
  "use strict";
  // this function is executed in strict mode
}

function bar() {
  // this function is executed in non-strict mode
}
```
One of the nice things about strict mode is its backward compatibility.  Older versions of JavaScript will treat the “use strict”; directive as a meaningless string literal and ignore it.  However, newer versions of JavaScript will give the statement special treatment and switch to strict mode.  For browsers that support strict mode, the following restrictions apply.

第二种启用严格模式的方法是在函数层面。需要将"use strict";指令放在函数体的开始。和全局模式一样，该指令前面也只允许出现空格和注释。使用函数层面的严格模式允许在一个程序中混合使用严格模式和非严格模式。这对于一些依赖特性的遗留代码，但是这些特性又不被严格模式支持时很有用。下面的代码显示如何在一个文件中使用这两种特性。
```
function foo() {
  "use strict";
  // this function is executed in strict mode
}

function bar() {
  // this function is executed in non-strict mode
}
```
严格模式有一个非常好的特点就是它的兼容性。老版本的JavaScript会认为"use strict";指令是一个没有任何意义的字符串字面量并且会忽略它。然而，新版本会对这个指令进行特殊处理并切换到严格模式。浏览器在严格模式下应用以下限制。


### Implicit Global Variable Declaration

JavaScript has an interesting way of handling variable declarations.  Variables that are not declared using the var keyword are implied to be global variables.  The following piece of code uses three variables – ‘x’, ‘y’, and ‘z’.

```
function foo() {
  var x;
  var z;

  x = 1;
  y = 2;
  z = x + y;
}
```
Notice that only the variables ‘x’ and ‘z’ are declared using the var keyword.  There is a good chance that the programmer also meant to declare ‘y’, but mistakenly did not.  The code will execute properly, but with the side effect of creating a global variable named ‘y’ with the value 2.  Since window is the global object, this is equivalent to writing:

```
window.y = 2;
```
This behavior can be problematic if ‘y’ is already defined elsewhere and is expected to have a different value.  This leads to code that doesn’t scale well and is difficult to debug.  Enabling strict mode will catch this problem.  Instead of making ‘y’ a global variable, an exception will occur.  The exception shown in Chrome looks like this:

```
ReferenceError: y is not defined
```

JavaScript在处理变量定义上非常有意思。没有使用`var`关键字定义变量将会被作为全局变量。下面的代码中定义了三个变量'x', 'y', 'z'。

```
function foo() {
  var x;
  var z;

  x = 1;
  y = 2;
  z = x + y;
}
```
这里只用'x'和'z'使用了```var```关键字。本来程序也想想定义'y', 但是可能忘记了。代码能够正常的执行，但是同时在全局作用域创建了一个变量'y',并赋值2.因为这里*window*是全局作用域，所以代码等同于： 

```
window.y = 2;
```
如果在别的地方已经定义了'y'这个变量，且赋给不同的值时，这就会出现问题。这个行为会导致代码的拓展性非常差并且很难找到bug。启用严格模式就能够发现这个错误。该模式不会创建全局变量，而是会抛出一个异常。在Chrome下的异常如下： 
```
ReferenceError: y is not defined
```


### The with Statement

The with statement provides a shorthand notation for working with an object’s properties.  Inside a with statement, it can be difficult to tell if a variable belongs to the object in question or some other scope.  The following code uses a with statement to output the document’s title.  There is also a local variable named ‘title’, which is ignored inside the with statement.  In a more complex piece of code, a programmer could easily introduce bugs related to variable scoping when using with statements.

```
function foo() {
  var title = "Not the page title";
  with (document) {
    write(title + "<br />");
    write("contains a with statement");
  }
}
```
In strict mode, the with statement has been completely disabled.  Any attempt to use the with statement will result in the following syntax error.  Note:  A much better idea is to assign the object to a variable and access it’s properties via the variable.

```
SyntaxError: Strict mode code may not include a with statement
```

`with`语句提供一种访问变量属性的简便方法。在`with`声明中，我们很难确定一个变量是否属于该对象还是其他作用域。下面的代码使用`with`申明来输出文档的title。但是同时也申明了一个'title'的变量，但是在`with`声明中是不可见的。

```
function foo() {
  var title = "Not the page title";
  with (document) {
    write(title + "<br />");
    write("contains a with statement");
  }
}
```
在严格模式下，`with`申明完全不被允许。如果使用该申明会导致以下错误。
```
SyntaxError: Strict mode code may not include a with statement
```


### Identifier Naming

Strict mode places several naming restrictions on variables, functions, and parameters.  The strings ‘eval’ and ‘arguments’ cannot be used as identifiers, nor can they have values assigned to them.  Because JavaScript has a built-in ‘eval’ function and ‘arguments’ object, this eliminates possible confusion.  Attempting to use ‘eval’ or ‘arguments’ as a name results in the following exception:

```
SyntaxError: Variable name may not be eval or arguments in strict mode
```
Additionally, identifiers can no longer use any of the following future reserved keywords:

* implements
* interface
* let
* package
* private
* protected
* public
* static
* yield

严格模式列出了一些对于变量，函数和参数的限制。'eval','arguments'不能被被作为标识符来使用，且不能给它们指定值。因为JavaScript有内置的'eval'函数和'arguments'对象，这杜绝了可能存在的误解。尝试使用'eval', 'arguments'进行命名会产生以下异常： 

```
SyntaxError: Variable name may not be eval or arguments in strict mode
```
另外，下面的保留关键字也不允许作为标识符来使用。 

* implements
* interface
* let
* package
* private
* protected
* public
* static
* yield

### this Usage

Use of a ‘this’ variable is common in object-oriented programming.  Inside a function, the ‘this’ variable points to the object that owns the function.  However, when a function does not belong to any specific object, the ‘this’ variable points to the global object (window).  Strict mode removes accidental or malicious access of the global object by assigning ‘this’ a value of undefined.  If a function is owned by an object, then ‘this’ still points to that object as expected.  In the following example, the function ‘foo’ returns undefined.

```
function foo() {
  "use strict";
  return this;
}
```

'this'变量和面向对象的编程一样。在函数内部，'this'变量指向了拥有该函数的对象。然而，如果该函数不属于任何对象时，'this'变量就指向了全局的window对象。严格模式杜绝任何偶然或者恶意的使用'this'访问全局对象，并会被其赋值'undefined'。如果函数属于某个对象， 'this'依旧指向该变量，下面的例子中，'foo'函数返回值为'undefined'。

```
function foo() {
  "use strict";
  return this;
}
```
### Read-only Properties

JavaScript allows developers to create read-only properties on objects.  Attempts to write a new value to a read-only property fail silently in non-strict code.  In other words, the property’s value remains unchanged, but the program does not provide any warning/error.  In strict mode, such behavior will cause the script to throw an exception.  The following example creates a read-only property named ‘prop1′.  In strict mode, the subsequent assignment of ‘prop1′ causes a TypeError exception.

```
function foo() {
  "use strict";
  var obj = Object.defineProperties({}, {
              prop1 : {
                value : 1,
                writable : false
              }
            });

  obj.prop1 = 2;
}
```
JavaScript允许开发者给对象指定只读属性。在非严格模式下，给一个只读属性赋值不成功也不返回错误。也就是说，属性值保持不变，但是程序并不会提示警告或者错误输出。在严格模式下，这个行为将会抛出异常。下面的例子创建了一个只读属性'prop1'。在严格模式下，后面的赋值语句将会报错。 
```
function foo() {
  "use strict";
  var obj = Object.defineProperties({}, {
              prop1 : {
                value : 1,
                writable : false
              }
            });

  obj.prop1 = 2;
}
```

### Non-extensible Objects and Variables

In JavaScript, adding new properties to an object is trivial – just assign a value to it.  JavaScript also provides a mechanism for preventing the addition of new properties.  By setting an object’s internal ‘extensible’ attribute to false, the addition of new properties to an object will fail silently.  Once again, strict mode changes silent failure to a TypeError exception.  The following code attempts to add a new property to a non-extensible object.

```
function foo() {
  "use strict";
  var obj = {prop1 : 1};

  Object.preventExtensions(obj);
  obj.prop2 = 2;
}
```
The object ‘obj’ is constructed with a single property, ‘prop1.’  When ‘Object.preventExtensions’ is called, ‘obj’ becomes non-extensible.  The attempt to add ‘prop2′ to the object results in the following exception:

```
TypeError: Can't add property prop2, object is not extensible
```

在JavaScript中，给对象添加一个新的属性是非常简单的-只需要给它指定值即可。JavaScript同时也提供了一种阻止添加新属性的机制。通过设置对象的内部属性'extensible'为false，给对象添加新属性操作将会失败但不会报错。同样的，严格模式将抛出一个TypeError异常。下面的代码尝试在一个不可拓展的对象上添加新属性。

```
function foo() {
  "use strict";
  var obj = {prop1 : 1};

  Object.preventExtensions(obj);
  obj.prop2 = 2;
}
```

'obj'对象有一个单独的属性'prop1'。当调用`Object.preventExtensions`被调用时，'obj'对象就不再可拓展。尝试给对象添加'prop2'将会导致以下异常:

```
TypeError: Can't add property prop2, object is not extensible
```


### Duplicate Parameters and Properties

Non-strict JavaScript allows objects to contain multiple properties with the same name.  When the same name is used multiple times, only the last declaration is used.  Strict mode requires that all property names are unique.  In the following example, the object ‘obj’ contains two properties named ‘prop1′.  In non-strict mode, the value of ‘prop1′ would be 3.  However, when strict mode is enabled a syntax error occurs.

```
// while in strict mode
obj = {
  prop1 : 1,
  prop2 : 2,
  prop1 : 3
};
```
Similarly, non-strict functions may have multiple parameters with the same name.  In strict mode, this is not allowed.  In the following example, duplicating ‘param1′ causes a syntax error.

```
function foo(param1, param1) {
  "use strict";
  alert(param1);
}
```

非严格模式的JavaScript允许对象包含重复名称的属性。当重复使用相同的名字时，只有最后一个申明会被使用。严格模式要求所有的属性的唯一性。在下面的例子中，对象'obj'包含了两个'prop1'的实行。在非严格模式下，'prop1'的结果是3。但是如果在严格模式下就会产生语法报错。

```
// while in strict mode
obj = {
  prop1 : 1,
  prop2 : 2,
  prop1 : 3
};
```
同样的，非严格模式的函数允许有多个同名的参数。严格模式下也是不被允许的。下面的例子中，重复的'param1'会产生语法报错。

the following example, duplicating ‘param1′ causes a syntax error.

```
function foo(param1, param1) {
  "use strict";
  alert(param1);
}
```


###  eval Variables

Non-strict code can use the ‘eval’ function to add new variables to the surrounding scope.  Prior to native JSON support in browsers, ‘eval’ was commonly (and unsafely) used to construct objects from strings.  The constructed objects then became a part of the surrounding scope.  In strict mode, ‘eval’ cannot introduce new variables.  When executed in strict mode, the following piece of code will not introduce the ‘bar’ variable into the surrounding scope.  Note:  if a function containing ‘eval’ is executed in strict mode, then the code inside the ‘eval’ function is also executed in strict mode.

```
// while in strict mode
eval("var bar = 10;");
```
在非严格模式下可以使用'eval'函数给所在作用域添加新变量。在浏览器支持Native JSON以前，'eval'经常被用来将string转换为对象。被创建的对象则成为其所在作用域的一部分。在严格模式下，'eval'不在允许创建新的变量。下面的代码片段不会产生新的变量'bar'。注意： 如果在严格模式下一个函数内部包含了'eval'，其代码也将会被按照严格模式来执行。

```
// while in strict mode
eval("var bar = 10;");
```
### The delete Operator

The delete operator is used to remove properties from objects.  However, some properties cannot be deleted.  Non-configurable properties are of the variety that cannot be deleted.  Non-strict code will fail silently when an attempt is made to delete a non-configurable property.  Such an attempt throws a TypeError exception when executing in strict mode.  In the following example, the object ‘obj’ has a non-configurable property named ‘prop1′ and a configurable property named ‘prop2′.  Since ‘prop2′ is configurable, it is perfectly acceptable to delete it.  An exception is not thrown until the attempt to delete ‘prop1′ is made.

```
function foo() {
  "use strict";
  var obj = Object.defineProperties({}, {
              prop1 : {
                value : 1,
                configurable : false
              },
              prop2 : {
                value : 2,
                configurable : true
              }
            });

  delete obj.prop2;
  delete obj.prop1;
}
```
The delete operator is intended to work on object properties.  Attempting to delete normal variables and functions will result in a syntax error.  All of the delete operations in the following example will fail.

```
function foo(param1) {
  "use strict";
  var bar = 1;
  function baz() {};

  delete param1;
  delete bar;
  delete baz;
}
```

'delete'操作符被用来移除对象的属性。然而，一些属性是不允许被删除的。带有non-configurable属性是不允许被删除的。非严格模式下，删除操作会失败，并且不会报错。但是在严格模式下该操作就会产生一个TypeError异常。下面的例子中，'obj'对象有一个non-configuable 属性'pro1'和一个可配置属性'prop2'。因为'prop2'是可配置的，所以不会产生报错，但是在删除'prop1'时会产生异常。

```
function foo() {
  "use strict";
  var obj = Object.defineProperties({}, {
              prop1 : {
                value : 1,
                configurable : false
              },
              prop2 : {
                value : 2,
                configurable : true
              }
            });

  delete obj.prop2;
  delete obj.prop1;
}
```

'delete'操作符只在对象上有效。删除正常的变量和函数会报语法错误。下面使用delete的操作都会失败。

```
function foo(param1) {
  "use strict";
  var bar = 1;
  function baz() {};

  delete param1;
  delete bar;
  delete baz;
}
```

### Using arguments, caller, and callee

When a function is called, a special object named ‘arguments’ is created in the function’s scope.  ’arguments’ is an array-like object that contains the arguments passed to the function.  In the following example ‘arguments[0]‘ and ‘arg1′ hold the same value, as do ‘arguments[1]‘ and ‘arg2′.  In non-strict mode, updating one value automatically updates the value it maps to.  At the end of ‘bar’, the values of ‘arg1′ and ‘arg2′ have been swapped even though values were only assigned to the ‘arguments’ array.  In strict mode, the aliased values are not automatically updated.  Therefore, when run in strict mode, the values of ‘arg1′ and ‘arg2′ are unchanged at the end of ‘bar’.

```
function foo() {
  bar(1, 2);
}

function bar(arg1, arg2) {
  var temp = arguments[0];
  arguments[0] = arg2;
  arguments[1] = temp;
  alert(arg1 + " " + arg2);
}
```

The ‘arguments’ object also contains a pointer to the function that is currently executing.  The current function is referred to as the callee, and can be referenced using ‘arguments.callee’.  This syntax is only useful inside an anonymous function, because anonymous functions do not have names.  In any other case, it makes more sense to refer to the callee by name.  In strict mode, access to ‘arguments.callee’ is not allowed.

A similar method can be used to determine where a function call was made from.  An ‘arguments.caller’ object was available in older browsers, but has since been deprecated. However, the calling method can still be determined using ‘arguments.callee.caller’.  Strict mode also prohibits access to the caller.  In the following example, ‘bar’ is not in strict mode.  However, attempting to access ‘arguments.callee.caller’ will still fail because ‘foo’ is a strict mode function.

```
function foo() {
  "use strict";
  bar(1, 2);
}

function bar(arg1, arg2) {
  var caller = arguments.callee.caller
}
```

当调用函数时，一个特殊的对象'arguments'在函数作用域被创建。'arguments'是一个类似于数组的对象，包含了所有传入函数的参数。下面的例子中，'arguments[0]'和'arg1'，'arguments[1]'和'arg2'有相同的值。在非严格模式下，更新其中的一个值会自动更行另外一个对应的值。在'bar'的最后， 虽然只是对'arguments'做了操作，'arg1'和'arg2'的值已经做了交换。但是在严格模式下，对应的值并不会被更新，所以最后'arg1'和'arg2'的值保持不变。

```
function foo() {
  bar(1, 2);
}

function bar(arg1, arg2) {
  var temp = arguments[0];
  arguments[0] = arg2;
  arguments[1] = temp;
  alert(arg1 + " " + arg2);
}
```

'arguments'对象同时也包含了一个指向当前执行函数的指针。当前的函数被称作'callee',并且可以通过使用`arguments.callee`来引用。这种语法只在匿名函数中有用，因为匿名函数没有名称。在其他的任何情况下，使用函数名比使用'callee'更加实用。在严格模式下，`arguments.callee`不被允许使用的。

还有一个判断函数在何处被动调用的类似方法。'arguments.caller'对象在老版本浏览器中存在，新版本已经被弃用了。严格模式下禁止访问'caller'。这里，访问`arguments.callee.caller`依然会失败，因为'foo'是一个严格模式下的函数。

```
function foo() {
  "use strict";
  bar(1, 2);
}

function bar(arg1, arg2) {
  var caller = arguments.callee.caller
}
```

UPDATE (11/21/14)
Enabling strict mode allows some JavaScript engines, such as v8, to optimize code that it otherwise would not. In non-strict mode, referencing ‘arguments’ and a named argument in the same function will cause v8 to not optimize the function. For a slightly more detailed read, see this issue and my personal will-it-optimize project.

开启严格模式有利于JavaScript引擎如V8对代码进行优化。在非严格模式下，在同一个函数中引用'arguments'和命名的参数会导致V8引擎不对代码进行优化。详细的阅读请参考:[【the issue】](https://github.com/joyent/node/pull/8302#issuecomment-54331801)。

UPDATE (11/21/14)
I’d also like to thank Chris Dickinson for providing an excellent example of (what I feel are) bad coding practices that strict mode prevents. The following example returns 102 in non-strict mode, but throws an error in strict mode as one function tries to overwrite the arguments of another function.

```
// "use strict"; // uncomment this line to see an error thrown
 
function modify() {
  poison.arguments[0] = 100;
}
 
function poison(a, b) {
  modify();
  return a + b;
}

console.log(poison(1, 2));
```

下面的代码例子是在严格模式下禁止的非常不好的编程体验。在非严格模式下，下面的代码返回102, 但是在严格模式下将会抛出错误，因为一个函数在尝试修改另一个函数的参数。

```
// "use strict"; // uncomment this line to see an error thrown
 
function modify() {
  poison.arguments[0] = 100;
}
 
function poison(a, b) {
  modify();
  return a + b;
}

console.log(poison(1, 2));
```

### Octals

Octal variables represent numbers in the base-8 number system.  They are rarely used and have a very confusing syntax.  Positive octal numbers are prefixed with a ’0′ while negative octals begin with ‘-0′.  For example, declaring the octal number 100 looks like this:

```
var foo = 0100;
```
Since people tend to ignore leading zeros, this can easily be confused with the decimal value 100.  However, a quick call to ‘parseInt()’ shows that the octal value is actually equal to 64 when converted to decimal.  To resolve this problem, strict mode disallows the use of octals.  Octal variables and octal escape sequences are both treated as syntax errors in strict mode.

Octal 代表了八进制数字系统。它们很不好用并且有混淆的语法。正的八进制数带有'0'前缀，而负的八进制数带有'-0'前缀。例如申明一个八进制的100则像下面:
```
var foo = 0100;
```
因为人们通常都会忽略开始的0，所以会被错误的认为是十进制的100。然而，通过调用`parseInt()`就能够立刻知道该数字代表十进制的64.为了解决这个问题，严格模式不允许使用八进制。八进制变量还有转义的八进制序列都不被会被认为是是语法错误。 