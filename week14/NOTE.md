# 学习笔记

## js定时器和帧动画

有个帧动画的概念就可以上手操作了，基本就用以下三个API

其中，`setInterval`和`setTimeout`都是和时间挂钩的定时器，也就是最低可以16ms执行一次

`requestAnimationFrame`则是浏览器决定下一渲染出现时机，这个时机就是浏览器的下次重绘时候

1. `setInterval`
2. `setTimeout`
3. `requestAnimationFrame`

## timeline时间线

关于动画的时间线管理，首先要考虑一下功能和可能出现的问题就能搭出一个基础的时间线管理了

### 基础功能

1. 开始
2. 暂停
3. 恢复
4. 重置动画
5. 添加/删除动画

### 可能出现的问题

1. 开始和恢复功能其实应该用同一个基础函数实现，所以要辨别一下当前状态
2. 恢复功能，暂停期间的时间累计问题

## 动画

同理，整理一下动画的基础属性和可能出现的问题

### 基础功能

1. 属性名
2. 起始属性值
3. 结束属性值
4. 持续时长
5. 延时执行时常
6. 动画曲线