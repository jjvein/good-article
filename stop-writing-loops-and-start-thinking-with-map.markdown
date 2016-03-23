## [stop-writing-loops-and-start-thinking-with-maps](http://www.sitepoint.com/quick-tip-stop-writing-loops-start-thinking-with-maps/)

This article was peer reviewed by Chris Perry, Marc Towler, Simon Codrington and Tim Evko. Thanks to all of SitePoint’s peer reviewers for making SitePoint content the best it can be!

There comes a time in the learning path for most programmers when they discover a function called map. Up until discovering the map function, you might use a for loop whenever you needed your machine to perform some action many times. In the common case, that action would be transforming some data.

你们应该都已经接触过`map`这个方法了。在了解到这个方法以前，当你需要计算机做一些重复的工作时，都会使用`for`来完成。通常这些场景中，都会做一些数据的转换工作。

### Imperative

For example, a salesperson on your team hands you a big list of email addresses. Not a great deal of care was taken in validating the email addresses as they were coming in, so some of them are uppercase, some of them are lowercase, and some of them are a mix of the two. The for loop approach to transforming the data looks like this:

命令式编程

举个例子，你们团队的销售人员需要处理大量的email地址。没有很好的验证email地址的格式，导致大小写混合。需要使用loop方法来完成数据格式的转换，代码如下：

```
var mixedEmails = ['JOHN@ACME.COM', 'Mary@FooBar.com', 'monty@spam.eggs'];

function getEmailsInLowercase(emails) {
  var lowercaseEmails = [];

  for (var i = 0; i < emails.length; i++) {
    lowercaseEmails.push(emails[i].toLowerCase());
  }

  return lowercaseEmails;
}

var validData = getEmailsInLowercase(mixedEmails);
```

This approach works, but it involved a painful amount of ceremony to achieve what is in reality a simple and common operation. Our function with the for loop encodes so much detail that we didn’t intend to express. A few sore points:

- We told the machine that it needs to create a temporary list that it copies email addresses to.
- We told the machine to first count how many email addresses we want to transform, and then move through the list of email addresses exactly that number of times.
- We told the machine to create a counter so it knows what position of the email address list its operating on.
- We told the machine which direction it should count in, which implies that ordering is important at this stage — which it isn’t.
This is the imperative approach to programming. We are dictating to the machine how it should do its job.

这个方法有效的完成了工作，但是即使是处理一个很简单的逻辑时，同样需要这些让人头痛的步骤。而且`for`循环包含了大量我们不知道的细节内容。这里指出以下痛点：

- 我们告诉机器需要将email地址列表拷贝一份。
- 我们告诉机器首先计算一下需要转换多少个email地址，然后依次执行这么多次数。
- 我们告诉机器创建一个计数器，这样它能够知道它执行的位置。
- 我们告诉机器执行的方向，这也就是说执行的方向也很重要。

这就是命令式的编程方法。我们需要通过一步步的指令去告诉机器应该做的工作。

### Confused

We want to clean up the previous approach, so we reach for the map function. As we read through any documentation for the map function, we see words like “array”, “each”, and “index”. This would suggest we could treat map as a slightly less ceremonious for loop, and indeed we can. Let’s change our original function.

不考虑使用以前的方法，我们现在使用`map`方法来实现。在我们阅读使用文档的时候，我们经常能看见例如“array”，“each”还有"index"这样的表述词汇。这是在说明`map`可以被当做步骤简单的循环。让我们来改一下原始的函数。

```
var mixedEmails = ['JOHN@ACME.COM', 'Mary@FooBar.com', 'monty@spam.eggs'];

function getEmailsInLowercase(emails) {
  var lowercaseEmails = [];

  emails.map(function(email) {
    lowercaseEmails.push(email.toLowerCase());
  });

  return lowercaseEmails;
}

var validData = getEmailsInLowercase(mixedEmails);
```

This works, and is cleaner than the for loop approach. Aside from there being fewer characters in the code snippet, we’re not telling the machine how to keep track of indexes or which direction it should work through our list.

However, this is not enough. This is still the imperative approach to programming. We are still dictating far too much. We are concerning ourselves with details we need not concern ourselves with, and we are holding our computer’s hand every step of the way.

这个代码工作正常，并且比原始的loop方法看起来更加干净。除了更少的代码片段，我们也免去告诉机器如何跟踪索引或者它应该从哪个方向开始。

然而，这还不够。这依然是命令式的编程方法。我们依然下达了太多的指令。这好比抓住了计算机的手，告诉它做这做那，关注了太多的细节工作。

### Declarative
What we need is to change the way we think about the data transformation. We don’t think “Computer, I need you to take the first element of this list, then lowercase it, then push it to this other list, then return the list”. Instead we think “Computer, I have a list of mixed-case email addresses, and I need a list of lower-case email addresses. Here’s the function that does lowercasing.

var mixedEmails = ['JOHN@ACME.COM', 'Mary@FooBar.com', 'monty@spam.eggs'];

function downcase(str) {
  return str.toLowerCase();
}

var validData = mixedEmails.map(downcase);
It’s not a stretch to argue that this is more readable to a human, and that’s what programming is all about: expressing ideas to other humans, be they other developers or your future self. The above snippet says “Our valid data is our mixed emails list mapped over the downcase function”.

Expressing ideas at such a high level like this is a core tenet of the school of functional programming, and that’s essentially what we’re doing. Complex programs are built by combining simple components which have a single responsibility and are easy to understand.

There are several further advantages to this approach. In no particular order:

Our lowercasing function provides the simplest-possible interface; a single value in, and a single value out.
There are fewer moving parts, so our logic is easier to understand, easier to test, and is less likely to break.
Our logic does just one thing, so it’s easy to reuse and combine with other functions in order to express more complex ideas.
It’s not uncommon for the size of a codebase to shrink dramatically when going down this declarative road.
Although the use of an anonymous function as the first argument to map() is common, I recommend pulling functions out and giving them meaningful names. This helps to document your intent with the function, so another developer later can understand what the method does by reading the name instead of having to 
mentally parse the implementation.

Browser Support
The native map() method is defined in the ECMAScript 5 specification and has good browser support. If you need to support an Internet Explorer version earlier than 9, you can introduce a polyfill or use a library like Underscore or Lodash.

Performance
In the vast majority of cases, the choice between the map function and a for loop will have no performance implications in real-world code. The for loop is marginally faster, but the difference is not worth considering unless you’re writing some form of graphics or physics engine, and even then it doesn’t make sense to introduce this optimization before profiling your performance-critical code so you have some hard data to work on.

Wrapping Up
The functional approach of separating logic into simple pure methods and applying those methods to data structures will make your code more concise, more robust, and easier to understand. The concept is general, and more general concepts allow for greater code reuse. Learning to think this way will improve not only your JavaScript, but your work with most other programming languages too; you can apply this approach in Ruby as readily as you can in Haskell.

So, next time you reach for a for loop, reconsider. Bear in mind that the data structure you begin with doesn’t necessarily need to be a flat array; you can start with an object, pull out its values, then map a function over that and end by sorting the resulting array. You can even use a library such as Underscore to map over object preserving the keys.

Can you think of any more creative ways of using the map() function? Experiment, and watch your code shrink.

