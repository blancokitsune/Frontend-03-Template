import { linear } from "./ease";

// 设置常量属性名做私有属性，不让外部调用
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("add-time");
const PAUSE_START = Symbol("pause-start");
const PAUSE_TIME = Symbol("pause-time");

export class Timeline {
  constructor() {
    this.state = "Inited";
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }
  // 开启
  start() {
    if (this.state !== "Inited") return;
    this.state = "Started";
    this[PAUSE_TIME] = 0;
    const startTime = Date.now();
    this[TICK] = () => {
      const now = Date.now();
      for (let animation of this[ANIMATIONS]) {
        let temp = now - this[START_TIME].get(animation) - this[PAUSE_TIME];
        if (this[START_TIME].get(animation) < startTime) temp = now - startTime - this[PAUSE_TIME];
        // console.log(this[PAUSE_TIME]);
        if (animation.duration + animation.delay < temp) {
          this[ANIMATIONS].delete(animation);
          temp = animation.duration;
        }
        if (temp > 0) animation.receive(temp);
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }
  // 停止
  pause() {
    if (this.state !== "Started") return;
    this.state = "Paused";
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  }
  // 恢复
  resume() {
    if (this.state !== "Paused") return;
    this.state = "Started";
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  }
  // 重置
  reset() {
    this.pause();
    this.state = "Inited";
    this[PAUSE_TIME] = 0;
    this[PAUSE_START] = 0;
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
    this[TICK_HANDLER] = null;
  }
  // 添加
  add(animation, startTime) {
    if (arguments.length < 2) startTime = Date.now();
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
}

export class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFn, template) {
    timingFn = timingFn || linear;
    template = template || ((v) => v);
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFn = timingFn;
    this.delay = delay;
    this.template = template;
  }
  receive(time) {
    // console.log(time);
    const range = this.endValue - this.startValue;
    const progress = this.timingFn(time / this.duration);
    // const progress = time / this.duration;
    this.object[this.property] = this.template(this.startValue + range * progress);
  }
}
