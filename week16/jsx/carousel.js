import { createElement, Component, STATE, ATTRIBUTE } from "./framework";
import { enableGesture } from "./gesture";
import { Timeline, Animation } from "./animation/animate";
import { ease } from "./animation/ease";
export { STATE, ATTRIBUTE } from "./framework";

export class Carousel extends Component {
  constructor() {
    super();
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");

    for (let record of this[ATTRIBUTE].src) {
      let child = new Image();
      child.src = record;
      this.root.appendChild(child);
    }
    enableGesture(this.root);
    const timeline = new Timeline();
    timeline.start();
    const children = this.root.children;
    let handler = null;
    this[STATE].position = 0;
    let animationTime = 0;
    let animationDx = 0;

    this.root.addEventListener("start", (event) => {
      timeline.pause();
      clearInterval(handler);
      if (Date.now() - t < 500) {
        const progress = (Date.now() - animationTime) / 500;
        animationDx = ease(progress) * 500 - 500;
      } else {
        animationDx = 0;
      }
    });

    this.root.addEventListener("tap", (event) => {
      this.triggerEvent("click", { position: this[STATE].position });
    });
    this.root.addEventListener("pan", (event) => {
      const x = event.clientX - event.startX;
      const current = this[STATE].position - Math.round((x - (x % 500)) / 500);

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        children[pos].style.transition = `none`;
        children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)}px)`;
      }

      console.log("event", event);
    });

    this.root.addEventListener("end", (event) => {
      timeline.reset();
      timeline.start();
      handler = setInterval(nextPicture, 3000);
      const x = event.clientX - event.startX - animationDx;
      const current = this[STATE].position - (x - (x % 500)) / 500;
      // position = position - Math.round(x / 500);
      let direction = Math.round((x % 500) / 500);
      if (event.isFlick) {
        direction = Math.floor((x % 500) / 500);
        if (event.velocity < 0) {
          direction = Math.ceil((x % 500) / 500);
        }
      }

      for (let offset of [-1, 0, 1]) {
        let pos = this[STATE].position + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        children[pos].style.transition = "none";
        // children[pos].style.transform = `translateX(${}px)`;
        timeline.add(
          new Animation(
            children[pos],
            "transform",
            -pos * 500 + offset * 500 + (x % 500),
            -pos * 500 + offset * 500 + direction * 500,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }

      this[STATE].position = this[STATE].position - (x - (x % 500)) / 500 - direction;
      this[STATE].position = ((this[STATE].position % children.length) + children.length) % children.length;
      this.triggerEvent("change", { position: this[STATE].position });
    });

    const nextPicture = () => {
      let children = this.root.children;
      let nextIndex = (this[STATE].position + 1) % children.length;

      let current = children[this[STATE].position];
      let next = children[nextIndex];

      animationTime = Date.now();
      timeline.add(
        new Animation(
          current.style,
          "transform",
          -this[STATE].position * 500,
          -500 - this[STATE].position * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      timeline.add(
        new Animation(
          next.style,
          "transform",
          500 - nextIndex * 500,
          -nextIndex * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      this[STATE].position = nextIndex;
      this.triggerEvent("change", { position: this[STATE].position });
    };
    handler = setInterval(nextPicture, 3000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
