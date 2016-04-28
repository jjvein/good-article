## [Async Attribute and Scripts At The Bottom](https://css-tricks.com/async-attribute-scripts-bottom/)
CHRIS COYIER // JUNE 16, 2014

A reader recently wrote in and (essentially) asked me:

> Is there any reason to use the async attribute when the script is already at the bottom of the page?
I'm not a master at this stuff, but this is how I understand it...


What he was talking about was this:

```
  <script async src="/js/script.js"></script>

</body>
```
We've covered this before a bit. It's extra-interesting to re-visit now though, because the [async attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) is now really the [only recommended way](https://www.igvita.com/2014/05/20/script-injected-async-scripts-considered-harmful/) to be doing async scripts.

So, is there any reason to use the async attribute when the script is already at the bottom of the page?

### Short Answer

No.

### Longer Answer

What you are trying to prevent with the async attribute is parser blocking. If you use the async attribute, you are saying: I don't want the browser to stop what it's doing while it's downloading this script. I know that this script doesn't really depend on anything being ready in the DOM when it runs and it also doesn't need to be run in any particular order.

If you load the script at the bottom of the page, the parser is effectively done already, so blocking it isn't a big deal. You're essentially already deferring the script, which is kinda like a more hardcore async. [See comparison](http://peter.sh/experiments/asynchronous-and-deferred-javascript-execution-explained/).

### It might even be a little dangerous.

If you were just operating under the assumption that async = good, you might do something like:

```
  <script async src="/js/libs.js"></script>
  <script async src="/js/page.js"></script>

</body>
```
That could be bad news, because chances are "libs.js" has dependencies for "page.js", but now there is no guarantee the order in which they run (bad).

### It's mostly third-party thing.

Third-party scripts are the big use-case for async scripts. They (the third-parties) can't control where you put that script on your page, so they are typically designed to work no matter when/where they load anyway. You also can't control third-parties (that's what a third-party is, Wayne) so making darn sure they don't slow your site down is ideal.

### Is there any other use-cases?

I guess if you really wanted to get the download started on one of your own scripts right away, and it didn't matter when it ran, you could put it in the <head> and async it.

### I might be kinda wrong.

I tend to screw up these JavaScript advice posts, so if I did, let's talk about it in the comments and I'll make sure the content of this post reflects the best information.

