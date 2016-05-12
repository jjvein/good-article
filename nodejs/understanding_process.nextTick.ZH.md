## [理解process.nextTick()]((https://howtonode.org/understanding-process-next-tick)

作者： Kishore Nallan
> 这篇文章是基于老版本Nodejs而写。如果想看新版Nodejs对应该模块的内容，建议参考Nodejs API比较版本特性变化。

经常看见一些人对`process.nextTick()`感到困惑。现在我们对其深入剖析，介绍使用场景。

你已经知道，每个Nodejs项目都是在同一个进程上运行。除了I/O操作，其他任何时候，Nodejs事件轮询只允许执行一个任务/事件。你想象事件轮询每次执行回调栈的中的函数。所以，即使你的Nodejs项目是运行在多核的机器上，却并不能得到并行的执行结果。这也是为什么Nodejs适合处理大量I/O任务，而不是CPU密集的任务。对每个I/O任务，你都可以定义一个简单的回调函数，该函数会被加入到事件队列中。但I/O操作完成时，回调函数将会被触发，然后，程序会继续执行其他的I/O请求。

`process.nextTick()`是用来延迟当前操作到下一次的事件轮询。举个例子，这里有个简单的函数`foo()`,我们希望在下次轮询中再执行它： 

```
function foo() {
    console.error('foo');
}

process.nextTick(foo);
console.error('bar')
```

当我们运行上面的代码片段时，你会发现'bar'会提前与'foo'输出，正是因为我们延迟`foo()`函数到下一个事件轮询执行。

```
bar
foo
```

事实上，你可以使用`setTimeout()`来完成实现同样的结果。

```
setTimeout(foo, 0);
console.log('bar');
```
然而，`process.nextTick()`并不完全等同于`setTimeout(fn, 0) - 它更加高效。

更精确的说，`process.nextTick()`延迟函数到一个全新的回调栈中。你完全可以在当前的栈中调用多个函数。调用`nextTick()`的函数需要返回，包括其父调用栈。在下一次的事件轮询中，使用`nextTick()`的函数才会被调用，并且是在一个新的栈上被执行。 

下面我们来看看使用`process.nextTick()`的场景： 

### 停止执行CPU密集任务去执行其他的事件任务

我们有个函数`compute`需要被一直执行，并且计算一些CPU密集的计算任务。如果我们想要在同一个进程中处理HTTP请求，就可以使用`process.nextTick()`来暂停`compute()`的执行：

```
var http = require('http');

function compute() {
    // performs complicated calculations continuously
    // ...
    process.nextTick(compute);
}

http.createServer(function(req, res) {
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.end('Hello World');
}).listen(5000, '127.0.0.1');

compute();
```
在这个模型中，我们并没有递归的调用`compute()`，而是使用`process.nextTick()`将`compute()`延迟到下次事件轮询中。这样我们就能确保当队列中有其他的HTTP请求时，它们会先于`compute()`执行。但是如果没有使用`process.nextTick()`,程序将不会有机会处理到达的HTTP请求。

所以，我们并没有通过`process.nextTick()`获得任何多核并行带来的好处，但却依然可以在程序的不同部分完成CPU的共享。

### 真正的异步回调

当你的函数需要传递一个回调函数时，你需要确定这个函数确实是会被异步调用。下面举个相反的例子： 

```
function asyncFake(data, callback) {        
    if(data === 'foo') callback(true);
    else callback(false);
}

asyncFake('bar', function(result) {
    // this callback is actually called synchronously!
});
```
这是一个前后矛盾的例子。事实上想要实现异步，但确是同步的调用。 

```
var client = net.connect(8124, function() { 
    console.log('client connected');
    client.write('world!\r\n');
});
```

上面的例子中，因为某些原因， `next.connect()`变成同步调用，回调函数就会被立刻调用，那么'client'变量在调用出并没有被初始化。

可以使用下面的方法真正的实现异步： 

```
function asyncReal(data, callback) {
    process.nextTick(function() {
        callback(data === 'foo');       
    });
}
```

### 触发事件

当你在写一个类库，它需要读取数据并且在有数据的时候触发事件。

```
var EventEmitter = require('events').EventEmitter;

function StreamLibrary(resourceName) { 
    this.emit('start');

    // read from the file, and for every chunk read, do:        
    this.emit('data', chunkRead);       
}
StreamLibrary.prototype.__proto__ = EventEmitter.prototype;   // inherit from EventEmitter
```

在页面的其他地方需要监听这些事件。

```
var stream = new StreamLibrary('fooResource');

stream.on('start', function() {
    console.log('Reading has started');
});

stream.on('data', function(chunk) {
    console.log('Received: ' + chunk);
});
```

在上面的例子中，监听器将永远不会监听到start事件，因为在StreamLibrary实例化的时候就已经触发了start事件。那时候，我们还没有注册start事件的监听事件。这时我们便可以使用`process.nextTick()`来延迟start事件在下次事件轮询的时候再触发，那时便可以监听到start时间了。

```
function StreamLibrary(resourceName) {      
    var self = this;

    process.nextTick(function() {
        self.emit('start');
    });

    // read from the file, and for every chunk read, do:        
    this.emit('data', chunkRead);       
}
```

希望你已经弄明白了`process.nextTick()`的用法。
