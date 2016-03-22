##[Introduction to Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/?redirect_from_locale=zh)
Matt Gaunt

Rich offline experiences, periodic background syncs, push notifications— functionality that would normally require a native application—are coming to the web. Service workers provide the technical foundation that all these features will rely on.

丰富的线下体验，周期性的后台同步，推送消息-这些功能通常都只有在native 程序中见到，现在在web端也能够实现了。

Service Worker 为这些功能特性提供了实现的基础。

###What is a Service Worker?

&nbsp;&emsp;A service worker is a script that is run by your browser in the background, separate from a web page, opening the door to features which don't need a web page or user interaction. Today, they already include features like push notifications and in the future it will include other things like, background sync, or geofencing. The core feature discussed in this tutorial is the ability to intercept and handle network requests, including programmatically managing a cache of responses.

The reason this is such an exciting API is that it allows you to support offline experiences, giving developers complete control over what exactly that experience is.

Before service worker there was one other API that would give users an offline experience on the web called App Cache. The major issue with App Cache is the number of gotcha's that exist as well as the design working particularly well for single page web apps, but not for multi-page sites. Service workers have been designed to avoid these common pain points.

&emsp;&emsp;service workder 是运行在浏览器后台，区别于网页，不需要网页和用户交互的javascript 脚本。如今，它已经包含了如： 推送消息，将来还会包括如后台同步，地理防护等功能。在这篇文章中讨论的核心功能拥有拦截并处理网络请求，包括通过程序来管理响应的缓存。

为什么说这是一个功能强大的api，因为它支持线下用户体验，给开发者完全的控制权。

Things to note about a service worker:

- It's a JavaScript Worker, so it can't access the DOM directly. Instead, a service worker can communicate with the pages it controls by responding to messages sent via the postMessage interface, and those pages can manipulate the DOM if needed.
- Service worker is a programmable network proxy, allowing you to control how network requests from your page are handled.
- It will be terminated when not in use, and restarted when it's next needed, so you cannot rely on global state within a service worker's onfetch and onmessage handlers. If there is information that you need to persist and reuse across restarts, service workers do have access to the IndexedDB API.
- Service workers make extensive use of promises, so if you're new to promises, then you should stop reading this and check out Jake Archibald's article.

我们需要了解的知识点： 

- 它是一个[Javascript Worker](http://www.html5rocks.com/tutorials/workers/basics/), 所以我们无法使用它来直接操控DOM元素。取而代之，它可以通过使用[postMessage 接口](https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage)来对消息做响应，这样页面就可以通过这些响应信息对DOM做相应的操作。
- Service Worker是一个可编程的网络代理，它可以让你控制如何处理页面的网络请求。
- 它在不需要的时候会自动终止，在需要的时候将自动重启，所以不可以使用它来完成全局的onfetch, onmessage处理函数。如果你想通过它来保持一些持久化的数据，你可以使用IndexedDB API来完成。 
- Service Worker 大量使用Promise，所以如果你对Promise 不熟悉， 建议先阅读这篇文章 [Jake Archibald's Article](http://www.html5rocks.com/tutorials/es6/promises/)


###Service Worker Lifecycle

A service worker has a lifecycle which is completely separate from your web page.

To install a service worker for your site, you need to register it, which you do in your page's JavaScript. Registering a service worker will cause the browser to start the service worker install step in the background.

Typically during the install step, you'll want to cache some static assets. If all the files are cached successfully, then the service worker becomes installed. If any of the files fail to download and cache, then the install step will fail and the service worker won't activate (i.e. won't be installed). If that happens, don't worry, it'll try again next time. But that means if it does install, you know you've got those static assets in the cache.

When we're installed, the activation step will follow and this is a great opportunity for handling any management of old caches, which we'll cover during the service worker update section.

After the activation step, the service worker will control all pages that fall under its scope, though the page that registered the service worker for the first time won't be controlled until it's loaded again. Once a service worker is in control, it will be in one of two states: either the service worker will be terminated to save memory, or it will handle fetch and message events which occur when a network request or message is made from your page.

Below is an overly simplified version of the service worker lifecycle on it's first installation.

Service Worker 生命周期是于页面完全分离的。

想要在网页上安装使用Service Worker，首先需要使用javascript在网页上注册。注册一个Service Worker 需要在使用浏览器在后台开启注册步骤。

在安装步骤典型的操作是缓存一些静态的资源。 如果你的静态资源都能够正常的被缓存，Service Worker安装成功。 如果任何一个文件被缓存失败，那么Service Worker安装步骤将会失败，且不会被激活。如果发生这种情况，不用担心，它将会在下次在此安装。当然，如果Service Worker正常被安装，你就可以在缓存中获取你想要的缓存文件。

如果Service Worker正常安装，激活步骤将是处理旧缓存的重要机会，稍后我会在Service Worker更新模块做详细讲解。

激活状态完成之后，Service Worker将会控制在其作用域下的所有页面。然而，注册Service Worker的页面在第一次加载时不会被控制，所以需要重新加载一遍。一旦Service Worker接管页面，它将会只有两种状态：Service Worker为了节省内存，处于终止状态或者它会处理发送到页面的所有网络请求或者消息。

下面是关于Service Worker第一次安装的简单版生命周期。
![abc](http://www.html5rocks.com/en/tutorials/service-worker/introduction/images/sw-lifecycle.png)

###Before We Start

Grab the caches polyfill from this repository https://github.com/coonsta/cache-polyfill.

This polyfill will add support for Cache.addAll which Chrome M43's implementation of the Cache API doesn't currently support.

Grab dist/serviceworker-cache-polyfill.js to put somewhere in your site and use it in a service worker with the importScripts method. Any script which is imported will automatically be cached by the service worker.

```
importScripts('serviceworker-cache-polyfill.js');
```

在开始使用之前，我们需要下载这个[Polyfill](https://github.com/coonsta/cache-polyfill), 它能够解决Chrome43 无法实现Cache.All方法的问题。

将```dist/serviceworker-cache-polyfill.js```添加到网站的某个地方，然后使用`importScripts`方法将该文件加载进来。任何被导入的文件将会被Service Worker默认缓存起来。


###HTTPS is Needed

During development you'll be able to use service worker through localhost, but to deploy it on a site you'll need to have HTTPS setup on your server.

Using service worker you can hijack connections, fabricate, and filter responses. Powerful stuff. While you would use these powers for good, a man-in-the-middle might not. To avoid this, you can only register for service workers on pages served over HTTPS, so we know the service worker the browser receives hasn't been tampered with during its journey through the network.

Github Pages are served over HTTPS, so they're a great place to host demos.

If you want to add HTTPS to your server then you'll need to get a TLS certificate and set it up for your server. This varies depending on your setup, so check your server's documentation and be sure to check out Mozilla's SSL config generator for best practices.

在开发阶段，你可以通过localhost使用Service Worker,但是线上部署时必须配置使用HTTPS。

使用Service Worker，你可以劫持请求链接，伪造和过滤返回。你可以使用它强大的功能来做任何好的，或者坏事。为避免坏事发生，要求你必须在使用Https的情况下才允许注册Service Worker，这样我们就知道浏览器的Service Worker没有被篡改。

Github 页面就是通过HTTPS来提供服务的，所以可以用它来做测试。 

如果你相在你的个人网站上使用HTTPS， 那么你需要获取一个TLS证书，并安装到你的服务器上。具体安装步骤这里就不再详细说明， 参考: [Mozilla's SSL config generator](https://mozilla.github.io/server-side-tls/ssl-config-generator/)


###Using Service Worker

Now that we've got the Polyfill and covered HTTPS, let's look at what we do in each step.

现在我们下载了Polyfill，并且安装好HTTPS，下面我们来详细讲解如何使用Service Worker。

### How to Register and Install a Service Worker

To install a service worker you need to kick start the process by registering a service worker in your page. This tells the browser where your service worker JavaScript file lives.

安装Service Worker时，首先你需要在页面上注册，这可以告知浏览器你的Service Worker归属于哪个页面。


```
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}
```

This code checks to see if the service worker API is available, and if it is, the service worker at /sw.js is registered.

You can call register every time a page loads without concern; the browser will figure out if the service worker is already registered or not and handle it accordingly.

这段代码首先检查 Service Worker API是否可用，如果可用，在安装`/sw.js`Service Worker脚本。

你可以在每次页面加载的时候调用注册操作；浏览器会根据该Service Worker的实际状态来做相应的处理操作。 


One subtlety with the register method is the location of the service worker file. You'll notice in this case that the service worker file is at the root of the domain. This means that the service worker's scope will be the entire origin. In other words, this service worker will receive fetch events for everything on this domain. If we register the service worker file at /example/sw.js, then the service worker would only see fetch events for pages whose URL starts with /example/ (i.e. /example/page1/, /example/page2/).

Now you can check that a service worker is enabled by going to chrome://inspect/#service-workers and looking for your site.


需要注意的一点是Service Worker文件的位置。在这个例子中， Service Worker文件在项目的根目录。这也意味着这个Service Worker的作用域是整个域名。换句话说，这个Service Worker将会处理该域名下所有fetch事件。如果我们使用```/example/sw.js```文件注册，那么Service Worker将只能处理URL在`/example/`下的页面的事件。

现在你可以通过`chrome://inspect/#service-workers`来查看Service Worker状态。
![abc](http://www.html5rocks.com/en/tutorials/service-worker/introduction/images/sw-chrome-inspect.png)

When service worker was first being implemented you could also view your service worker details through chrome://serviceworker-internals. This may still be useful, if for nothing more than learning about the life cycle of service workers, but don't be surprised if it gets replaced by chrome://inspect/#service-workers at a later date.

You may find it useful to test your service worker in an Incognito window so that you can close and reopen knowing that the previous service worker won't affect the new window. Any registrations and caches created from within an Incognito window will be cleared out once that window is closed.

当Service Worker第一次被安装，你可以通过```chrome://serviceworker-internals```来查看详细信息，它可以让你完整的了解Service Worker的整个生命周期。

### Service Worker Install Step

After a controlled page kicks off the registration process, let's shift to the point of view of the service worker script, which is given the opportunity to handle the install event.

For the most basic example, you need to define a callback for the install event and decide which files you want to cache.

当一个被控制的页面开启了注册流程，我们就去看看Service Worker脚本，它可以让我们处理install事件。

最基本的例子，你需要定义一个callback函数，并在该函数中决定哪些文件该被缓存。

```
// The files we want to cache
var urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

// Set the callback for the install step
self.addEventListener('install', function(event) {
    // Perform install steps
});
```

Inside of our install callback, we need to take the following steps:

1. Open a cache
2. Cache our files
3. Confirm whether all the required assets are cached or not

在安装事件的callback函数中，我们需要采取以下步骤： 

1. 开启缓存
2. 缓存文件
3. 确定是否所有被请求的资源都被缓存

```
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
```
Here you can see we call caches.open with our desired cache name, after this we call cache.addAll and pass in our array of files. This is a chain of promises (caches.open and cache.addAll). event.waitUntil takes a promise and uses it to know how long installation takes, and whether it succeeded.

If all the files are successfully cached, then the service worker will be installed. If any of the files fail to download, then the install step will fail. This allows you to rely on having all the assets that you defined, but does mean you need to be careful with the list of files you decide to cache in the install step. Defining a long list of files will increase the chance that one file may fail to cache, leading to your service worker not getting installed.

This is just one example, you can perform other tasks in the install event or avoid setting an install event listener altogether.

我们调用```caches.open```来开启指定名称的缓存，在这之后，我们调用```cache.addAll```并传递数组文件。它们都是链式的Promise

### How to Cache and Return Requests

Now that you've installed a service worker, you probably want to return one of your cached responses right?

After a service worker is installed and the user navigates to a different page or refreshes, the service worker will begin to receive fetch events, an example of which is below.

安装完Service Worker之后， 你可能希望能返回被缓存的response。

首先，用户需要访问另一个网站，或者刷新该页面，Service Worker菜户开始接受fetch事件，看下面的例子： 

```
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request);
      }
    )
  );
});
```
Here we've defined our fetch event and within the event.respondWith, we pass in a promise from caches.match. caches.match will look at the request and find any cached results from any of the caches your service worker created.

If we have a matching response, we return the cached value, otherwise we return the result of a call to fetch, which will make a network request and return the data if anything can be retrieved from the network. This is a simple example and uses any cached assets we cached during the install step.

If we wanted to cache new requests cumulatively, we can do so by handling the response of the fetch request and then adding it to the cache, like below.

我们在`event.responseWith`中定义fetch事件, `cache.match`将会通过request来匹配使用Service Worker缓存的结果，然后返回一个promise。

如果有匹配结果，返回该值，否则我们就创建一个网络请求，返回请求的结果。 这是缓存内容的简单例子。 

如果我们想累计的缓存新的请求内容，我们可以在处理请求的时候将网络获取的内容放入缓存中。


```
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
```
What we are doing is this:

1. Add a callback to .then on the fetch request
2. Once we get a response, we perform the following checks:
	1. Ensure the response is valid.
	2. Check the status is 200 on the response.
	3. Make sure the response type is basic, which indicates that it's a request from our origin. This means that requests to third party assets aren't cached as well.
3. If we pass the checks, we clone the response. The reason for this is that because the response is a Stream, the body can only be consumed once. Since we want to return the response for the browser to use, as well as pass it to the cache to use, we need to clone it so we can send one to the browser and one to the cache.

我们做的事情： 

1. 在fetch请求的```.then```方法上添加一个回调函数。
2. 取到内容之后，我们做下面的事情：
	1. 确认response的内容是有效的；
	2. 确认返回状态码味200
	3. 	确保返回内容是基本的数据类型，也就是说，请求必须是同域。否则请求的第三方资源不会被缓存。
3. 如果通过检查，我们会将response缓存。原因是因为response是一个response是一个Stream，body的内容只能被消耗一次。 一方面我们想将内容返回到页面， 另一方面需要将内容放倒缓存中，所以需要将内容克隆，。

### How to Update a Service Worker

There will be a point in time where your service worker will need updating. When that time comes, you'll need to follow these steps:

1. Update your service worker JavaScript file.
	1. When the user navigates to your site, the browser tries to redownload the script file that defined the service worker in the background. If there is even a byte's difference in the service worker file compared to what it currently has, it considers it 'new'.
2. Your new service worker will be started and the install event will be fired.
3. At this point the old service worker is still controlling the current pages so the new service worker will enter a "waiting" state.
4. When the currently open pages of your site are closed, the old service worker will be killed and the new service worker will take control.
5. Once your new service worker takes control, its activate event will be fired.

你的Service Worker肯定是需要更新的。当遇到这种问题时，你需要遵循下面的步骤： 

1. 更新Service WorkerJS文件
	1. 当用户访问你的页面时，浏览器会在后台尝试去重新下载定义Service Worker的脚本文件。只要比较之后，即使有1字节的改动， 浏览器都会认为这是两个不同的文件。
2. 新的Service Worker将会被启动，install 事件将会被触发。
3. 这个时候“旧”的Service Worker仍然在运行状态，新的Service Worker进入“等待”阶段。
4. 当当前页面被关闭时，“旧”的Service Worker将会终止，新的Service Worker将接管页面。
5. 当新的Service Worker接管页面时，activate事件将会被触发。

One common task that will occur in the activate callback is cache management. The reason you'll want to do this in the activate callback is because if you were to wipe out any old caches in the install step, any old service worker, which keeps control of all the current pages, will suddenly stop being able to serve files from that cache.

Let's say we have one cache called 'my-site-cache-v1', and we find that we want to split this out into one cache for pages and one cache for blog posts. This means in the install step we'd create two caches, 'pages-cache-v1' and 'blog-posts-cache-v1' and in the activate step we'd want to delete our older 'my-site-cache-v1'.

The following code would do this by looping through all of the caches in the service worker and deleting any caches which aren't defined in the cache whitelist.

通常在activate回调函数中需要做的工作是缓存管理。之所以需要在activate回调函数中做的原因是如果你在install阶就将旧的缓存清除掉，老的Service Worker则会突然无法从缓存中获取文件。

比如我们有一个缓存"my-site-cache-v1",现在我们希望能将这整个cache拆分两个，一个缓存页面，一个缓存博文。也就是说我们需要在install步骤创建2个缓存，“page-cache-v1”和“blog-posts-cache-v1”，然后在activate阶段删除掉老的缓存"my-site-cache-v1".

下面的代码通过轮询所有的缓存资源，删除不在“whitelist”的缓存。
```
self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

###Rough Edges & Gotchas

This stuff is really new. Here's a collection of issues that get in the way. Hopefully this section can be deleted soon, but for now these are worth being mindful of.

需要注意的“坑”

####If Installation Fails, We're Not so Good at Telling You About It

If a worker registers, but then doesn't appear in chrome://inspect/#service-workers or chrome://serviceworker-internals, it's likely its failed to install due to an error being thrown, or a rejected promise being passed to event.waitUntil.

To work around this, go to chrome://serviceworker-internals and check "Opens the DevTools window for service worker on start for debugging", and put a debugger; statement at the start of your install event. This, along with " Pause on uncaught exceptions", should reveal the issue.

在注册一个Service Worke后，并没有出现在```chrome://inspect/#service-workers```或者```chrome://serviceworker-internals```中，可能是因为在安装时报错，或者是在传递给```event.waitUntil```过程中被拒绝。

为了解决这个问题，请求```chrome://serviceworker-internals```,打开“Opens the DevTools window for service worker on start for debugging”，然后加入断点，同时勾选“Pause on uncaught exceptions”，它能够在未捕获的异常处被暂停。

#### The Defaults of fetch()

##### No Credentials by Default

When you use fetch, by default, requests won't contain credentials such as cookies. If you want credentials, instead call:

当你使用fetch时，cookies中默认不包含证书的，如果你相使用证书，需要：

```
fetch(url, {
  credentials: 'include'
})
```

This behaviour is on purpose, and is arguably better than XHR's more complex default of sending credentials if the URL is same-origin, but omiting them otherwise. Fetch's behaviour is more like other CORS requests, such as <img crossorigin>, which never sends cookies unless you opt-in with <img crossorigin="use-credentials">.

这种行为在目的性上更加优越于XHR，XHR默认会在URL同源的情况下发送证书，而它不是。fetch行为更像是CORS请求，如```<img crossorigin>```, 除非你使用```<img crossorigin="use-credentials">```指定在cookie中添加，否则不会发送。 


##### Non-CORS Fail by Default

By default, fetching a resource from a third party URL will fail if it doesn't support CORS. You can add a non-CORS option to the Request to overcome this, although this will cause an 'opaque' response, which means you won't be able to tell if the response was successful or not.

默认的，从第三方的URL请求资源将会导致失败，因为它不支持CORS。现在你可以通过添加non-CORS选项来克服这个问题，这将会导致非常怪异的问题，让你无法确定请求是成功还是失败。

```
cache.addAll(urlsToPrefetch.map(function(urlToPrefetch) {
  return new Request(urlToPrefetch, { mode: 'no-cors' });
})).then(function() {
  console.log('All resources have been fetched and cached.');
});
```

#### Handling Responsive Images

The srcset attribute or the <picture> element will select the most appropriate image asset at run time and make a network request.

For service worker, if you wanted to cache an image during the install step, you have a few options:

1. Install all the images <picture> element and srcset attribute will request
2. Install a single low-res version of the image
3. Install a single high-res version of the image

Realistically you should be picking option 2 or 3 since downloading all of the images would be a waste of memory.

Let's assume you go for the low res version at install time and you want to try and retrieve higher res images from the network when the page is loaded, but if the high res images fail, fallback to the low res version. This is fine and dandy to do but there is one problem.

*srcset*属性或者<picture>元素会选择最为合适的图片资源，并发送网络请求。

对于Service Worker，如果你想要在安装阶段缓存图片，需要做： 

1. 安装所有<picture>和srcset请求的图片资源
2. 安装low-res版本的图片
3. 安装hight-res版本的图片



If we have the following two images:

|Screen Density	|Width	|Height|
|---|---|---|
|1x|	400	|400|
|2x|	800	|800|

In a srcset image, we'd have some markup like this:

```
<img src="image-src.png" srcset="image-src.png 1x, image-2x.png 2x" />
```

If we are on a 2x display, then the browser will opt to download image-2x.png, if we are offline you could .catch this request and return image-src.png instead if it's cached, however the browser will expect an image which takes into account the extra pixels on a 2x screen, so the image will appear as 200x200 CSS pixels instead of 400x400 CSS pixels. The only way around this is to set a fixed height and width on the image.

如果在2x的像素屏幕上展示，浏览器将会选择下载image-2x.png,如果是在离线环境中，你可能会在缓存中找到image-src.png。然而浏览器期待的是能够在2x分辨率屏幕上显示的图片。所以目前唯一的解决方法是给图片设置宽度和高度。

```
<img src="image-src.png" srcset="image-src.png 1x, image-2x.png 2x"
style="width:400px; height: 400px;" />
```

For <picture> elements being used for art direction, this becomes considerably more difficult and will depend heavily on how your images are created and used, but you may be able to use a similar approach to srcset.


