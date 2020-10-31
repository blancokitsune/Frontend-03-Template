# 学习笔记

## 模拟一个功能残缺的jsx实现

### 思路

完整的分析语法是不太行了，直接借用 `@babel/plugin-transform-react-jsx` 改一下入口函数，入口函数由我们来提供，借此来实现自己模拟的react jsx实现

### 分析

先看一下jsx语法在babel之后长个啥样子，[Babel](https://babeljs.io/repl)

jsx

```jsx
let a = <div/>
    
let b = <div id="b"/>
  
let c = <div>
          <p>cccc</p>
        </div>    

let d = <Custom id="d"/>
    
let e = <custom id="e"/>
```

babel之后

```javascript
"use strict";

let a = /*#__PURE__*/React.createElement("div", null);

let b = /*#__PURE__*/React.createElement("div", {
  id: "b"
});

let c = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "cccc"));

let d = /*#__PURE__*/React.createElement(Custom, {
  id: "d"
});

let e = /*#__PURE__*/React.createElement("custom", {
  id: "e"
});
```

那其实不难看出来，无非就是都用了个`createElement`的方法，第一个参数是元素类型，第二个是相关属性，第三个是子元素有可能是文本或者还是元素

第一个元素类型又可能有两种，第一种是html原生的表现为字符串，第二种可能是自定义的表现为一个引用而且首字母大写了，要是小写了就当作字符串

### 实现

有了简单的思路可以直接上手试一下

```js
function createElement(type, attributes, ...children) {
	// 1.判断type
    if(typeof type == "string"){
        原生dom，创建dom
    }else{
        非原生dom，可能为自定义的类型，那就new一个
    }
    
    // 2.赋值属性
    for(name in attributes){
        给上面创建的元素进行属性赋值
    }
    
    // 3.判断下有没有子元素
    for(child of children){
        if(typeof child == "string"){
            是文本，创建文本节点，直接插入到元素中
        }
        插入元素至当前节点下属
    }
}
```

