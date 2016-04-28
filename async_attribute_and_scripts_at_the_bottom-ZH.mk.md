## [Async Attribute and Scripts At The Bottom](https://css-tricks.com/async-attribute-scripts-bottom/)
CHRIS COYIER // JUNE 16, 2014

> 如果script 标签已经在页面的底部，是否还需要使用'async'属性呢？ 

虽然我不是这方面的专家，但是下面是我个人的理解。

上面的问题在代码中体现是这样的： 


```
	<script async src="/js/script.js"></script>
	</body>
```

我在之前的文章中已经详细介绍过了。但再次谈到这个属性的时候依然感觉非常有趣，因为[async 属性]((https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) 是目前唯一被推荐用来延迟脚本的。

所以如果脚本本来就在页面的底部，是否真的有必要添加async属性呢？ 

### 简单的回答
不需要

### 详细的解释

你想使用async属性的目的就是处理浏览器解析阻塞问题。当使用async属性的时候，相当于： 我不想浏览器在下载该script脚本时停止它正在做的事情。我知道这个脚本并不依赖DOM的就绪并且也不在乎它所执行的顺序。

如果你在页面的底部加载该script文件，浏览器的解析过程已经完成，所以阻塞就不是什么问题了。

![Async](http://peter.sh/wp-content/uploads/2010/09/execution2.jpg)
解析到脚本是开始下载资源，但是不阻塞主文档的解析过程，脚本下载完以后，开始执行脚本。

### 它甚至还有些危险

如果你认为在页面底部是否使用async属性都没有影响，你可能会写下面的代码：

```
	<script async src="/js/libs.js"></script>
	<script async src="/js/page.js"></script>
	</body>
```
这可能会造成问题，因为page.js可能依赖lib.js,但是我们不能保证它们的执行顺序。

### 第三方脚本使用较多

第三方脚本使用async属性较多。他们无法控制你会在页面的何处使用脚本，所以通常会将脚本设计的不依赖于页面，同时你也无法控制第三方脚本。所以你必须确保它不会影响到页面的加载。

### 还有其他使用场景吗？ 

如果你希望脚本在页面开始就加载，并且不关系它何时执行，你就可以在`<head>`标签中使用async属性。

### 说明

async属性表示该script脚本的下载不会阻塞主文档的渲染，但是如果脚本加载完成，则会被立刻执行该脚本。

### 来自评论

#### 在底部使用async是有意义的。

如果底部存在多个使用async定义的script脚本，并且这些脚本的执行都是相互独立的，那么它们可能会被并发的加载，但是如果前面的脚本晚于后面的脚本加载，那么就先执行已经加载好的脚本。
但是如果没有定义async属性，则后面的脚本必须等待前面脚本加载执行完以后才能开始下载和执行。 

