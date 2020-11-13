const element = document.documentElement

element.addEventListener("mousedown", (event) => {
  const mousemove = (event) => {
    move(event)
  }
  const mouseup = (event) => {
    // 鼠标松开，移除事件
    end(event)
    element.removeEventListener("mousemove", mousemove)
    element.removeEventListener("mouseup", mouseup)
  }

  start(event)

  element.addEventListener("mousemove", mousemove)
  element.addEventListener("mouseup", mouseup)
})

// 移动端手势
let handler = null
let startX, startY
let isPan = false
let isTap = false
let isPress = false

const start = (point) => {
  // 设置点击时(起始)坐标
  startX = point.clientX
  startY = point.clientY
  isPan = false
  isTap = true
  isPress = false

  // 设置
  handler = setTimeout(() => {
    isPan = false
    isTap = false
    isPress = true
    handler = null
    console.log("start", point)
  }, 500)
}
const move = (point) => {
  let dx = point.clientX - startX
  let dy = point.clientY - startY

  if (!isPan && dx ** 2 + dy ** 2 > 100) {
    isPan = true
    isTap = false
    isPress = false
    clearTimeout(handler)
  }
  if (isPan) {
    console.log("pan")
  }
  console.log(dx, dy)
}
const end = (point) => {
  if (isTap) {
    console.log("tap")
    clearTimeout(handler)
  }
  if (isPan) {
    console.log("isPan")
  }
  if (isPress) {
    console.log("isPress")
  }
}
const cancel = (point) => {
  clearTimeout(handler)
}

element.addEventListener("touchstart", (event) => {
  for (let touch of event.changedTouches) {
    start(touch)
  }
})
element.addEventListener("touchmove", (event) => {
  for (let touch of event.changedTouches) {
    move(touch)
  }
})
element.addEventListener("touchend", (event) => {
  for (let touch of event.changedTouches) {
    end(touch)
  }
})
element.addEventListener("touchcancel", (event) => {
  for (let touch of event.changedTouches) {
    cancel(touch)
  }
})
