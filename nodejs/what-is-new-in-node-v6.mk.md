[What's new in Node v6?](https://blog.risingstack.com/whats-new-in-node-v6/?utm_source=javascriptweekly&utm_medium=email)
  
tag: Node.js · nodejs · node.js v6 · node v6 · node foundation · 
 
> New “Current” version line focuses on performance improvements, increased reliability and better security for its 3.5 million users - https://nodejs.org/en/blog/announcements/v6-release/

Node.js v6 just got released - let's take a look at the improvements and new features landed in this release.

![Node v6 just got released - find out what's new in it](https://risingstack-blog.s3.amazonaws.com/2016/Apr/Node_v6_just_got_released_find_out_whats_new_in_it-1461740940057.png)

### Performance Improvements

- **Module loading got 4-times faster **compared to the current LTS version (Node.js v4). This helps developers to shorten the bootstrap phase of the applications.
Related PRs:
		- https://github.com/nodejs/node/pull/5689
		- https://github.com/nodejs/node/pull/5950


- Updated V8 engine

### Security Improvements

- `Math.random` - improved security, but note, that it is still not cryptographically secure
		
		For more information, check: http://v8project.blogspot.hu/2015/12/theres-mathrandom-and-then-theres.html
		
- New Buffer API to reduce the risk of bugs and vulnerabilities leaking into applications
Related PRs:

- https://github.com/nodejs/node/pull/4682
- https://github.com/nodejs/node/pull/5048
- https://github.com/nodejs/node/pull/4594
- https://github.com/nodejs/node/pull/4514

### New ES6 Features

#### Default function parameters

```
function multiply(a, b = 1) {  
  return a * b
}

multiply(5) // 5  
```
Learn more on the [default function parameters](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/default_parameters).

#### Rest parameters

```
function fun1(...theArgs) {  
  console.log(theArgs.length)
}

fun1()  // 0  
fun1(5) // 1  
fun1(5, 6, 7) // 3  
```
Learn more on the [rest parameters](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/rest_parameters).

#### Spread operator

```
// before the spread operator
function myFunction(x, y, z) { }  
var args = [0, 1, 2]  
myFunction.apply(null, args)

// with the spread operator
function myFunction(x, y, z) { }  
var args = [0, 1, 2]  
myFunction(...args)  
```
Learn more on the [spread operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator).

#### Destructuring

```
var x = [1, 2, 3, 4, 5]  
var [y, z] = x  
console.log(y) // 1  
console.log(z) // 2  
```
Learn more on [destructuring](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

#### new.target

```
function Foo() {  
  if (!new.target) throw new Error('Foo() must be called with new')
  console.log('Foo instantiated with new')
}

Foo() // throws "Foo() must be called with new"  
new Foo() // logs "Foo instantiated with new" 
``` 
Learn more on the [new.target](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).

#### Proxy

The Proxy object is used to define custom behavior for fundamental operations.

```
var handler = {  
    get: function(target, name){
        return name in target ? target[name] : 37
    }
};

var p = new Proxy({}, handler)  
p.a = 1  
p.b = undefined

console.log(p.a, p.b) // 1, undefined  
console.log('c' in p, p.c) // false, 37  
```
Learn more on [proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

#### Reflect

Reflect is a built-in object that provides methods for interceptable JavaScript operations.

Learn more on [reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect).

#### Symbols

A symbol is a unique and immutable data type and may be used as an identifier for object properties.

```
Symbol("foo") === Symbol("foo"); // false 
``` 
Learn more on [symbols](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol).

### Trying Node.js v6

If you are using nvm, you only have to:

```
nvm install 6  
```
If you for some reason cannot use nvm, you can download the binary from the official Node.js website.

#### When should I migrate to Node 6?

In October Node.js v6 will become the LTS version - after that, you should make the change.

