###[Moving beyond window.onload](http://www.stevesouders.com/blog/2013/05/13/moving-beyond-window-onload/)

[Originally posted in the 2012 Performance Calendar. Reposting here for folks who missed it.]

There’s an elephant in the room that we’ve been ignoring for years:

> window.onload is not the best metric for measuring website speed

We haven’t actually been “ignoring” this issue. We’ve acknowledged it, but we haven’t coordinated our efforts to come up with a better replacement. Let’s do that now.

最开始的版本在Performance Calendar[2012 Performance Calendar](http://calendar.perfplanet.com/2012/moving-beyond-window-onload/) 上面就已经介绍过,这里是给那些错过的同学看的。  
有一个我们一直忽略的事实：
> window.onload并不是衡量一个网站速度的最佳选择。

其实我们并不是真的“忽略”了这个问题，只是我们并没有找到一个更好的代替方案。

###window.onload is so Web 1.0
What we’re after is a metric that captures the user’s perception of when the page is ready. Unfortunately, perception.ready() isn’t on any browser’s roadmap. So we need to find a metric that is a good proxy.

Ten years ago, window.onload was a good proxy for the user’s perception of when the page was ready. Back then, pages were mostly HTML and images. JavaScript, CSS, DHTML, and Ajax were less common, as were the delays and blocked rendering they introduce. It wasn’t perfect, but window.onload was close enough. Plus it had other desirable attributes:

1. standard across browsers – window.onload means the same thing across all browsers. (The only exception I’m aware of is that IE 6-9 don’t wait for async scripts before firing window.onload, while most other browsers do.)
2. measurable by 3rd parties – window.onload is a page milestone that can be measured by someone other than the website owner, e.g., metrics services like Keynote Systems and tools like Boomerang. It doesn’t require website owners to add custom code to their pages.
3. measurable for real users – Measuring window.onload is a lightweight operation, so it can be performed on real user traffic without harming the user experience.


###window.onload 是web 1.0
我们期望的是一个可以捕获用户视觉上页面加载完成点指标。不幸的是，浏览器并没有提供这样一个`perception.ready()`的api。所以我们需要找到一个可以很好代替它的指标。  
十年前，window.onload 可以很好的代替用户视觉的页面加载完成点。那时候，页面大部分都是HMTL和图片。Javascript,CSS,DHTML 和Ajax正如它们介绍的延迟和渲染阻塞一样，都不尽相同。window.onload 非常接近接近，而且还有其它值得注意的属性：

1. 各个浏览器兼容－所有浏览器都支持window.onload。（我知道唯一的不同点是只有IE6-9在异步Javascript还没有加载完成就触发了window.onload事件).
2. 可以被第三方衡量－window.onload作为页面加载的里程碑可以被除网站拥有者以外的其它人衡量，例如，指标服务如[Keynot System](http://www.keynote.com/),工具服务如：[Boomerang](http://yahoo.github.com/boomerang/doc/). 它并不需要网页拥有者添加额外的代码。
3. 可以作为使用者的衡量－衡量window.onload 是一个简单的操作，它可以在不损害用户体验的情况下展示给用户真实的网络情况。

###Web 2.0 is more dynamic
Fast forward to today and we see that window.onload doesn’t reflect the user perception as well as it once did.

There are some cases where a website renders quickly but window.onload fires much later. In these situations the user perception of the page is fast, but window.onload says the page is slow. A good example of this is Amazon product pages. Amazon has done a great job of getting content that’s above-the-fold to render quickly, but all the below-the-fold reviews and recommendations produce a high window.onload value. Looking at these Amazon WebPagetest results we see that above-the-fold is almost completely rendered at 2.0 seconds, but window.onload doesn’t happen until 5.2 seconds. (The relative sizes of the scrollbar thumbs shows that a lot of content was added below-the-fold.)

###Web 2.0更加动态
网页技术发展到今天，window.onload已经不再和以前一样能够反映用户视觉上页面加载成功点了。
  
举几个网站渲染很快，但是window.onload事件却很晚才触发。在这种情况下，用户视觉上页面加载很快，但是window.onload却说页面很慢。Amazon的宝贝详情页就是一个很好的例子。Amazon让"above-the-fold"的内容加载非常快的呈现给用户，但是所有"below-the-fold"的产品评价内容导致window.onload值非常大。看下[Amazon WebPagetest results](http://www.webpagetest.org/video/compare.php?tests=121212_KF_V7Y-r%3A3-c%3A0&thumbSize=200&ival=1000&end=visual),页面完成第一次渲染事件在2.0s，但是window.onload直到5.2s才触发。（通过滚动条可以看到大量的内容被添加到"below-the-fold"上。）  
![图片1](http://www.webpagetest.org/results/12/12/12/KF/V7Y/video_3/frame_0020.jpg)
![图片2](http://www.webpagetest.org/results/12/12/12/KF/V7Y/video_3/frame_0038.jpg)

But the opposite is also true. Heavily dynamic websites load much of the visible page after window.onload. For these websites, window.onload reports a value that is faster than the user’s perception. A good example of this kind of dynamic web app is Gmail. Looking at the WebPagetest results for Gmail we see that window.onload is 3.3 seconds, but at that point only the progress bar is visible. The above-the-fold content snaps into place at 4.8 seconds. It’s clear that in this example window.onload is not a good approximation for the user’s perception of when the page is ready.   

相反的情况也同时存在。动态加载的页面在window.onload之后可见。这些网站，window.onload反映的值比用户视觉上页面加载完成点要快很多。[Gmail](https://gmail.com/)就是一个很好的例子。我们看下[WebPagetest result for Gmail](http://www.webpagetest.org/video/compare.php?tests=121212_KK_VED-r%3A2-c%3A0&thumbSize=200&ival=1000&end=visual)，我们发现window.onload事件在3.3s触发，但是这个时候只有进度条是可见的，"above-the-fold"的内容直到4.8s才呈现。同样，这样情况window.onload也不能很好的反映用户视觉页面加载成功点。  

###it’s about rendering, not downloads
The examples above aren’t meant to show that Amazon is fast and Gmail is slow. Nor is it intended to say whether all the content should be loaded before window.onload vs. after. The point is that today’s websites are too dynamic to have their perceived speed reflected accurately by window.onload.

The reason is because window.onload is based on when the page’s resources are downloaded. In the old days of only text and images, the readiness of the page’s content was closely tied to its resource downloads. But with the growing reliance on JavaScript, CSS, and Ajax the perceived speed of today’s websites is better reflected by when the page’s content is rendered. The use of JavaScript and CSS is growing. As the adoption of these dynamic techniques increases, so does the gap between window.onload and the user’s perception of website speed. In other words, this problem is just going to get worse.

The conclusion is clear: the replacement for window.onload must focus on rendering.

###它只关于渲染，而不是下载
上面的例子并不是要说明Amazon比Gmail快，也不是说所有内容应该在window.onload之前还是之后加载，而是为了说明如今的网页太过于动态，window.onload并不能准确的反映出他们期待的网页加载速度。  
原因就是window.onload是基于页面资源何时完全加载。以前的页面之后文字和图片，用户对页面的可读性时间和资源加载也是非常贴近的。但如今网页对于JS，CSS，Ajax的依赖加重，页面何时被渲染才是能够更好的反映出事实的衡量指标。随着越来越多的网页动态技术的使用，window.onload与用户视觉上网页加载成功点之间的间隔越来越大。换句话说，问题变的越来越糟糕。  
总结：替代window.onload的衡量指标必须专注在渲染上。  

###what “it” feels like
This new performance metric should take rendering into consideration. It should be more than “first paint”. Instead, it should capture when the above-the-fold content is (mostly) rendered.

I’m aware of two performance metrics that exist today that are focused on rendering. Both are available in WebPagetest. Above-the-fold render time (PDF) was developed at Google. It finds the point at which the page’s content reaches its final rendering, with intelligence to adapt for animated GIFs, streaming video, rotating ads, etc. The other technique, called Speed Index and developed by Pat Meenan, gives the “average time at which visible parts of the page are displayed”. Both of these techniques use a series of screenshots to do their analysis and have the computational complexity that comes with image analysis.

In other words, it’s not feasible to perform these rendering metrics on real user traffic in their current form. That’s important because, in addition to incorporating rendering, this new metric must maintain the attributes mentioned previously that make window.onload so appealing: standard across browsers, measurable by 3rd parties, and measurable for real users.

Another major drawback to window.onload is that it doesn’t work for single page web apps (like Gmail). These web apps only have one window.onload, but typically have several other Ajax-based “page loads” during the user session where some or most of the page content is rewritten. It’s important that this new metric works for Ajax apps.

###“它”究竟长什么样
这个新的性能衡量指标需要将渲染纳入考虑范围。它不仅仅是"first paint",它应该捕获何时"above-the-fold"渲染（大部分）成功。  
我知道的目前有两个专注于渲染的性能衡量指标。它们都被[WebPagetest](http://www.webpagetest.org/)使用。[Above-the-fold render time (PDF) ](http://assets.en.oreilly.com/1/event/62/Above%20the%20Fold%20Time_%20Measuring%20Web%20Page%20Performance%20Visually%20Presentation.pdf)由google开发。
它能够找到网页内容何时渲染成功，并且能够很聪明的动态Gif，视频，广告等做调整。另一个由Pat Meenan开发的技术叫[Speed Index](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index),能够给出网页内容呈现出来的平均时间。这些技术都使用一系列的网页截屏来分析，并且需要大量的图片复杂分析。  
换句话说，这些方法都并不适合用于实际的用户通信中。这个很重要，除了整合渲染以外，这个新技术必须包含之前window.onload提到的几大属性：各个浏览器都兼容，可以被第三方衡量，可以作为用户的衡量。   
另外window.onload还有另外一个不足之处是，对于像Gmail这样的单页面，window.onload只触发一次，但是通常都会有其它基于Ajax的异步页面加载来覆盖原有内容。所以新的衡量指标也需要支持SPA这样的单页面。  

###ball rolling
I completely understand if you’re frustrated by my lack of implementation specifics. Measuring rendering is complex. The point at which the page is (mostly) rendered is so obvious when flipping through the screenshots in WebPagetest. Writing code that measures that in a consistent, non-impacting way is really hard. My officemate pointed me to this thread from the W3C Web Performance Working Group talking about measuring first paint that highlights some of the challenges.

To make matters worse, the new metric that I’m discussing is likely much more complex than measuring first paint. I believe we need to measure when the above-the-fold content is (mostly) rendered. What exactly is “above-the-fold”? What is “mostly”?

Another challenge is moving the community away from window.onload. The primary performance metric in popular tools such as WebPagetest, Google Analytics Site Speed, Torbit Insight, SOASTA (LogNormal) mPulse, and my own HTTP Archive is window.onload. I’ve heard that some IT folks even have their bonuses based on the window.onload metrics reported by services like Keynote Systems and Gomez.

It’s going to take time to define, implement, and transition to a better performance metric. But we have to get the ball rolling. Relying on window.onload as the primary performance metric doesn’t necessarily produce a faster user experience. And yet making our websites faster for users is what we’re really after. We need a metric that more accurately tracks our progress toward this ultimate goal.

###传球
我非常理解你对我没有实现这个标准的沮丧。衡量渲染是非常复杂的工作。我们可以通过使用WebPagetest来查看页面截屏很快的找到页面何时加载，但是代码实现非常困难。  
更麻烦的是，这个新的标准并不仅仅是要衡量出首次渲染的时间，我们还需要衡量“above-the-fold”的内容何时渲染。什么是"above-the-fold",什么又是"大部分"呢？  

另外的挑战是推动社会不再使用window.onload。对于WebPagetest, Google Analytics Site Speed, Torbit Insight, SOASTA(LogNormal)mPulse,还有我自己的HTTP Archive 都是使用window.onload作为基础的性能衡量指标。  
想要定义，实现和推广更好的性能衡量指标是需要花时间的。但是我们必须让更多人知道，依赖window.onload作为基本的衡量指标并不能创造出更快的用户体验。我们需要一个真正能准确衡量出网页加载进度来达到终极目标。




