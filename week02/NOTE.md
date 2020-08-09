# 学习总结

## 状态机

> 有限状态自动机（FSM "finite state machine" 或者FSA "finite state automaton" ）是为研究有限内存的计算过程和某些语言类而抽象出的一种计算模型。有限状态自动机拥有有限数量的状态，每个状态可以迁移到零个或多个状态，输入字串决定执行哪个状态的迁移。有限状态自动机可以表示为一个有向图。有限状态自动机是自动机理论的研究对象。

以上就是状态机的概念了，是不是还挺简单的。

在我打完"挺简单"的时候，我还没有读完上面那个百度百科的解释。



我来大概说下自己的理解：

**状态机就是**

1. 当你运行某个程序(不止计算机程序，比如你自己**活着**就可以当成一个while(alive))
2. 当你在这个程序中**达到了某种状态时**(比如你喝完好多水，过了一会儿**想上厕所了**)
3. 正常来讲你应该在达到某种状态时，**去做点什么**(讲道理，上面那种情况一般正常人**应该会去小便的**)
4. 之后就是不断地去重复这些状态、和做点什么。这个步骤可以叫做**状态的变换**



emmmm....



反正以上就是我理解的状态机了，你要是能说干啥，那说明你还是有点没明白，多和现实中的事物进行对比参考，你就能发现很多共通的点了。

实在不行，你就想想你在写程序时候那些不断的`if else`和这个有没有点相似的感觉(我个人感觉还挺像的，只不过是抽象出来了每一块)。



## HTTP报文

> [1]: https://www.ruanyifeng.com/blog/2016/08/http.html	"HTTP 协议入门"
> [2]: https://hit-alibaba.github.io/interview/basic/network/HTTP.html	"HTTP面试整理"

### 请求报文

http这种天天用到的协议，应该没几个人不知道吧

以下就是一个请求报文的模板和两个样例

规范把 HTTP 请求分为三个部分：状态行、请求头、消息主体

```http
<method> <request-URL> <version>
<headers>

<entity-body>
```

```http
 GET /ph.com/?sex=man&name=Professional HTTP/1.1
 Host: www.example.com
 User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.6)
 Gecko/20050225 Firefox/1.0.1
 Connection: Keep-Alive
```

```http
 POST / HTTP/1.1
 Host: www.example.com
 User-Agent: Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.6)
 Gecko/20050225 Firefox/1.0.1
 Content-Type: application/x-www-form-urlencoded
 Content-Length: 40
 Connection: Keep-Alive

 sex=man&name=Professional  
```

### 响应报文

```http
HTTP/1.1 200 OK

Server:Apache Tomcat/5.0.12
Date:Mon,6Oct2003 13:23:42 GMT
Content-Length:112

<html>...
```

#### Transfer-Encoding

Transfer-Encoding 是一个用来标示 HTTP 报文传输格式的头部值。尽管这个取值理论上可以有很多，但是当前的 HTTP 规范里实际上只定义了一种传输取值——chunked。

如果一个HTTP消息（请求消息或应答消息）的Transfer-Encoding消息头的值为chunked，那么，消息体由数量未定的块组成，并以最后一个大小为0的块为结束。

每一个非空的块都以该块包含数据的字节数（字节数以十六进制表示）开始，跟随一个CRLF （回车及换行），然后是数据本身，最后块CRLF结束。在一些实现中，块大小和CRLF之间填充有白空格（0x20）。

最后一块是单行，由块大小（0），一些可选的填充白空格，以及CRLF。最后一块不再包含任何数据，但是可以发送可选的尾部，包括消息头字段。消息最后以CRLF结尾。

一个示例响应如下：

```http
HTTP/1.1 200 OK
Content-Type: text/plain
Transfer-Encoding: chunked

25
This is the data in the first chunk

1A
and this is the second one
0
```



## 状态机 & parser

好了，你已经明白了状态机和http是啥，相信你已经能够可以自己写个浏览器来处理你平时的上网需求了

我仿佛看到了你畏惧的样子，其实原理很简单也很粗暴



HTTP response / request parser大概步骤

1. 首先你得明确的知道一个最简单的request / response的报文长什么样子。哦对了，HTTP报文是用字符传输的。

2. 想想你怎么把一堆文本按照有空格有换行(crlf还是别的呢)排列出来呢

3. 经过上述的思考，你一定想到了通过使用状态机的思想来完成解析文本

4. ···

5. 剩下的就是验证你解析之后拼接的对不对了啊，开一个最简单的服务器试试response吧

6. 你可能沉默了，你废了半天劲为啥不测request。

   亲，这边建议您看下socket和手写http服务器的文章。