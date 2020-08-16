# 学习总结

## 实现一个简单的浏览器解析html+css的环节

### 思路：

#### 第一步

1. 解析html
   1. 了解一个元素element和一对(个标签tag)的区别
   2. 翻看查阅w3,whatwg对标签的定义以及相关的伪代码判断，
      1. 这时候我们应该知道有几种常见的标签形式
         1. `<a></a>`,无内容的一对标签
         2. `<span>连接<span>`，有内容的一对标签
         3. `<span class="哈哈">连接<span>`，有内容有属性的一对标签
         4. `<img/>`，无属性的单标签
         5. `<img src="1.jpg"/>`，有属性的单标签
   3. 开始写状态机逐一判断字符是否构成以下几个主要内容
      1. 一对标签
         1. 开始标签(tag start)
            1. 开始标签的开始(<)
            2. 内容(tag name)
            3. 是否在连续字符后出现空格等空白符
               1. 是否在空白符后出现非终结标签字符(property name)
                  1. 是否出现"="
                     1. 是否出现引号(单双)(property value start)
                     2. 是否有内容(property value)
                     3. 是否有结束引号(property value end)
            4. 结束（>)
         2. 元素内容(element content)
         3. 结束标签(tag end)
            1. 结束标签的开始(</)
            2. 内容(tag name)
            3. 结束(>)
      2. 单标签(自封闭标签)
         1. 标签的开始(<)
         2. 内容(tag name)
         3. 结束(/>)
2. 解析css
   1. 解析元素element的类型是否style
      1. 判断选择器
         1. 根据 tagName，id，class等选择器规则拆分选择器
      2. 判断选择器具体css规则
         1. css开始(`{`,css start)
         2. css内容(css content)
            1. css属性名(css property name)
            2. css赋值符号(:)
            3. css值(css property value)
            4. css值赋值结束符号(;)
         3. css内容结束(`}`，css end)
   2. 解析行内的属性名property name是否为style
      1. 判断是否空值
      2. 判断具体css规则

#### 第二步：

> 以上步骤可能有混乱冲突的地方，但大概思路就是那样，每一个可以重复的过程都提出来，用作状态机的一部分不断的去判断每个传进来的html文本内容

有了基础的html结构parser和css parser，就可以进行下一步了

##### 构成 dom tree，css tree(ast)

数组是个好东西，它可以较为方便的帮我们模拟一个树结构

html的根节点我们设置为document，之后我们进行一系列判断，不断地将上方拆解出来的element(tag的最终归宿，一对标签，一个单标签都是element)，通过每个树节点是一个对象，我们不断的插进去就ok了

接下来有两个选择，

1. 渲染完dom树之后单独渲染加上css的树
   1. 通过解析后的css标签，我们由内向外的去判断dom的祖先树和选择器是否匹配，匹配的话则在本元素上进行css加持
2. 在判断开始标签时候就同时渲染带有css的树