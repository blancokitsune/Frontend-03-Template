# 学习笔记

## 为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？

没查到为啥不行(本来一开始猜的是因为"第一行不确定"，后来觉得也不算啥问题，放弃猜了)，就看到直接说不行了，以下是看到的东西

### [CSS Level 1](https://www.w3.org/TR/CSS1/#the-first-line-pseudo-element)

> The 'first-line' pseudo-element is similar to an inline element, but with certain restrictions. Only the following properties apply to a 'first-line' element: font properties ([5.2](https://www.w3.org/TR/CSS1/#font-properties)), color and background properties ([5.3](https://www.w3.org/TR/CSS1/#color-and-background-properties)), 'word-spacing' ([5.4.1](https://www.w3.org/TR/CSS1/#word-spacing)), 'letter-spacing' ([5.4.2](https://www.w3.org/TR/CSS1/#letter-spacing)), 'text-decoration' ([5.4.3](https://www.w3.org/TR/CSS1/#text-decoration)), 'vertical-align' ([5.4.4](https://www.w3.org/TR/CSS1/#vertical-align)), 'text-transform' ([5.4.5](https://www.w3.org/TR/CSS1/#text-transform)), 'line-height' ([5.4.8](https://www.w3.org/TR/CSS1/#line-height)), 'clear' ([5.5.26](https://www.w3.org/TR/CSS1/#clear)).

> The 'first-line' pseudo-element is similar to an inline element, but with certain restrictions. Only the following properties apply to a 'first-line' element: font properties ([5.2](https://www.w3.org/TR/CSS1/#font-properties)), color and background properties ([5.3](https://www.w3.org/TR/CSS1/#color-and-background-properties)), 'word-spacing' ([5.4.1](https://www.w3.org/TR/CSS1/#word-spacing)), 'letter-spacing' ([5.4.2](https://www.w3.org/TR/CSS1/#letter-spacing)), 'text-decoration' ([5.4.3](https://www.w3.org/TR/CSS1/#text-decoration)), 'vertical-align' ([5.4.4](https://www.w3.org/TR/CSS1/#vertical-align)), 'text-transform' ([5.4.5](https://www.w3.org/TR/CSS1/#text-transform)), 'line-height' ([5.4.8](https://www.w3.org/TR/CSS1/#line-height)), 'clear' ([5.5.26](https://www.w3.org/TR/CSS1/#clear)).



1 - 4几个版本没啥变化，就不复制了





## 作业

我觉得没啥太难的- -，但确实给我卡住了，我太菜了，对不起

#### 思路

1. 对给定的选择器进行处理
   1. 分级(父子关系)
   2. 分种类(id、class)
2. dom树筛选是否匹配