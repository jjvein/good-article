

###[Preload: What Is It Good for?](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/?utm_source=html5weekly&utm_medium=email)
&emsp;&emsp;Preload (spec) is a new web standard aimed at improving performance and providing more granular loading control to web developers. It gives developers the ability to define custom loading logic without suffering the performance penalty that script-based resource loaders incur.


&emsp;&emsp;预加载 [spec](https://w3c.github.io/preload/)是一个新的web标准，其目标是给开发者提供更加细粒度的加载控制，它使得开发者可以自定义加载逻辑而不用再遭受基于脚本的资源加载方式引起的性能问题。

A few weeks ago, I shipped preload support in Chrome Canary, and barring unexpected bugs it will hit Chrome stable in mid-April. But what is that preload thing? What does it do? And how can it help you?
Well, <link rel="preload"> is a declarative fetch directive.
In human terms, it’s a way to tell a browser to start fetching a certain resource, because we as authors (or as server administrators, or as smart-server developers) know that the browser is going to need that particular resource pretty soon.

&emsp;&emsp;几个星期前,我在[Chrome Canary](https://www.google.com.tw/chrome/browser/canary.html) 上面发布了`preload`的支持,并且修复了它给Chrome稳定性带来影响的几个bug。那么，`preload`是什么，它有什么用，它怎样才能帮助你呢？ 
```<link rel="preload"> ```
声明式的获取资源的指令。用人类的方式理解，它就是去告诉浏览器何时获取资源，因为作为开发者，我们知道浏览器将会很快需要某个特殊的资源。

###Didn’t We Already Have That? 

&emsp;&emsp;Kinda, but not really. <link rel="prefetch"> has been supported on the web for a long while, and has decent browser support. On top of that we’ve also supported <link rel="subresource"> in Chrome for some time. So what’s new about preload? How is it different from these other directives? They all tell the browser to fetch things, right?
Well, they do, but there are significant differences between them. Differences that warrant a shiny new directive that tackles many use cases that the old ones never did.  
```<link rel="prefetch">```is a directive that tells a browser to fetch a resource that will probably be needed for the next navigation. That mostly means that the resource will be fetched with extremely low priority (since everything the browser knows is needed in the current page is more important than a resource that we guess might be needed in the next one). That means that prefetch’s main use case is speeding up the next navigation rather than the current one.  
```<link rel="subresource">``` was originally planned to tackle the current navigation, but it failed to do that in some spectacular ways. Since the web developer had no way to define what the priority of the resource should be, the browser (just Chrome and Chromium-based browsers, really) downloaded it with fairly low priority, which meant that in most cases, the resource request came out at about the same time that it would if subresource wasn’t there at all.

###我们不是已经有了？  
&emsp;&emsp;确实好几个了，但并不是完全一致。
`<link rel="prefetch">`已经很早且被大量浏览器支持。在哪之前，我们也已经支持了
`<link ref="subresource">`。那么，preload有什么新特性呢？它和prefetch,subresource的区别在哪里呢？它们不都是告诉浏览器去获取资源吗？   
确实，但它们之间还是有些重要的区别。这些不同点证明了新的<code>preload</code>指令能解决老的指令无法做到的事情。
`<link rel="prefetch">`指令告诉浏览器去请求下一个可能的请求地址，这也意味资源将会以极低的优先级被加载。（每个浏览器都知道当前的页面才是最重要的。）所以<code>prefetch</code>的主要使用目的是加速下一个请求的页面而不是当前这个。
`<link rel="subresource">`
最初被设计处理当前的请求，但是在一些重大的问题上它却无法满足。
因为网页开发者无法确定资源的优先级，而对于Chorme，或者基于Chrome的浏览器，也是以极低的优先级去获取资源，这也意味着，在大多数情况下，如果*subresource*不存在的话，资源请求将会同时发出。

###How Can Preload Do Better?   
&emsp;&emsp;Preload is destined for current navigation, just like subresource, but it includes one small yet significant difference. It has an as attribute, which enables the browser to do a number of things that subresource and prefetch did not enable:  
The browser can set the right resource priority, so that it would be loaded accordingly, and will not delay more important resources, nor tag along behind less important resources.

- The browser can make sure that the request is subject to the right Content-Security-Policy directives, and doesn’t go out to the server if it shouldn’t.
- The browser can send the appropriate Accept headers based on the resource type. (e.g. advertise support for “image/webp” when fetching images)
The browser knows the resource type so it can later determine if the resource could be reused for future requests that need the same resource.
- Preload is also different since it has a functional onload event (which, at least in Chrome, wasn’t working for the other two rel values).
- On top of that, preload does not block the window’s onload event, unless the resource is also requested by a resource that blocks that event.
Combining all these characteristics together enables a bunch of new capabilities that were not possible until now.
Let’s go over them, shall we?  		

###为什么Preload 能够做到更好？   		
<code>Preload</code>像<code>subresource</code>一样，但是它有一个非常重要的不同点，它有一个*as*属性，可以做到*subresource*和*prefetch*无法做到的事情：  
- 浏览器可以设置正确的资源优先级，它们能够被依次加载且不会阻塞重要的资源，也不会将这些重要资源隐藏起来。
- 浏览器可以确定资源请求是符合CSP(Content-Security-Policy)指令的，不会超出服务请求的标准。浏览器能够根据资源类型发送合适的接收头部。(例如. 广告支持 *image/webp* 的请求图片类型)浏览器知道资源类型以后，在下次请求相同资源时能够决策其是否可以被重复利用。
- Preload还有一个函数功能的*onload*事件(至少在Chrome中，onload事件没有被除Preload以外的其它rel值使用).
- 另外，*preload*不会阻塞浏览器等*onload*事件，除非该资源也正在被阻塞*onload*事件的资源请求。  
将这些独立的特点集合到一起，我们就能够完成大量目前为止无法实现的新功能。  
让我们一起尝试吧！

###LOADING OF LATE-DISCOVERED RESOURCES  
The basic way you could use preload is to load late-discovered resources early. While most markup-based resources are discovered fairly early by the browser’s preloader, not all resources are markup-based. Some of the resources are hidden in CSS and in JavaScript, and the browser cannot know that it is going to need them until it is already fairly late. So in many cases, these resources end up delaying the first render, the rendering of text, or loading of critical parts of the page.  
Now you have the means to tell the browser, “Hey, browser! Here’s a resource you’re going to need later on, so start loading it now.”
Doing so would look something like:
<link rel="preload" href="late_discovered_thing.js" as="script">
The as attribute tells the browser what it will be downloading. Possible as values include:
"script",
"style",
"image",
"media",
and "document".
(See the fetch spec for the full list.)
Omitting the as attribute, or having an invalid value is equivalent to an XHR request, where the browser doesn’t know what it is fetching, and fetches it with a fairly low priority.

###加载“后来被发现的”的资源  
我们可以使用*preload* 来提前加载后来被发现的资源。虽然大多数资源基于标签的资源都会提早被浏览器发现，但是还有一些资源并不是基于标签的。有些资源隐藏在CSS和Javascript中，浏览器直到需要它们的时候才会去加载资源。在很多情况下，这些资源将会第一次阻塞渲染，阻塞文字或者页面重要的模块渲染。  
现在，你可以告诉浏览器，“伙计，这个资源你后面会用到，现在就加载进来吧。”。代码实现：  
`<link rel="preload" href="late_discovered_thing.js" as="script">`  
*as*属性告诉浏览器资源的类型。可能的资源类型有： *script*,*style*,*image*,*media*,*document*。[fetch spec](https://fetch.spec.whatwg.org/#concept-request-destination)    
如果忽略了*as*属性，活着设置了一个无效的值等价于一个XHR异步请求，浏览器不知道它请求的内容，于是给它一个相当低的优先级。  

---

###EARLY LOADING OF FONTS  
One popular incarnation of the “late-discovered critical resources” pattern is web fonts. On the one hand, in most cases they are critical for rendering text on the page (unless you’re using the shiny font-display CSS values). On the other hand, they are buried deep in CSS, and even if the browser’s preloader parsed CSS, it cannot be sure they’d be needed until it also knows that the selectors that require them actually apply to some of the DOM’s nodes. While in theory, browsers could figure that out, none of them do, and if they would it could result in spurious downloads if the font rules get overridden further down the line, once more CSS rules come in.
In short, it’s complicated.  
But, you could get away from all that complexity by including preload directives for fonts you know are going to be needed. Something like:
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>  
One point worth going over: You have to add a crossorigin attribute when fetching fonts, as they are fetched using anonymous mode CORS. Yes, even if your fonts are on the same origin as the page. Sorry.
Also, the type attribute is there to make sure that this resource will only get preloaded on browsers that support that file type. Right now, only Chrome supports preload, and it does support WOFF2 as well, but more browsers may support preload in the future, and we cannot assume they’d also support WOFF2. The same is true for any resource type you’re preloading and which browser support isn’t ubiquitous.  
### 提前加载字体  
提前加载“后来被发现的资源”的一个体现是网页字体。一方面它们对于页面字体的渲染是非常重要的，另外，它们深藏在CSS的内部，即使浏览器的preloader解析了CSS，它们也只能在选择器真的对某个DOM节点应用该字体时才能确定它们是有用的。理论上，浏览器是可以分析出来，但是它们并不这样做。如果它们下一行CSS规则分析出的字体规则覆盖了现有规则，就可能会引起虚假的下载请求。简单的说，很复杂。  
但是，你可以不用考虑所有复杂性来使用preload指令预先加载需要的字体文件。
```
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```值得注意的是：如果你通过匿名的CORS跨站方式请求资源，则需要添加一个跨域的*crossorigin*属性。即使你的资源是同域的。  还有，*type*属性是让支持的该资源类型的浏览器去加载。目前，只有Chrome卢兰奇支持preload, 且支持WOFF2资源类类型。但是将来会有更多的浏览器支持*preload*，但是我们不确定它们也会支持WOFF2资源类型。现实就是对于任何你想预先加载的资源类型，浏览器都不是全部支持的。  

###DYNAMIC LOADING WITHOUT EXECUTION   
Another interesting scenario that suddenly becomes possible is one where you want to download a resource because you know you’d need it, but you don’t yet want to execute it. For example, think of a scenario where you want to execute a script at a particular point in the page’s life, without having control over the script (so without the ability to add a runNow() function to it).  
Today, you are very limited in the ways you can do that. If you only inject the script at the point you want it to run, the browser will have to then download the script before it can be executed, which can take a while. You could download the script using XHR beforehand, but the browser will refuse to reuse it, since the resource wasn’t downloaded with the same type as the one that is now trying to use the resource.  
###不需要执行代码的动态加载  
另外一个非常有趣的应用场景突然成为可能的事当你想下载某个资源，但是却不想马上执行。
举个例子，想象当你在页面生命周期里的某个阶段执行一段脚本。
现在，想做这件事的方法是非常有限的。如果你只将这段脚本注入到某个点时，浏览器首先需要下载它，这将会花费一点时间。你也可以使用XHR提前下载脚本，但是因为下载到资源并不是和当前执行的脚本是相同的类型，浏览器拒绝执行。  

So what can you do?  
Before preload, not much. (In some cases you can eval() the contents of the script, but that’s not always feasible nor without side effects.) But with preload you can!
var preload = document.createElement("link");
link.href = "myscript.js";
link.rel = "preload";
link.as = "script";
document.head.appendChild(link);
You can run that earlier on in the page load process, way before the point you want the script to execute (but once you’re fairly confident that the script loading will not interfere with other, more critical resources that need loading). Then when you want it to run, you simply inject a script tag and you’re good.
var script = document.createElement("script");
script.src = "myscript.js";
document.body.appendChild(script);  
###我们可以做什么？   
在没有*preload*以前，（在一些场景下，你可以使用*eval()*函数包裹内容，解析脚本，但是这种方案不可靠且有其它影响。）但是使用*preload*可以满足需求。
```
var preload = document.createElement("link");
link.ref = "myscript.js";
link.rel = "preload";
link.as = "script";
document.head.appendChild(link);
```你可以在页面加载之初执行该脚本，一旦你想用该脚本，简单的在代码中插入几行脚本。
```
var script = document.createElement("script");
script.src = "myscript.js";
document.body.appendChild(script);
```  
###MARKUP-BASED ASYNC LOADER  
Another cool hack is to use the onload handler in order to create some sort of a markup-based async loader. Scott Jehl was the first to experiment with that, as part of his loadCSS library. In short, you can do something like:
<link rel="preload" as="style" href="async_style.css" onload="this.rel='stylesheet'">
and get async loaded styles in markup! Scott also has a nice demo page for that feature.  
The same can also work for async scripts.
We already have <script async> you say? Well, <script async> is great, but it blocks the window’s onload event. In some cases, that’s exactly what you want it to do, but in other cases less so.  
### 基于标记的一步加载  
另一个非常有趣的hack方法是使用*onload*事件来创建一些基于标签的异步加载。Scott Jehl 是第一个使用该方法加载他的css库的。简单的说，
```
<link rel="preload" as="style" href="async_style.css" onload="this.rel='stylesheet'">
```可以通过标签完成异步加载。这对于异步的javascript同样可行。
我们不是已经有了`<script async>`？`<script async>`是很棒，但是它阻塞了window的*onload*事件，可能在有些情况下，这确实是你想要的，但通常情况下并不是这样。  

Let’s say you want to download an analytics script. You want it to download fairly quickly (to avoid losing visitors that the analytics script didn’t catch), but you don’t want it to delay any metrics that impact the user experience, and specifically, you don’t want it to delay onload. (You can claim that onload is not the only metric that impacts users, and you would be right, but it’s still nice to stop the spinning loading icon a bit sooner).
With preload, achieving that is easy:
```
<link rel="preload" as="script" href="async_script.js"
onload="var script = document.createElement('script');
        script.src = this.href;
        document.body.appendChild(script);">
```
(It’s probably not a great idea to include long JS functions as onload attributes, so you may want to define that part as an inline function.)  
当你想下载一个分析的脚本，首先你想这个分析脚本下载足够快，（避免分析脚本丢失用户)，但是你不想带宽和用户体验变差，尤其，你不想让onload事件延迟。使用*preload*,完成这件事就变的很简单:
```
<link rel="preload" as="script" href="async_script.js"
onload="var script = document.createElement('script');
        script.src = this.href;
        document.body.appendChild(script);">
```
这里在*onload*事件中插入这样长的代码定义，可以使用内连的函数来解决。
###RESPONSIVE LOADING  
Since preload is a link, according to the spec it has a media attribute. (It’s currently not supported in Chrome, but will be soon.) That attribute can enable conditional loading of resources.
What is that good for? Let’s say your site’s initial viewport has a large interactive map for the desktop/wide-viewport version of the site, but only displays a static map for the mobile/narrow-viewport version.

###响应式加载  
因为`preload`是一个`link`标签，由spec标准可知，它有一个`media`的属性（这个功能将要被Chrome支持）。它可以让浏览器选择性的加载资源。  
这又有什么好处呢？ 网站桌面版的`viewport`有多个，但是对于手机版就只能选择一个默认的`viewpoint`版本。  

If you’re being smart about it, you want to load only one of those resources rather than both. And the only way to do that would be by loading them dynamically, using JS. But by doing that, you’re making those resources invisible to the preloader, and they may be loaded later than necessary, which can impact your users’ visual experience, and negatively impact your SpeedIndex score.
What can we do to make sure the browser is aware of those resources as early as possible?
You guessed it! Preload.  
We can use preload to load them ahead of time, and we can use its media attribute so that only the required script will be preloaded:```
<link rel="preload" as="image" href="map.png" media="(max-width: 600px)">

<link rel="preload" as="script" href="map.js" media="(min-width: 601px)">
```
可能你想让它足够聪明，你就可以按照需要加载需要的一个静态资源，而不是都加载。实现这个的唯一方案就是使用JS来动态加载。但是这样做对于`preloader`就不可见了，它们可能在需要的时候才会被加载，这将会影响到用户的视觉体验，并且会影响到[SpeedIndex](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index)的成绩。  
如何才能让浏览器发现这些资源并提前加载呢？ 是的，`preload`。  
我们可以使用`preload`提前加载这些静态资源：
```
<link rel="preload" as="image" href="map.png" media="(max-width: 600px)">
<link rel="preload" as="script" href="map.js" media="(min-width: 601px)">
```


Feature Detection  
One last point: In some of our examples above, we’re relying on the fact that preload is supported for basic functionality such as script or style loading. What happens in browsers where this is not true?
Everything breaks!
We don’t want that. So as part of the preload effort, we also changed the DOM spec so that feature detection of supported rel keywords would be possible.
An example feature detection function could look something like:
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













