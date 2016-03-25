##[Practical Examples of the New Node.js Streams API](https://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/)
May 29, 2013/9 Comments/in Community, How-To /by Marc Harter

&emsp;&emsp;Node brought a simplicity and beauty to streaming.  Streams are now a powerful way to build modules and applications.  Yet the original streams API had some problems.  So in Node v0.10, we saw the streams API change in order to fix the prior problems, extend the APIs to encapsulate more common use cases, and be simpler and easier to use.

&emsp;&emsp;As I tried to make the adjustment to the new APIs, I found some documentation on it but not many practical examples.  This article explores some of the Node documentation that may be confusing about the new APIs.  It will also apply the new APIs in practical terms to help you get started using these APIs in your programs.  Let’s dive in!

Node带给我们简单，富有艺术的“流”。“流”是建立模块和项目的方式。说明，由于文章写的比较早，现在Node的版本已经升到了5.9,我们这里只是想深入学习一下Transform 流的内容。

###The “line by line” problem

&emsp;&emsp;Good log data can be an invaluable resource to a company and developer team. However, sifting through that data can be time consuming and you can only get so far with shell commands.  Wouldn’t it be helpful to programmatically get statistics or locate patterns in your logs?  For many log formats, in order to do that, we need a way to get at our data line by line.

&emsp;&emsp;The beauty of Node streams is we don’t have to do this all in memory (log files can be huge) and we can process data as soon its been read.  Streams also will work from any I/O source (file system, network).

&emsp;&emsp;Using the new stream APIs, we can create a reusable I/O component that transforms our data into individual lines for further processing.

有效的Log输出对于公司和开发团队都是无价的。从庞大的数据量中筛选出我们需要的内容是费时费力的。并且目前为止只能使用Shell命令行来完成。 如果能够通过程序代码获取想要的内容，或者通过模式匹配来定位，那就非常有帮助了。但是对于目前的日志格式，我们必须通过将日志一条条输出的方式来完成工作。

Node的Streams 可以让我们不用将整个文件读入内存中，并且在文件内容被读入时就进行处理。Stream支持任何类型的I/O资源。

使用Stream API，我们能够创建可重复利用的 I/O内容，并将内容转换为独立的行提供后面使用。 

###The Transform stream

&emsp;&emsp;Node 0.10 provides a nifty stream class called Transform for transforming data intended to be used when the inputs and outputs are causally related.  In our problem, the input and output are actually the same data.  However, this data is transformed into separate lines for further processing down the road (such as collecting stats or searching).

&emsp;&emsp;Transforms sit in the middle of a pipeline and are both readable and writeable:

Node 0.10提供了一个非常好的stream子类Transform 来完成输入和输出不一致时的转换工作。这里的问题是，输入和输出是一样的， 我们希望能够一行一行的独立输出，这样方便我们进行统计等其他工作。 

![1](https://lh5.googleusercontent.com/3df7l6Ja5OqzwNA3INt0YUdnP2emb__5yFGCB8lL4zegVnE5qf9Xy-b8mA-C-rzIfEofM2TcdtQgg8svTxNM5Bkcv1wiX91IasWXDvw1u6s_7yvDgSREd4eo)
To set up our transformation, we need to include the stream module and instantiate a new Transform stream:

首先我们需要引入stream模块，然后初始化生成一个新的Transform流： 

```
var stream = require('stream')
var liner = new stream.Transform( { objectMode: true } )
```

###Switching on objectMode

&emsp;&emsp;Whoa!  What is that { objectMode: true } I threw in there?  Well, we want the destination of our transformation to be able to handle the data line by line.  objectMode allows a consumer to get at each value that is pushed from the stream.  Without objectMode, the stream defaults to pushing out chunks of data.  As the name suggests, objectMode is not just for string values, like in our problem, but for any object in JavaScript ({ “my”: [ “json”, “record” ]}).

`{objectMode: true}`是什么东西。我们希望转换之后的内容是是可以被一行行的处理。如果没有objectMode，默认的输出流就是一些chunks数据，无法被识别。正如名字预示的那样，objectMode不仅仅支持string类型，而是javascript的人和对象类型，如`{"my": ["json", "record"]}`

###The _transform method

&emsp;&emsp;So that’s cool but we aren’t done yet.  Transform classes require that we implement a single method called _transform and optionally implement a method called _flush.  Our example will implement both, but let’s cover the _transform method first.

&emsp;&emsp;The _transform method is called every time our source has data for us.  Let’s look at the code and then talk about it:

虽然很酷，但是我们还没有完成。Transform类需要我们来继承实现_transform 的方法，选择性的实现_flush 的方法。这里我们都进行实现。

_transform 方法会在每次有数据提供给我们的时候调用。首先看下下面的代码：

```
liner._transform = function (chunk, encoding, done) {
     var data = chunk.toString()
     if (this._lastLineData) data = this._lastLineData + data 
 
     var lines = data.split('\n') 
     this._lastLineData = lines.splice(lines.length-1,1)[0] 
 
     lines.forEach(this.push.bind(this)) 
     done()
}
```

&emsp;&emsp;As data from a source stream arrives, _transform will be called.  Along with it comes a chunk of available data, the type of encoding that data has been provided in and a done function that signals that you are done with this chunk and ready for another.

&emsp;&emsp;In our case, we don’t care about the underlying encoding.  We just want the chunk to be a string value, so we will perform a toString() conversion.  Once we have our chunk as a string, we can split(‘n’) to get an array of individual lines. Next, we push each line separately to whatever is consuming the transformation.

&emsp;&emsp;Note: The push method is part of the Readable stream class (which Transform inherits from).  If you are familiar with Node 0.8, push is akin to emitting data events.

当一段数据到达时，_transform函数会被调用。随着数据一起到达的还有数据的编码类型，当数据处理完成时，需要调用done函数通知下游。

这里，我不关系底层的数据编码。我们只希望数据转换为字符串类型，所以这里使用了`toString()`,之后我们通过`split('\n')将字符串分隔换行得到数组。然后将每个独立的行push到下游去消费。

注意： push方法时 Readable Stream 类的一部分，同时它会触发流的data事件。

```
stream.emit(‘data’, data) ➤ stream.push(data)
```

&emsp;&emsp;Lastly, we signal that we are finished with the chunk by calling done().  Since done is a callback, it allows us to also perform asynchronous actions in our _transform if desired.

&emsp;&emsp;What is the _lastLineData stuff all about? We don’t want a chunk of data to get cut off in the middle of a line.  In order to avoid that, we splice out the last line we find so it does not push to the consumer.  When a new chunk comes in we prepend the line data to the front and continue.  This way we can safeguard against half lines being pushed out.

最后，完成工作之后调用`done()`方法发出信号。即使`done()`方法被调用，我们仍然可以在_transform里面使用异步的操作。

_lastLineData是什么？ 我们不希望数据是在中间被截断的。所以程序中我们将最后一行内容切割保留不放入下游消费。下次数据到达时，我们将新的内容拼接在_lastLineData后面。使用这种方法可以避免将一半的行内容push到下游操作。

###The _flush method

&emsp;&emsp;However, we still have a problem.  When the last call to _transform happens, we have a _lastLineData value sitting around that never got pushed.  Thankfully, the Transform class also provides a _flush method for this scenario.  After all the source data has been read and transformed, the _flush method will be called if it has been implemented.  The _flush method is a great place to push out any lingering data and clean up any existing state. Here is how it would look like in our case:

这里还是有问题，当最后一次调用_transform 完成时，我们的_lastLineData并没有被push出来。这里Transform类还提供了一个_flush的方法完成该场景。当所有的资源数据被读取并且被转换之后，_flush方法将会被调用。它会清除Transform内部，并将所有内容都输出。  
参考下面的代码：

```
liner._flush = function (done) {
     if (this._lastLineData) this.push(this._lastLineData)
     this._lastLineData = null
     done()
}
```

&emsp;&emsp;We push out the _lastLineData provided if we have some to the consumer and then cleanup our instance variable.  Finally, we call done() to signal that we are finished flushing.  This will also signal to the consumer that the stream has ended.  Remember, the _flush method is optional and may be unnecessary for some Transform streams.

我们将_lastLineData输出到下游，然后清理实例变量。最后调用`done()`方法发出我们已经完成flushing的操作。同时也告诉下游消费者我们已经完成了数据的转换。_flush方法是选择性实现的。

###The solution
That wraps up our little liner module.  Let’s look at it in full:

我们来看下完整的代码实现：

```
var stream = require('stream')
var liner = new stream.Transform( { objectMode: true } )
 
liner._transform = function (chunk, encoding, done) {
     var data = chunk.toString()
     if (this._lastLineData) data = this._lastLineData + data
 
     var lines = data.split('\n')
     this._lastLineData = lines.splice(lines.length-1,1)[0]
 
     lines.forEach(this.push.bind(this))
     done()
}
 
liner._flush = function (done) {
     if (this._lastLineData) this.push(this._lastLineData)
     this._lastLineData = null
     done()
}
 
module.exports = liner
```

&emsp;&emsp;First, you need a data source.  Any file that uses lines to delineate records will do. The most universal file I can think of is an access log from Apache.  To pull this file data, we’ll use a Readable stream:

首先，我们得有数据源。任何通过行来区分记录的文件。可能Apache的access log 就是很好的例子。

```
var fs = require('fs')
var liner = require('./liner')
var source = fs.createReadStream('./access_log')
source.pipe(liner)
liner.on('readable', function () {
     var line
     while (null !== (line = liner.read())) {
          // do something with line
     }
})
```
As data becomes readable from the transformation, we can access each line individually through objectMode.


###Wrapping Up
&emsp;&emsp;We are only scratching the surface when it comes to all that you can do with streams.  However, I hope you can take this little example further and come up with your own stuff.  If you’ve dismissed streams before in Node, take another look!  I think you’ll find the new stream API powerful and simple to use.

我们只是介绍了Stream的一些基本功能。希望你能更上一层楼。
