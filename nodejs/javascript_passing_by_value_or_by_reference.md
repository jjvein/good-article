## [JavaScript: Passing by Value or by Reference](http://snook.ca/archives/javascript/javascript_pass)

In JavaScript, we have functions and we have arguments that we pass into those functions. But how JavaScript handles what you’re passing in is not always clear. When you start getting into object-oriented development, you may find yourself perplexed(困惑的) over why you have access to values sometimes but not other times.

When passing in a primitive type variable like a string or a number, the value is passed in by value. This means that any changes to that variable while in the function are completely separate from anything that happens outside the function. Let’s take a look at the following example:

```
function myfunction(x)
{
      // x is equal to 4
      x = 5;
      // x is now equal to 5
}

var x = 4;
alert(x); // x is equal to 4
myfunction(x); 
alert(x); // x is still equal to 4
```

Passing in an object, however, passes it in by reference. In this case, any property of that object is accessible within the function. Let’s take a look at another example:

```
function myobject()
{
	this.value = 5;
}
var o = new myobject();
alert(o.value); // o.value = 5
function objectchanger(fnc)
{
	fnc.value = 6;
}
objectchanger(o);
alert(o.value); // o.value is now equal to 6
```

So, what happens when you pass in a method of an object? Most would expect (or at least I did) that it would be passed by reference allowing the method to access other parts of the object it is apart of. Unfortunately, that’s not the case. Check out this example:

```
function myobject()
{
	this.value = 5;
}
myobject.prototype.add = function()
{
	this.value++;
}
var o = new myobject();
alert(o.value); // o.value = 5
o.add();
alert(o.value); // o.value = 6
function objectchanger(fnc)
{
	fnc(); // runs the function being passed in
}
objectchanger(o.add);
alert(o.value); // sorry, still just 6
```

The problem here is the use of the `this` keyword. It’s a handy short-hand for referring to the current object context. When passing a function as a parameter, though, the context is lost. More accurately, this now refers to the context of the object making the call instead of the object’s function we just passed in. For standalone functions, this would be the window object and for functions called from an event, this would be the *event* object.

### Solving the problem
There are two possible ways to get around this.

#### Option 1: When you know the method

If you know the method of the object that will be called then it’s fairly easy. Just pass in the object instead of the function and call that instead. Using the objectchanger from the last example you’d get the following:

```
function objectchanger(obj)
{
	obj.add(); // runs the method of the object being passed in
}
objectchanger(o);
alert(o.value); // the value is now 7
```
#### Option 2: When you don’t know the method

If you don’t know the method of the object being passed in then you need to pass both the method and the object as parameters and use the `call` method. `call` is part of the JavaScript specification and allows a function to run in the context of another object. As a result, the this keyword will reference the right object: the object we passed in.

Here’s our objectchanger function one more time:

```
function objectchanger(fnc, obj)
{
	fnc.call(obj); // runs the method of the object being passed in
}
objectchanger(o.add, o);
alert(o.value); // the value is now 7
```
Happy Scripting!
