#Packaging for Performance#
@Author: Senthil Padmanabhan
@Url: http://calendar.perfplanet.com/2015/packaging-for-performance/

An interesting topic of discussion in recent times has been around static resource (JS/CSS) packaging for web applications. Craig Silverstein’s and Rebecca Murphey’s write-ups on this topic provide great insights into the reality of packaging in today’s frontend engineering world. The main question that comes up is, should the strategy for JavaScript and CSS bundling (which is a current performance best practice) change when migrating to HTTP/2? Although in theory the benefit of bundling — which is to reduce the number of HTTP requests — becomes void with HTTP/2, reality is we are not there yet. The above articles are proof of that reality. At eBay we did similar research a few months back when prepping the site for HTTPS, and our findings were the same. In this post, I will outline the approach that we have taken towards packaging and the performance benefits of our approach.

&emsp;&emsp;最近讨论很火的话题是web项目的静态资源打包。Graig Silversein和Murphey 对如今前端编程领域资源打包的现状提出了非常好的见解。目前主要的问题是，当迁移到http2的时候，我们对于javascript和css的打包策略(目前认为是最佳实践)是否应该改变?  打包的目的是为了减少HTTP的请求数量，虽然理论上说我们对于迁移HTTP/2的性能一无所知，但是之前的文章就是对那种情况的有力证明。
我们对eBay网迁移HTTPS做了几个月的类似研究之后得到的结论是一致的。在这篇文章中，我们将列出我们已经尝试过对打包实践和这些实践方法对于性能的好处。

The majority of eBay pages followed a naïve pattern for bundling resources. All the CSS and JavaScript for a page were bundled into once resource each, with the CSS included in the head tag and JS at the bottom. Though it was good in terms of reducing the number of HTTP requests, there were still opportunities to improve  — the main one being a better use of browser caching. As users navigate through eBay pages, every unvisited page needs to download the whole JS & CSS, which includes the same core libraries (jQuery etc.) used in previous pages. With our plan towards moving to HTTPS (& HTTP/2), we knew this coarse-grained packaging would not be effective. Our study, and others’ studies, also indicated that avoiding bundling altogether and loading resources individually would still not be effective in terms of performance. We needed a balance, and that’s when we came up with our own packaging solution.

&emsp;&emsp;大量的eBay页面使用了很简单的打包策略。页面所有的CSS和Javascript分别打包，然后在head标签里包含CSS，在页面的底部包含JS。尽管这对于减少HTTP请求数量已经大有帮助，但仍然有优化空间，主要一点是最通用的部分实现浏览器缓存。
当我们浏览网页时，每一个未被访问的页面都需要重新下载整个JS和CSS，包括相同的核心库如jQuery等。目前我们正在做迁移HTTPS（&HTTP/2）的计划，我们知道这种粗糙的打包策略并不高效。我们的研究，还有其它团队的研究都表示避免将所有的资源打包到一起并单独加载资源对性能来说依然不友好。但是我们需要做一个平衡，这时就该提提我们自己的打包策略解决方案了。

Inception 
Our first step was to identify the core JS and CSS libraries used across all eBay pages and to aggregate them as one resource. To do this, we created an internal Node.js module called Inception. This module includes all the common JS and CSS modules and will be added as a dependent by each domain team (owners of the various eBay pages). The identified core JS libraries were jQuery, marko (templating engine), marko-widgets (UI component abstraction), and in-house analytics and tracking libraries. For CSS, we have our own library called Skin, from which we picked the core, button, icons, dialog, and form modules. The package bundler we use at eBay is Lasso. The Inception module, which plugs in along with Lasso, provides the following functionalities:

#####Inception
&emsp;&emsp;最开始我们分析出整个eBay项目都在使用的核心JS和CSS库，并分别将他们整合成一个静态资源（JS和CSS并没有混合在一起)。为了完成这个任务，我们创建了一个内部的Node.js模块Inception。这个模块包含了所有的核心JS和CSS资源，将会以依赖的形式被各个独立域名的团队使用。确定的核心JS包括jQuery，marko（模版引擎），marko-widgets(抽离出的UI组建），in-house分析，错误跟踪模块等。对于CSS，我们拥有自主设计等Skin库，我们从其中提取出核心，按钮，图标，对话框，表单等。我们的打包工具叫Lasso，而Inception，作为Lasso的一个依赖包，提供以下功能：

Enforces all domains (buying, selling, browse, checkout, etc.) to follow the exact version of the core JS and CSS libraries. Non-compliance will result in build failures.
Bundles the inception resources as one URL with the same URL address across all domains. E.g. inception-hashcode.js and inception-hashcode.css.
Enables domain teams to still include any of the Inception JS/CSS libraries as a part of their own module dependencies. The Lasso optimizer will de-dupe libraries and ensure only one copy is sent to the browser. This functionality is critical for two reasons . First, we want to promote module-level encapsulation, so that when domain teams are building modules they are free to add a dependency on a core library (say skin-button) without worrying about duplication. This also makes the module work standalone. Secondly, domain teams should not bear the overhead of tracking what is or isn’t present in Inception. They should be able to include any dependency they want, and the tooling can take care of the optimization.
- 强制所有的团队必须使用完全一致的核心JS和CSS库。不符合要求的将会导致编译失败。
- 打包之后的核心资源必须使用相同的URL。例如inception-hashcode.js和inception-hashcode.css
- 允许各个团队使用已经包含在Inception JS/CSS的模块作为它们自身的依赖。Lasso 优化器能够分析库文件,去重，确保模块只有一份被送到浏览器。这个功能是非常重要的。第一，我们想要提升到模块级别到封装，各个团队在建立模块时能够随意给它们添加核心包的依赖而不用考虑重复。同时这也使得模块独立工作。第二，各个团队在开发时也不用再担心核心库中是否有他们添加的依赖。他们可以自由的添加任何依赖，工具可以帮助他们做优化工作。

Now with Inception in place, we started seeing these benefits:
Browser caching: One of the drawbacks mentioned earlier — bundling all resources as one URL — is poor leverage of browser caching. Inception fixes this drawback. Since the same URL is used across all domains for the core JS and CSS libraries (which BTW is the majority of the payload), browser caching is heavily utilized as users navigate through various eBay experiences. This caching is a massive improvement in terms of performance, especially for slow connections. In addition, with newer browser versions supporting code caching, we might also avoid the parse and compile times for the big Inception JS bundle.
Library consistency: Another problem that we saw in our previous bundling system was lack of consistency in core library versions used across domains. Since domains were maintaining the core libraries, users navigating from one domain to another might, for instance, get different versions of jQuery or button styles. The result is not only UI inconsistency but also implementation inconsistency across domains. This issue is also fixed with Inception, as it is a central place to manage core libraries.
Path to Progressive Web Apps: With all domain pages having the same core library dependencies, transition between them becomes easy. Since only the application-specific JS and CSS has to be downloaded on each navigation. This will enable us to build our web apps using an Application Shell Architecture, thus paving the way to making eBay a Progressive Web App. We have already explored a similar route in the past (within a domain) using the Structured Page Fragments approach, and we have seen our perceived performance increase immensely.
Easy upgrade path: Finally, Inception also enables us to upgrade to newer versions of core libraries from a central place. Inception itself follows semantic versioning, so all domain teams depending on Inception will get the updates uniformly in a semantic manner. Upgrades were problematic previously, as we had to chase individual teams to do the upgrades manually.

现在有了Inception,我们来看看这样做的好处：
- 浏览器缓存：正如之前提到的，将所有资源打包成一个资源的缺点是：浏览器缓存命中率低。Inception修复了这个问题。因为所有域名项目都使用同样的URL来获取核心JS和CSS，浏览器缓存随着用户各种不同的浏览请求得到了极大的优化。从性能的角度来说，尤其在低网速链接上，缓存对于性能起到极大的改善。另外，随着新的浏览器支持代码缓存，我们会尽量考虑避免Inception对大的JS包进行打包和压缩。
- 核心库统一：在我们之前的打包系统中存在的另一个问题是：核心库缺乏一致性。因为所有的域名都使用自己的核心库，用户从一个页面到另一个页面时，举个例子，可能会得到不同版本到jQuery或按钮样式。 这不仅是UI的不一致，更是不同域名下的实现不一致。这个问题通过Inception也得到了解决。
- app项目路径一致：因为所有域名页面都使用统一的核心库依赖，项目的过渡也变得很简单。因为只有项目特有的JS和CSS需要被下载。这使得我们可以使用Appcation Shell Architecture 来编译app，来让我们的app变得更加优秀。我们之前已经讨论过一个使用 Structured Page Fragment的类似方法，并且已经预见到性能的极大提升。
- 方便路径更新：最后，Inception允许我们在一个中心位置将核心库更新的新的版本。Inception自身遵循语意版本管理，所有依赖Incetpion的团队都会统一得到更新。之前我们必须手工通知各个团队更新核心库，问题多发。


Domains
Now with the core libraries being taken care of through Inception, what about the remaining resources in a page — i.e., application/domain-specific CSS and JS? For each domain we again came up with a packaging approach where we split the resources into two buckets: constants and variables

Constants: The CSS and JS resources that remain the same on every request are bucketed as constants. These mainly pertain to the key UI components in each domain, which remain unaltered to various request parameters. The constant modules are bundled as one resource, and they again benefit from browser caching. When a user revisits a page, this bundle usually hits the browser cache and gets a performance advantage.
Variables: A small portion of the resources in each page vary based on request attributes. These variations might be due to experimentation, user sign-in status, business logic, etc. Such resources are bucketed as variables and have their own bundling, which happens at runtime. They will have the least cache-hit ratio and probably will need to be downloaded over the network for a new session.
To summarize every page will have six resource bundles (3 for CSS and 3 for JS), and each bundle will have its own purpose. All URLs are hashed based on content; thus cache busting is automatically taken care of.

Inception — bundles the core CSS and JS libraries. Highest in payload.
Constants — bundles the unchanging application CSS and JS. Mediacore in payload.
Variables — bundles the varying CSS and JS in an application. Least in payload.
In the current state, this packaging strategy seems to be the best fit for us in terms of performance. It has created the right balance between number of HTTP requests and browser caching. As we start migrating towards HTTP/2 next year, we will further evaluate this approach and try to come up with more fine-grained bundling solutions, and of course with performance being the key.
#####Domains
Inception帮助我们管理着核心库，那项目页面独有的资源该如何处理？例如，项目独有域名下的CSS和JS？ 对于各个独立域名自身，我们采用将变量和常量分离的一种打包策略。
常量： 

