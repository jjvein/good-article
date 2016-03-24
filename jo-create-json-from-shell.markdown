## jo
github地址：https://github.com/jpmens/jo.git

### 介绍

**jo**: 该工具可以实现从shell命令行输出JSON字符串

### 安装

1. brew

		brew update
		brew install jo
		
		
2. 从tar包编译安装

		curl -s -LO https://github.com/jpmens/jo/archive/v1.0.tar.gz
		tar xvzf jo-1.0.tar.gz
		cd jo-1.0
		./configure
		make check
		make install

3. 从github安装
		
		git clone git://github.com/jpmens/jo.git
		cd jo
		autoreconf -i
		./configure
		make check
		make install

### 语法

```
jo [-p] [-a] [-B] [-v] [-V] [word ...]
```

### 说明

**jo**可以接受参数，或者从标准输入，然后输出JSON。如果没有`-a`选项，则生成一个对象，每个参数都是一个`key=value`键值对，生成的JSON对象中，"key"是键，"value"是值。**jo**会尝试解析"value"的类型，对应的返回"number", "string", null等数据类型。


如果**jo**带参数`-a`，那么则会创建一个数组。

```
jo -a -p name=jjvein age=15

//output
[
   "name=jjvein",
   "age=15"
]

//no -a parameter
json -p name=jjvein age=15

//output
{
   "name": "jjvein",
   "age": 15
}
```

**jo** 将`key@value`处理成boolean类型的JSON元素：如果"value"以T,t开头，或者是大于0的数字，结果都为true， 否则为false。如果内容为空则返回null类型。

```
jo -p name=jjvein boy@t

//output
{
   "name": "jjvein",
   "boy": true
}

jo -p name=jjvein boy@

//output
{
   "name": "jjvein",
   "boy": null
}
```


### 参数说明

- -a 使用数组而不是对象的方式来解析参数，生成数组类型的JSON对象
- -B 默认情况下，**jo**会解析"true"和"false"这样的字符串，可以使用`-B`禁止解析
- -p 优雅的输出JSON字符串，而不是输出成一行
- -v 显示版本号
- -V 显示JSON版本号

### 使用范例

1. 创建一个JSON对象：
		
		jo tst=1457081292 lat=12.3456 cc=FR badfloat=3.14159.26 name="JP Mens" nada= coffee@T
		
		//output
		{"tst":1457081292,"lat":12.3456,"cc":"FR","badfloat":"3.14159.26","name":"JP Mens","nada":null,"coffee":true}


2. 使用数组的方式打印出当前目录:

		jo -p -a *
		
		//output
		[
               "Makefile",
               "README.md",
               "jo.1",
               "jo.c",
               "jo.pandoc",
               "json.c",
               "json.h"
       ]
	
	
3. 在对象内部创建一个对象：

		jo -p name=JP object=$(jo fruit=Orange hungry@0 point=$(jo x=10 y=20 list=$(jo -a 1 2 3 4 5)) number=17) sunday@0
		
		//output
		    {
               "name": "JP",
               "object": {
                "fruit": "Orange",
                "hungry": false,
                "point": {
                 "x": 10,
                 "y": 20,
                 "list": [
                  1,
                  2,
                  3,
                  4,
                  5
                 ]
                },
                "number": 17
               },
               "sunday": false
           }
	

4. Boolean作为字符串或者布尔值(-B选项不允许检测"true"和"false"字符串。)

		jo switch=true morning@0
		
		//output
		{"switch":true,"morning":false}
		
		jo -B switch=true morning@0
		
		//output
		{"switch":"true","morning":false}
		
5. 元素（对象和数组）可以被拆分开整齐的展示，下面的例子中有一个数组`point`，一个对象`geo`

		jo -p name=Jane point[]=1 point[]=2 geo[lat]=10 geo[lon]=20
		
		//output
              {
                 "name": "Jane",
                 "point": [
                    1,
                    2
                 ],
                 "geo": {
                    "lat": 10,
                    "lon": 20
                 }
              }

6. 从文件中读取内容： value由@开始，读取原始文件，由%开始，需要使用base64-encode编码：

		jo program=jo author=@AUTHORS
		
		//output 
		{"program":"jo","authors":"Jan-Piet Mens <jpmens@gmail.com>"}
		
		jo program=jo author=%AUTHORS
		{"filename":"AUTHORS","content":"SmFuLVBpZXQgTWVucyA8anBtZW5zQGdtYWlsLmNvbT4K"}
		

### 注意

数字字符串会被转换为数字，有时候这可能并不是想要的输出，可以\转义引号。

```
jo a=1.0

//output 
{"a":1}

jo a="1.0"

//output
{"a":1.0}

jo a=\"1.0\"

//output
{"a":"1.0"}
```
