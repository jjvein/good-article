## [Preload](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)

&emsp;&emsp;__Preload__ [spec](https://w3c.github.io/preload/)是一个新的web标准，其目标是给开发者提供更细粒度的加载控制，它使得开发者可以自定义资源加载逻辑而不用再忍受基于脚本的资源加载方式引起的性能问题。

&emsp;&emsp;几个星期前,我在 [Chrome Canary](https://www.google.com.tw/chrome/browser/canary.html) 上面发布了`preload`的支持,并且修复了它给Chrome稳定性带来影响的几个bug。那么，`preload`是什么，它有什么用，它怎样才能帮助你呢？ 

```<link rel="preload"> ```是一个声明式的获取资源的指令。

简单的说，它就是告诉浏览器获取某个指定资源，因为作为开发者，我们知道浏览器将会很快需要某个特殊的资源。

###难道我们没有吗？  
&emsp;&emsp;我们确实有了好几个了，但并不是完全一致。

`<link rel="prefetch">`已经很早且被大量浏览器支持。在那之前，我们也已经支持了
`<link ref="subresource">`。那么，preload有什么新特性呢？它和prefetch,subresource的区别在哪里呢？它们不都是告诉浏览器去获取资源吗？   

确实，但它们之间还是有些重要的区别。这些不同点证明了新的`preload`指令能解决老的指令无法做到的事情。

`<link rel="prefetch">`指令告诉浏览器去请求下一个可能的请求地址，这也意味资源将会以极低的优先级被加载。（每个浏览器都知道当前的页面才是最重要的。）所以`prefetch`的主要使用目的是加速下一个请求的页面而不是当前这个。

`<link rel="subresource">`
最初被设计处理当前的请求，但是在一些明显的问题上它却无法满足。因为网页开发者无法定义资源的优先级，而对于Chrome，或者基于Chrome的浏览器，也是以极低的优先级去获取资源，这也意味着，在大多数情况下，资源请求和子资源请求几乎是同时发出，好像`subresourece`的定义不存在一样。 


###为什么Preload 能够做到更好？   	
	
`Preload`像`subresource`一样，都是为现代浏览器而设计，但是它有一个非常小，但很重要的不同点，它有一个*as*属性，可以做到*subresource*和*prefetch*无法做到的事情： 
 
- 浏览器可以设置正确的资源优先级，它们能够被依次加载且不会阻塞重要的资源，也不会将这些重要资源隐藏起来。
- 浏览器可以确定资源请求是符合CSP(Content-Security-Policy)指令的，不会超出服务请求的标准。
- 浏览器能够根据资源类型发送合适的接收头部。(例如. 广告支持 *image/webp* 的请求图片类型)
- 浏览器知道资源类型以后，在下次请求相同资源时能够决策其是否可以被重复利用。

Preload还有一个*onload*事件(至少在Chrome中，onload事件没有被除__preload__以外的其它rel值使用)。

在此基础上，__preload__不会阻塞浏览器的*onload*事件，除非该资源也正在被阻塞*onload*事件的资源请求。  

将这些独立的特点集合到一起，我们就能够完成大量目前为止无法实现的新功能。  

### 加载“后来被发现的”的资源  

&emsp;&emsp;我们可以使用*preload* 来提前加载后来被发现的资源。虽然大多数资源基于标签的资源都会提早被浏览器的[preloader](http://calendar.perfplanet.com/2013/big-bad-preloader/)早早的发现，但是还有一些资源并不是基于标签的。有些资源隐藏在CSS和Javascript中，浏览器直到需要它们的时候才会去加载资源。在很多情况下，这些资源将会第一次阻塞渲染，阻塞文字或者页面重要的模块渲染。  

现在，你可以告诉浏览器，“浏览器，这个资源你后面会用到，现在就加载进来吧。”。代码实现：  

```
<link rel="preload" href="late_discovered_thing.js" as="script">
``` 
*as*属性告诉浏览器资源的类型。可能的资源类型有： 

- *script*,
- *style*,
- *image*,
- *media*,
- *document*。

完整的标准的定义： [fetch spec](https://fetch.spec.whatwg.org/#concept-request-destination)    

如果忽略了*as*属性，活着设置了一个无效的值等价于一个XHR异步请求，浏览器不知道它请求的内容，于是给它一个相当低的优先级。  

### 提前加载字体  

&emsp;&emsp;提前加载“后来被发现的资源”的一个体现是网页字体。一方面它们对于页面字体的渲染是非常重要的，另外，它们深藏在CSS的内部，即使浏览器的preloader解析了CSS，它们也只能在选择器真的对某个DOM节点应用该字体时才能确定它们是有用的。理论上，浏览器是可以分析出来，但是它们并不这样做。如果它们下一行CSS规则分析出的字体规则覆盖了现有规则，就可能会引起虚假的下载请求。

简言之，很复杂。  

但是，你可以不用考虑所有复杂性来使用`preload`指令预先加载需要的字体文件。

```
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```
值得注意的是：如果你通过匿名的CORS跨站方式请求资源，则需要添加一个跨域的*crossorigin* [attribute](https://github.com/w3c/preload/issues/32) 属性，即使你的资源是同域的。  

还有，*type*属性是让支持的该资源类型的浏览器去加载。目前，只有Chrome卢兰奇支持preload, 且支持WOFF2资源类类型。但是将来会有更多的浏览器支持*preload*，但是我们不确定它们也会支持WOFF2资源类型。现实就是对于任何你想预先加载的资源类型，浏览器都不是全部支持的。 

###不需要执行代码的动态加载 
 
&emsp;&emsp;另外一个非常有趣的应用场景突然成为可能的事当你想下载某个资源，但是却不想马上执行。

举个例子，想象当你在页面生命周期里的某个阶段执行一段脚本。
现在，想做这件事的方法是非常有限的。如果你只将这段脚本注入到某个点时，浏览器首先需要下载它，这将会花费一点时间。你也可以使用XHR提前下载脚本，但是因为下载到资源并不是和当前执行的脚本是相同的类型，浏览器拒绝执行。  

###我们可以做什么？   
在没有*preload*以前，（在一些场景下，你可以使用*eval()*函数包裹内容，解析脚本，但是这种方案不可靠且有其它影响。）但是使用*preload*可以满足需求。

```
var preload = document.createElement("link");
link.ref = "myscript.js";
link.rel = "preload";
link.as = "script";
document.head.appendChild(link);
```

你可以在页面加载之初执行该脚本，一旦你想用该脚本，简单的在代码中插入几行脚本。

```
var script = document.createElement("script");
script.src = "myscript.js";
document.body.appendChild(script);
``` 

### 基于标记的异步加载  

&emsp;&emsp;另一个非常有趣的hack方法是使用*onload*事件来创建一些基于标签的异步加载。Scott Jehl 是第一个使用该方法加载他的css库的 [experiment](https://github.com/filamentgroup/loadCSS/issues/59)。简单的说，

```
<link rel="preload" as="style" href="async_style.css" onload="this.rel='stylesheet'">
```
可以通过标签完成异步加载。这对于异步的javascript同样可行。[demo](http://filamentgroup.github.io/loadCSS/test/preload.html)

我们不是已经有了`<script async>`？`<script async>`是很棒，但是它阻塞了window的*onload*事件，可能在有些情况下，这确实是你想要的，但通常情况下并不是这样。

当你想下载一个分析的脚本，首先你想这个分析脚本下载足够快，（避免分析脚本丢失用户)，但是你不想带宽和用户体验变差，尤其，你不想让onload事件延迟。使用*preload*,完成这件事就变的很简单:

```
<link rel="preload" as="script" href="async_script.js"
onload="var script = document.createElement('script');
script.src = this.href;
document.body.appendChild(script);">
```
这里在*onload*事件中插入这样长的代码定义，可以使用内连的函数来解决。

###响应式加载  

&emsp;&emsp;因为`preload`是一个`link`标签，由spec标准可知，它有一个`media`的属性（这个功能将要被Chrome支持）。它可以让浏览器选择性的加载资源。 
 
这又有什么好处呢？ 网站桌面版的`viewport`有多个，但是对于手机版就只能选择一个默认的`viewpoint`版本。

可能你想让它足够聪明，你就可以按照需要加载需要的一个静态资源，而不是都加载。实现这个的唯一方案就是使用JS来动态加载。但是这样做对于`preloader`就不可见了，它们可能在需要的时候才会被加载，这将会影响到用户的视觉体验，并且会影响到[SpeedIndex](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index)的成绩。  
如何才能让浏览器发现这些资源并提前加载呢？ 是的，`preload`。  
我们可以使用`preload`提前加载这些静态资源：

```
<link rel="preload" as="image" href="map.png" media="(max-width: 600px)">
<link rel="preload" as="script" href="map.js" media="(min-width: 601px)">
```

###特性检测
最后一点，我们所有的例子都是假设浏览器支持基本的脚本或样式加载，如果浏览器不支持这些功能呢？  
那所有的都不会正常工作。这并不是我们期望看到的结果。所以我们需要做一下特性检测：

```
var DOMTokenListSupports = function(tokenList, token) {
  if (!tokenList || !tokenList.supports) {
    return;
  }
  try {
    return tokenList.supports(token);
  } catch (e) {
    if (e instanceof TypeError) {
      console.log("The DOMTokenList doesn't have a supported tokens list");
    } else {
      console.error("That shouldn't have happened");
    }
  }
};

var linkSupportsPreload = DOMTokenListSupports(document.createElement("link").relList, "preload");
if (!linkSupportsPreload) {
  // Dynamically load the things that relied on preload.
}
```
