##[The future of loading CSS](https://jakearchibald.com/2016/link-in-body/?utm_source=html5weekly&utm_medium=email)  
[jaffathecake at twitter](https://twitter.com/jaffathecake) 谷歌高级开发工程师  

Chrome is intending to change the behaviour of <link rel="stylesheet">, which will be noticeable when it appears within <body>. The impact and benefits of this aren't clear from the blink-dev post, so I wanted to go into detail here.  
Chrome 打算改变默认的css加载规则`<link rel="stylesheet">`,改成在`<body>`中显示的加载。这个改变的影响和好处不能在开发文档中很好的阐述，所以在这里做一个详细的介绍。

###The current state of loading CSS  
```
<head>  
  <link rel="stylesheet" href="/all-of-my-styles.css">
</head>
<body>
  …content…
</body>
```
CSS blocks rendering, leaving the user staring at a white screen until all-of-my-styles.css fully downloads.  

It's common to bundle all of a site's CSS into one or two resources, meaning the user downloads a large number of rules that don't apply to the current page. This is because sites can contain many types of pages with a variety of "components", and delivering CSS at a component level hurts performance in HTTP/1.

This isn't the case with SPDY and HTTP/2, where many smaller resources can be delivered with little overhead, and independently cached. 
 
```
<head>  
  <link rel="stylesheet" href="/site-header.css">
  <link rel="stylesheet" href="/article.css">
  <link rel="stylesheet" href="/comment.css">
  <link rel="stylesheet" href="/about-me.css">
  <link rel="stylesheet" href="/site-footer.css">
</head>
<body>
  …content…
</body>  
```
This fixes the redundancy issue, but it means you need to know what the page will contain when you're outputting the <head>, which can prevent streaming. Also, the browser still has to download all the CSS before it can render anything. A slow loading /site-footer.css will delay the rendering of everything.

###当前加载CSS的状态
```
<head>  
  <link rel="stylesheet" href="/all-of-my-styles.css">
</head>
<body>
  …content…
</body>
```
CSS阻塞了渲染，在`all-of-my-styles.css`文件完全加载之前，浏览器处于白屏状态。  
最常见的网站打包策略是将所有的CSS资源打包成一个或者两个，这也意味着浏览器可能要下载大量它们不需要应用到当前页面的规则。
这是因为网站会包含多种类型的页面，每个页面可能又有多种`component`组件，如果按照组件的级别去请求资源，非常影响性能。  
这种问题在`SPDY`和`HTTP/2`中将不会出现，因为非常多的小资源请求也不会消耗大量的性能，并且这些小资源可以被单独缓存起来。 
 
```
<head>  
  <link rel="stylesheet" href="/site-header.css">
  <link rel="stylesheet" href="/article.css">
  <link rel="stylesheet" href="/comment.css">
  <link rel="stylesheet" href="/about-me.css">
  <link rel="stylesheet" href="/site-footer.css">
</head>
<body>
  …content…
</body>
```  
以上代码模式修复了资源冗余的问题，同时，这也意味着你必须知道网页包含的资源。当然，浏览器仍然需要等待所有资源都加载之后才能渲染。非常慢的`site-footer.css`可能会延迟页面所有资源的渲染。    
###The current state-of-the-art of loading CSS  
```
<head>
  <script>
    // https://github.com/filamentgroup/loadCSS
    !function(e){"use strict"
    var n=function(n,t,o){function i(e){return f.body?e():void setTimeout(function(){i(e)})}var d,r,a,l,f=e.document,s=f.createElement("link"),u=o||"all"
    return t?d=t:(r=(f.body||f.getElementsByTagName("head")[0]).childNodes,d=r[r.length-1]),a=f.styleSheets,s.rel="stylesheet",s.href=n,s.media="only x",i(function(){d.parentNode.insertBefore(s,t?d:d.nextSibling)}),l=function(e){for(var n=s.href,t=a.length;t--;)if(a[t].href===n)return e()
    setTimeout(function(){l(e)})},s.addEventListener&&s.addEventListener("load",function(){this.media=u}),s.onloadcssdefined=l,l(function(){s.media!==u&&(s.media=u)}),s}
    "undefined"!=typeof exports?exports.loadCSS=n:e.loadCSS=n}("undefined"!=typeof global?global:this)
  </script>
  <style>
    /* The styles for the site header, plus: */
    .main-article,
    .comments,
    .about-me,
    footer {
      display: none;
    }
  </style>
  <script>
    loadCSS("/the-rest-of-the-styles.css");
  </script>
</head>
<body>
</body>
```
In the above, we have some inline styles to get us a fast initial render, plus hide the stuff we don't have styles for yet, then load the rest of the CSS async using JavaScript. The rest of the CSS would override the display: none on .main-article etc.

This method is recommended by performance experts as a way to get a fast first render, and with good reason:  

###当前CSS加载艺术
上面我们可以看到，一些内连的样式规则可以帮助我们实现快速的初始化渲染，将暂时还没有请求到样式资源的节点隐藏，之后使用JS来完成异步的CSS加载。
异步CSS会覆盖`.main-article` 的 `display: none`属性。  
这种方法是网站性能专家推荐用来实现网页快速渲染的一种方案。   

```
<head>
  <script>
    // https://github.com/filamentgroup/loadCSS
    !function(e){"use strict"
    var n=function(n,t,o){function i(e){return f.body?e():void setTimeout(function(){i(e)})}var d,r,a,l,f=e.document,s=f.createElement("link"),u=o||"all"
    return t?d=t:(r=(f.body||f.getElementsByTagName("head")[0]).childNodes,d=r[r.length-1]),a=f.styleSheets,s.rel="stylesheet",s.href=n,s.media="only x",i(function(){d.parentNode.insertBefore(s,t?d:d.nextSibling)}),l=function(e){for(var n=s.href,t=a.length;t--;)if(a[t].href===n)return e()
    setTimeout(function(){l(e)})},s.addEventListener&&s.addEventListener("load",function(){this.media=u}),s.onloadcssdefined=l,l(function(){s.media!==u&&(s.media=u)}),s}
    "undefined"!=typeof exports?exports.loadCSS=n:e.loadCSS=n}("undefined"!=typeof global?global:this)
  </script>
  <style>
    /* The styles for the site header, plus: */
    .main-article,
    .comments,
    .about-me,
    footer {
      display: none;
    }
  </style>
  <script>
    loadCSS("/the-rest-of-the-styles.css");
  </script>
</head>
<body>
</body>
```
It requires a (small) JavaScript library  
Unfortunately this is due to WebKit's implementation. As soon as a <link rel="stylesheet"> is added to the page, WebKit blocks rendering until the sheet loads, even if the sheet was added with JavaScript.

In Firefox and IE/Edge, JS-added stylesheets load entirely async. Chrome stable currently has the WebKit behaviour, but in Canary we've switched to the Firefox/Edge behaviour.

You're restricted to two phases of loading
In the pattern above, inline CSS hides unstyled content using display:none, then the async-loaded CSS reveals it. If you scale this to two or more CSS files they're likely to load out-of-order, resulting in content shifting around as it loads:
Content shifting around is right up there with pop-up ads in terms of user frustration. Kill it with fire.

Since you're restricted to two phases of loading, you have to decide what's in your quick first render and what's in the rest. You want "above the fold" content in the quick render of course, but "the fold" is viewport dependent. Well, tough shitties, you've got to pick a one-size-fits-all solution.

Update: If you want to make things really complicated, you can build a kind-of rendering dependency tree using CSS custom properties.
但是这样做也存在一些缺陷：   
#####它需要一个（小的）Javascript库。
不幸的是这就是`webkit`的实现。只要`<link rel="stylesheet">`被添加到页面中，即使是通过Javascript添加的，`Webkit`都会阻塞渲染流程直到资源加载完毕。 
在`Firefox`和`IE/Edge`中，JS加载的样式资源一直异步的。`Chrome Stable`目前还是遵循Webkit 的行为，但是在Canary(金丝雀)版中，我们选择使用Firefox/Edge的表现形式。  
#####你被两个阶段的资源加载限制  
在上面的方法中，inline 的CSS使用`display: none`将没有样式的内容隐藏，然后异步加载的CSS修复它。拓展一下，如果这将这个衍生到两个或者多个资源文件时，并且它们的加载的先后顺序是不确定的，这将导致样式置换：
因为你会被两个阶段的资源加载限制，你需要决定哪个在比较快的加载中定义，哪些在较慢的里面定义。当然，你希望`above the fold`提前得到加载，但是"the fold"是viewpoint独立的。所以还是选择"one-size-fits-all" 方案吧。  
更新：如果你想让事情变的复杂，你可以参考[build a kind-of rendering dependency tree using CSS custom properties](https://jakearchibald.com/2016/css-loading-with-custom-props/)

###A simpler, better way  

```
<head>
</head>
<body>
  <!-- HTTP/2 push this resource, or inline it, whichever's faster -->
  <link rel="stylesheet" href="/site-header.css">
  <header>…</header>

  <link rel="stylesheet" href="/article.css">
  <main>…</main>

  <link rel="stylesheet" href="/comment.css">
  <section class="comments">…</section>

  <link rel="stylesheet" href="/about-me.css">
  <section class="about-me">…</section>

  <link rel="stylesheet" href="/site-footer.css">
  <footer>…</footer>
</body>
```

The plan is for each <link rel="stylesheet"> to block rendering of subsequent content while the stylesheet loads, but allow the rendering of content before it. The stylesheets load in parallel, but they apply in series. This makes <link rel="stylesheet"> behave similar to <script src="…"></script>.

Let's say the site-header, article, and footer CSS have loaded, but the rest are still pending, here's how the page would look:

Header: rendered
Article: rendered
Comments: not rendered, CSS before it hasn't loaded yet (/comment.css)
About me: not rendered, CSS before it hasn't loaded yet (/comment.css)
Footer: not rendered, CSS before it hasn't loaded yet (/comment.css), even though its own CSS has loaded
This gives you a sequential render of the page. You don't need decide what's "above the fold", just include a page component's CSS just before the first instance of the component. It's fully streaming compatible, because you don't need to output the <link> until just before you need it.

You need to take care when using layout systems where content dictates layout (such as tables & flexbox) to avoid content-shifting during load. This isn't a new problem, but progressive rendering can expose it more frequently. You can hack flexbox to behave, but CSS grid is a much better system for overall page layout (flexbox is still great for smaller components).  

这个方案是在加载样式文件时，阻塞下面的渲染，但是允许之前的内容渲染。样式文件的加载是并行的，但是应用到节点是串行的。这使得`<link rel="stylesheet">的行为非常类似`<script src="..."></script>  
我们来看下site-header,article,footer相关的CSS都已经加载，但是在没有渲染到它时，依然处于pending状态。
Header: 渲染完成
Article: 渲染完成
Comments: 未渲染,(/comment.css)没有加载完成
About me: 未渲染,(/comment.css)没有加载完成
Footer: 未渲染,(/comment.css)没有加载完成，尽管它自己的CSS已经加载完成了。
这使得你可以按照顺序的渲染页面。你无需考虑哪个是"above the fold",只需要将样式文件放在component(组件)的第一行。它完全是流式兼容的，因为你只需要内容依赖样式之前输出`<link>`即可。  
你需要注意当使用内容支配布局的布局系统时（如表格和flexbox），要避免"content-shifting".
这并不是一个新问题，但是逐渐的加载会更加频繁的暴露出这个问题。你也可以采用一些hack手段，但是[CSS grid is a much better system for overall page layout](https://jakearchibald.com/2014/dont-use-flexbox-for-page-layout/) 相比会更好。  

###Changes to Chrome   
[The HTML spec](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element) doesn't cover how page rendering should be blocked by CSS, and it discourages <link rel="stylesheet"> in the body, but all browsers allow it. Of course, they all deal with link-in-body in their own way:

Chrome & Safari: Stops rendering as soon as the <link rel="stylesheet"> is discovered, and won't render until all discovered stylesheets have loaded. This often results in unrendered content above the <link> being blocked.
Firefox: <link rel="stylesheet"> in the head blocks rendering until all discovered stylesheets have loaded. <link rel="stylesheet"> in the body does not block rendering unless a stylesheet in the head is already blocking rendering. This can result in a flash of unstyled content (FOUC).
IE/Edge: Blocks the parser until the stylesheet loads, but allows content above the <link> to render.
At Chrome, we like the IE/Edge behaviour, so we're going to align with it. This allows the progressive rendering pattern of CSS described above. We're working on getting this into the spec, starting with allowing <link> in <body>.

The current Chrome/Safari behaviour is backwards compatible, it just ends up blocking rendering for longer than it needs to. The Firefox behaviour is slightly more complicated, but there's a workaround…

Firefixing
Because Firefox doesn't always block rendering for link-in-body, we'll need to work around it a bit to avoid a FOUC. Thankfully this is pretty easy, as <script> blocks parsing, but also waits for pending stylesheets to load:

<link rel="stylesheet" href="/article.css"><script> </script>
<main>…</main>
The script elements have to be non-empty for this to work, a space is good enough.

[The HTML spec](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element) 并没有包含页面渲染应该如何被CSS阻塞，但是它不鼓励在body中使用`<link rel="stylesheet">，但是所有的浏览器都支持它，它们都有自己处理方法： 
- Chrome和Safari：只要发现`<link rel="stylesheet">，立刻停止渲染，直到所有的样式都加载之后才开始渲染，这会导致`<link>`上方没有被及时渲染的部分被阻塞。
- Firefox：在head中定义的`<link rel="stylesheet>"`在没有完全加载之前会阻塞渲染。在body中定义的<`link rel="stylesheet">`不会阻塞渲染，除非Head中的资源加载影响。这可能会导致无样式的页面闪现(FOUC)。
- IE/Edge：阻塞接下来的语法分析，但是允许`<link>之前的内容渲染。

我们喜欢IE/Edge的这种表现形式，并且打算改成这样。这允许CSS的逐渐渲染方式。我们也在努力让这些成为标准，允许在body中使用`<link>`。  
####firefox浏览器修复
因为Firefox浏览器在页面存在`<link>`时并不会阻塞渲染流程，所有我们需要采取一些方法来阻塞FOUC```<link rel="stylesheet" href="/article.css"><script> </script>```,`<script>`元素阻塞了语法分析，同时也会等待stylesheet的加载。`<script>`元素之间不能为空，一个空格就够了。

###See it in action!

Firefox & Edge/IE will give you a lovely progressive render, whereas Chrome & Safari give you a white screen until all the CSS loads. The current Chrome/Safari behaviour is no worse than putting all your stylesheets in the <head>, so you can start using this method today. Over the coming months, Chrome will move to the Edge model, and more users will get a faster render.   
So there we go! A much simpler way to load only the CSS you need, and get a faster render in the process.

Firefox 和 IE/Edge给用户非常友好的逐步渲染，而Chrome和Safari在完全取到CSS之前都是白屏状态，当前Chrome和Safari的行为类似于将所有的CSS放在头部，不过在接下来的几个月中，Chrome将会使用Edge的渲染模式，给用户更快的网页浏览体验。  
加载页面所需的Css，让页面“飞”起来吧。
