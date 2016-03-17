##[That's so fetch!](https://jakearchibald.com/2015/thats-so-fetch/)

Posted 24 March 2015

There's been some confusion around the new [fetch API](https://fetch.spec.whatwg.org/#fetch-api) recently. Let's clear things up.

The first thing you'll notice about fetch is it's a massive improvement on XMLHttpRequest in terms of API design. Here's how to get some JSON using XHR:

最近关于新的Fetch API还有些让人疑惑的地方。让我们一起来理清思路。

首先你需要清楚的是fetch api是XMLHttpRequest在API设计上的巨大进步。
原来我们通过XHR获取JSON内容的方式是这样的：

```
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.responseType = 'json';

xhr.onload = function() {
  console.log(xhr.response);
};

xhr.onerror = function() {
  console.log("Booo");
};

xhr.send();
```
Now mop up that vomit and take a look at how fetch does the same thing:

现在丢掉这些复杂的逻辑来看看fetch是如何做同样的事情的:

```
fetch(url).then(function(response) {
  return response.json();
}).then(function(data) {
  console.log(data);
}).catch(function() {
  console.log("Booo");
});
```
Mix in some ES6 arrow functions and it gets even more compact:

引入ES6的箭头函数，代码看起来更加简洁：

```
fetch(url).then(r => r.json())
  .then(data => console.log(data))
  .catch(e => console.log("Booo"))
```
And with ES7 async functions it can be structured like sync code, whilst still being async:

使用ES7的async函数可以让代码从结构上看起来更像是同步：

```
(async() => {
  try {
    var response = await fetch(url);
    var data = await response.json();
    console.log(data);
  } catch (e) {
    console.log("Booo")
  }
})();
```
Unfortunately, not everyone was throwing "SHUT UP AND TAKE MY MONEY" memes at it. One particular high-profile JavaScript community member was unconvinced…

They thought we shouldn't be adding high level features to the platform, especially as we're in dire need of lower level primitives when it comes to requests and responses.

To that I say, well, actually, that's soooo fetch, and we are going to make fetch happen. Let's clear up the misconceptions…

不幸的是：并不是所有人都“买帐”。一些Javascript组织对此并不十分信服。

他们认为我们不应该将如此高级的特性添加到平台上，尤其是当我们需要requests和response这些原始的内容时。

不过我还是要说，推荐使用fetch。现在就让我们解开那些误解。

####Don't be fooled by the nice API
A nice, compact API can be a sign of "high level", and therefore restrictive. But that isn't the case here. XHR is so bad, a lower-level and more featureful API can be also simpler and easier to use.

XHR is now defined in terms of fetch (see the calls to [fetch in XHR's .send()](https://xhr.spec.whatwg.org/#the-send%28%29-method), meaning fetch is lower level than XHR.

好用，简洁的API通常被认为是“高级的”，同时会收到限制。但在这里并不是这样。XHR是不友好的，“底层的”，且具有多重功能特性的API被认为是更加简单且便于使用。

XHR现在在内部调用fetch，具体参考：[fetch in XHR's .send()](https://xhr.spec.whatwg.org/#the-send%28%29-method)，这也意味着fetch更加底层。

####Fetch isn't done yet
What exists in Chrome today doesn't cover the full spec, and the spec doesn't cover all of the planned features. In some cases this is because they haven't been designed yet, in others it's because they're dependent on other in-progress specs. Basically, we're following this pattern:

到目前为止，chrome也没有实现所有的标准，标准中也并不是包含所有的特性功能。一方面因为他们还没有被实现，另外他们也依赖于其他正在被实现的标准。基本上，我们可以按照下面的思路来理解： 

![Developing iteratively so the user starts with a skateboard, scooter, bike, motorbike then car, as opposed to giving them nothing until you give them the whole car.](https://jakearchibald.com/static/posts/thats-so-fetch/mvp.c81252635e14.png)

Bit of a rant: it bothers me that as developers, we preach iterative development and release, but when we're the customers of that approach the reaction is all too often "HOW DARE YOU PRESENT ME WITH SUCH INCOMPLETE IMPERFECTION".

The alternative would have been to sit on the feature for months (or years?) instead of getting large parts of it into developers' hands today. Iterative release also means we've been able to get feedback from real-world usage, and that steers future iterations in terms of design and priority.

Anyway, let's take a look at what fetch can do that XHR cannot:

抱怨：作为开发人员，我们需要宣传我们迭代的产品，作为开发人员，我们的反应通常是：“你怎么敢将这些还没有完全实现的功能展示出来”。
难道我们就等着所有的特性都出来才开始工作么？ 迭代的发布新特性也是因为我们需要在开发中的到现实使用的反馈，引领新的迭代。

无论如何，我们先来看看fetch相比于XHR的优势是：

###Request/Response primitives
XHR kinda smushes the request and response together, meaning they can't be used separately. Fetch is different thanks to the Request and Response constructors. This is particularly useful within a ServiceWorker:

XHR将request和response结合在一块，他们无法被分开使用。但是Fetch却不同，它有Request和Response的构造函数。这在ServiceWorker上很有用：

```
self.addEventListener('fetch', function(event) {
  if (event.request.url === new URL('/', location).href) {
    event.respondWith(
      new Response("<h1>Hello!</h1>", {
        headers: {'Content-Type': 'text/html'}
      })
    )
  }
});
```

In the above, event.request is a Request. There's no response yet, and instead of letting the browser go to the network I respond with my own Response. Alternatively, I could get the response from the network using fetch(event.request), or even get a response from the cache.

The [Cache API ](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/#cache-objects)is a store of Responses keyed against Requests, having separates allows you to add your own pairings.

This is in Chrome stable today from within a ServiceWorker. The fetch API is also available from pages in Chrome Beta.

Soon, request.context will be able to tell you the source of that request, so you can tell apart requests triggered by hyperlinks vs <img> etc.

上面，event.request 就是一个Request。但是没有Response。为了不让浏览器去访问网络，我自己实现了一个Response。或者，我可以通过`fetch(event.request)`，也可以从缓存中获取一个Response。

[Cache API ](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/#cache-objects)就是通过Request来存储Response的存储，并且可以让你自己添加自定义的键值对。

很快，request.context 会告诉你request的内容，所以你就可以根据Request是链接还是图片去触发不同的事件。


###'no-cors' and opaque responses
If I request //google.com from this site using XHR or plain fetch it will fail. This is because it's a CORS request and the response doesn't have CORS headers.

However, with fetch, you can make a no-cors request:

如果使用XHR或者使用普通的fetch去请求//google.com将会失败，因为CORS跨域问题，response不包含CORS头。

但是，使用fetch发送一个no-cors 的请求：

```
fetch('//google.com', {
  mode: 'no-cors'
}).then(function(response) {
  console.log(response.type); // "opaque"
});
```

This is similar to the request an <img> makes. Of course, you can't read the content of the response as it could contain private information, but it can be consumed by other APIs:

这类似于一个图片请求。因为有私有信息，所以我们无法获取response的内容，但是它可以被其他的API消费：

```
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch('//www.google.co.uk/images/srpr/logo11w.png', {
      mode: 'no-cors'
    })
  )
})
```
The above is fine within a ServiceWorker, as long as the receiver is happy with a no-cors response. <img> is, <img crossorigin> isn't.

You can also store these responses in the Cache API for use later, which is great for CDN content such as scripts, CSS, and imagery, which often lack CORS headers.

For more on the origin of CORS, see Anne VK's article on same-origin policy.

This all works in Chrome stable today. In Chrome Canary, although you can use fetch() from a page, no-cors isn't enabled there yet (ticket).

只要接受方允许跨域，使用ServiceWorker可以正常工作。

你也可以使用Cache API将这些responses保存起来，这对于缺少CORS头的脚本，CSS，图片等非常有用。

这在Chrome稳定版都能正常工作。

###Streams
XHR lacks streaming. You can get access to .responseText while the request is in progress, but the whole response is still going to buffer into memory.

With fetch, you get access to the low-level body stream. Say I wanted to load a massive CSV and find the value in the cell after the one containing "Jake":

XHR缺少“流”。你可以在请求的时候获取`.responseText`的内容，但是整个response的内容依然会不断的进入到内存中。

使用fetch，你可以访问到更低级到body流。

下面我想加载一个巨大的CVS文件，并且找到包含“Jake”的下一个内容。

```
fetch('/big-data.csv').then(function(response) {
  var reader = response.body.getReader();
  var partialCell = '';
  var returnNextCell = false;
  var returnCellAfter = "Jake";
  var decoder = new TextDecoder();

  function search() {
    return reader.read().then(function(result) {
      partialCell += decoder.decode(result.value || new Uint8Array, {
        stream: !result.done
      });

      // Split what we have into CSV 'cells'
      var cellBoundry = /(?:,|\r\n)/;
      var completeCells = partialCell.split(cellBoundry);

      if (!result.done) {
        // Last cell is likely incomplete
        // Keep hold of it for next time
        partialCell = completeCells[completeCells.length - 1];
        // Remove it from our complete cells
        completeCells = completeCells.slice(0, -1);
      }

      for (var cell of completeCells) {
        cell = cell.trim();

        if (returnNextCell) {
          reader.cancel("No more reading needed.");
          return cell;
        }
        if (cell === returnCellAfter) {
          returnNextCell = true;
        }
      }

      if (result.done) {
        throw Error("Could not find value after " + returnCellAfter);
      }

      return search();
    })
  }

  return search();
}).then(function(result) {
  console.log("Got the result! It's '" + result + "'");
}).catch(function(err) {
  console.log(err.message);
});
```
Here I'm reading through the CSV (yes, I know my regex is naive), but with only a chunk of content in memory at a given time. Once I find the value I'm looking for, I cancel the stream, closing the connection.

response.body is a ReadableStream as defined by the streams spec. Streaming was planned from the outset, but it's one of the bits we launched without as the spec was still in progress.

TextDecoder is part of the encoding spec. If the chunk it receives via .decode(input, {stream: true}) ends with a partial multi-byte character, it will return and flush everything but that partial. The next call to decode appends onto the partial, hopefully forming a whole character.

这里我一次读取一部分CSV内容到内存中。一旦我找到我想要的内容，便立即终止流，关闭连接。

`response.body`是一个 ReadableStream. “流”这部分依然在开发中。

TextDecoder 是编码规范的一部分。通过`.decode(input, {stream: true})` 收到的一段内容如果是以一个多字节部分结束，那么将会保留这部分，在下次解码的时候，将内容接在这部分后面，以形成一个完整的内容。

This stuff is starting to land in Canary, here's a demo of the above, and here's a demo with a larger dataset (warning: running the demo may download many megabytes).

Streams are one of the things I'm really looking forward to having on the platform. I want to be able to stream-parse some JSON, generate some HTML as a result, and stream that to the browser's parser. JS-driven apps lack an easy way to get progressive-rendering from a single data source, streams can solve that.

Transform streams are coming soon, which would make the code above simpler. Ideally TextDecoder would be a transform stream, and another transform stream could chunk it into CSV rows. Something like:

“流”是我尤其期待在平台实现的部分。其他它能够解析JSON，生成一个HTML，并且将其传递给浏览器解析。基于JS的app缺乏从一个数据源逐步渲染的能力，“流”能够解决。

转换“流”可以使代码更加简单。事实上，TextDecoder可以看作是一个转换流，另一个转换流能够将其转换为CSV行。像下面这样：

```
fetch('/big-data.csv').then(function(response) {
  var csvStream = response.body
    .pipeThrough(new TextDecoder)
    .pipeThrough(new CSVDecoder);

  csvStream.read().then(function(result) {
    // array of cell values for the first row
    console.log(result.value); 
  });
});
```
Transform streams also become really exciting within a ServiceWorker:

ServiceWorker如果使用转换流也非常棒：

```
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch('video.unknowncodec').then(function(response) {
      var h264Stream = response.body
        .pipeThrough(codecDecoder)
        .pipeThrough(h264Encoder);

      return new Response(h264Stream, {
        headers: {'Content-type': 'video/h264'}
      });
    })
  );
});
```
In the above, I'm using transform streams to take a video the browser doesn't understand, decode it with JS, and encode it in a format the browser does understand. It'd be amazing to see if the browser could do this in real time.

上面，我使用转换流接受浏览器不认识的视频流，使用JS解码，然后将其转换为浏览器可以理解的格式。如果浏览器真的能够支持该功能，那将是一件很神奇的事情。


###Stream readers & cloning
As I mentioned before, we initially shipped fetch without streams support so developers could get the other benefits sooner. To make up for a lack of streams & to subsequently offer a simple way to get common data types, we added some readers:

正如我之前提到的，最初我们是不支持“流”的。为了能读到相同的数据类型，我们提供一些“readers”：


```
fetch(url).then(function(response) {
  return response.json();
});
```

That, as you might expect, reads the whole stream as JSON. Here's the full list of readers:

.arrayBuffer()
.blob()
.formData()
.json()
.text()
They exist on Request objects as well as responses, so you can use them to read (for example) POST data within a ServiceWorker.

These are true stream readers, meaning they drain the stream:

正如你期待的那样，将整个“流”按照JSON格式读入。下面是所有的reader列表：

- `arrayBuffer()`
- `blob()`
- `formData()`
- `json()`
- `text()`

他们同时存在Request和Response中，你也可以使用ServiceWorkder来读取POST数据。  
这些都是真正的“流”消费者，这意味着它们消耗流。


```
fetch(url).then(function(response) {
  return response.json().catch(function() {
    // This does not work:
    return response.text();
  });
});
```
The call to .text() fails as the stream has already been read. You can work around this using .clone():

因为流已经被读取了，再次调用`.text()`会失败。可以使用`.clone()`来完成。

```
fetch(url).then(function(response) {
  return response.clone().json().catch(function() {
    return response.text();
  });
});
```

.clone() opts you into buffering. The clone gets read as JSON, but the original is still there and can be read in another format. Of course, this means the raw response data needs to be kept around in memory until all copies are read or garbage collected.

Alternatively, you could look at the headers of the response:

`.clone()`选择缓冲区。clone操作将流按照JSON格式读入，但是原始的流依然可以被按照其他形式读入。所以，这意味着原始的数据一直在内存中，除非所有copy都被读取，或者是被垃圾回收了。

```
fetch(url).then(function(response) {
  if (response.headers.get('Content-Type') === 'application/json') {
    return response.json();
  }
  return response.text();
});
```

This is another feature fetch has over XHR, you can decide which format to read the body as after you've inspected the headers.

这是fetch比XHR好用的另外一面，你可以在监测headers以后决定使用哪种方式来读入body数据。

###Other bits
There are more features that fetch has over XHR that I'm not going to cover in too much detail, they include:

fetch还有很多比XHR好用的内容，这里就不做过多的介绍，主要包括：

####Headers class
Fetch has a headers class which can be used to read/write headers, and has an ES6 iterator.

Fetch有一个headers类，可以用来读取或者写入Headers，并且有一个ES6的迭代器。

####Cache control
The cache mode lets you specify the interaction with the cache. As in, should the cache be consulted? Should the response go into the cache if it's valid? Should the response only come from the cache?

The latter is a bit contentious as it can expose user history, so it may come with a CORS restriction before it lands in Chrome.

缓存模式决定了你和缓存的操作方式。缓存应该被访问吗？ 当缓存有效时，response可以从缓存读取吗？

由于缓存中有用户的历史数据，所以读取缓存数据变的有争议。Chrome会加上CORS跨域限制。

####No-credential same-origin requests
XHR forces you to serve credentials with requests to the same origin, fetch doesn't. In fact, no-credentials is the default for all requests made by fetch, making it less magic than XHR.

XHR强制在相同的域名下才能过获取资源。fetch并不这样。事实上，无跨域限制才是request默认的请求方式，这使得它没有XHR看起来那么神秘。

###What's missing?
Of course, there are some features XHR has that fetch doesn't have.

Fetch也并不是包含XHR的所有特性。

####Request aborting
This is the big one. In Canary you can cancel the stream, but there's no way to abort a request before headers have arrived.

We're going to fix this using cancellable promises, which other specs will benefit from. Track the discussion of this over at GitHub.

最大的问题，你可以打断流，但是你不能在header到达之前打断一个请求。

我们打算使用可终止的promise来修复这个问题。

####Progress events
Progress events are a high level feature that won't arrive in fetch for now. You can create your own by looking at the Content-Length header and using a pass-through stream to monitor the bytes received.

This means you can explicitly handle responses without a Content-Length differently. And of course, even if Content-Length is there it can be a lie. With streams you can handle these lies however you want.

正在进行的事情都是一些高等级的特性。你可以使用header的Content－Length 来使用“流”模拟接受数据。

这意味着你可以不使用Content-Length 而直接接收流。

####Synchronous requests
Noooope. The fetch spec documents them, but they won't be part of the API. Sync requests are awful.

同步请求是标准的一部分，但是绝对不会出现在API中。

###Couldn't this have been built on top of XHR?
XHR was an ugly baby and time has not been kind to it. It's 16 now. In a few years it'll be old enough to drink, and it's enough of a pain in the arse when it's sober.

Sure, a lot of this stuff could have been hacked on top of XHR, but it would have been a hack. Not only did fetch give us an opportunity to add lower-level features without the cruft of a badly designed API, it allowed us to create a better API for the simple things, using modern JavaScript features like promises and iterators.

If you want to stop using XHR today, there's a fetch polyfill. This is built on top of XHR, so it can't do the stuff that XHR can't, but it does give you the benefits of a nicer API.

Let's make fetch happen!

诚然，很多项目都是在Hack XHR之上完成的，但是它始终是hack方法。fetch不仅给了我们使用底层特性的机会，它也让通过现代Javascript的特性，如promise，iterators来帮助我们创建出更加优秀的API。

