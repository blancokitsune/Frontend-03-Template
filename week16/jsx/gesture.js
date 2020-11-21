export class Listener {
  constructor(element, recognizer) {
    this.contexts = new Map();
    this.isListeningMouse = false; // 判定是否监听，避免多次监听鼠标事件

    this.mouseListener(element, recognizer);
    this.tapListener(element, recognizer);
  }
  // pc模式鼠标监听
  mouseListener(element, recognizer) {
    // let isListeningMouse = false; // 判定是否监听，避免多次监听鼠标事件
    const mousemove = (event) => {
      // 对鼠标按键、多按钮进行处理判断
      let button = 1;
      while (button <= event.buttons) {
        if (button & event.buttons) {
          let key = button;
          if (button == 2) key = 4;
          if (button == 4) key = 2;
          const context = this.contexts.get("mouse" + key);
          recognizer.move(event, context);
        }
        button <<= 1;
      }
    };

    const mouseup = (event) => {
      // 鼠标松开，移除事件
      const context = this.contexts.get("mouse" + (1 << event.button));

      recognizer.end(event, context);
      this.contexts.delete("mouse" + (1 << event.button));

      if (event.buttons == 0) {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);

        this.isListeningMouse = false;
      }
    };

    element.addEventListener("mousedown", (event) => {
      console.log(event);
      const context = Object.create(null);
      this.contexts.set("mouse" + (1 << event.button), context);
      recognizer.start(event, context);

      if (!this.isListeningMouse) {
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
        this.isListeningMouse = true;
      }
    });
  }
  // 移动端模式触屏监听
  tapListener(element, recognizer) {
    element.addEventListener("touchstart", (event) => {
      for (let touch of event.changedTouches) {
        let context = Object.create(null);
        this.contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    });
    element.addEventListener("touchmove", (event) => {
      for (let touch of event.changedTouches) {
        let context = this.contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    });
    element.addEventListener("touchend", (event) => {
      for (let touch of event.changedTouches) {
        let context = this.contexts.get(touch.identifier);
        recognizer.end(touch, context);
        this.contexts.delete(touch.identifier);
      }
    });
    element.addEventListener("touchcancel", (event) => {
      for (let touch of event.changedTouches) {
        let context = this.contexts.get(touch.identifier);
        recognizer.cancel(touch);
        this.contexts.delete(touch.identifier);
      }
    });
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  // 设定鼠标按下/触碰屏幕起始状态
  start(point, context) {
    // 设置点击时(起始)坐标
    context.startX = point.clientX;
    context.startY = point.clientY;
    this.dispatcher.dispatch("start", {
      startX: context.startX,
      startY: context.startY,
    });

    context.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY,
      },
    ];

    context.isPan = false;
    context.isTap = true;
    context.isPress = false;

    // 设置
    context.handler = setTimeout(() => {
      context.isPan = false;
      context.isTap = false;
      context.isPress = true;
      context.handler = null;
      this.dispatcher.dispatch("press", {});
    }, 500);
  }

  move(point, context) {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;

    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isPan = true;
      context.isTap = false;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      this.dispatcher.dispatch("panstart", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
      clearTimeout(context.handler);
    }
    if (context.isPan) {
      this.dispatcher.dispatch("pan", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      });
    }
    context.points = context.points.filter((point) => Date.now() - point.t < 500);
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    });
  }

  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch("tap", {});
      clearTimeout(context.handler);
    }

    if (context.isPress) {
      this.dispatcher.dispatch("pressend", {});
    }

    context.points = context.points.filter((point) => Date.now() - point.t < 500);
    let d, v;
    if (!context.points.length) {
      v = 0;
    } else {
      d = (point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2;
      d = Math.sqrt(d);
      v = d / (Date.now() - context.points[0].t);
    }

    if (v > 1.5) {
      this.dispatcher.dispatch("flick", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      });
      context.isFlick = true;
    } else {
      context.isFlick = false;
    }

    if (context.isPan) {
      this.dispatcher.dispatch("panend", {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      });
    }

    this.dispatcher.dispatch("end", {
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY,
      isVertical: context.isVertical,
      isFlick: context.isFlick,
      velocity: v,
    });
  }

  cancel(point, context) {
    clearTimeout(context.handler);
    this.dispatcher.dispatch("cancel", {});
  }
}
export class Dispatcher {
  constructor(element) {
    this.element = element;
  }
  dispatch(type, properties) {
    const event = new Event(type);
    for (let name in properties) {
      event[name] = properties[name];
    }
    this.element.dispatchEvent(event);
  }
}
export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}
