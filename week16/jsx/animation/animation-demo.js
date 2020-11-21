import { Timeline, Animation } from "./animate";
import { ease, easeIn, easeInOut, easeOut } from "./ease";

const tl = new Timeline();
tl.start();
tl.add(new Animation(el.style, "transform", 0, 500, 2000, 0, easeInOut, (v) => `translateX(${v}px)`), Date.now());
tl.add(new Animation(el2.style, "transform", 0, 500, 2000, 0, ease, (v) => `translateX(${v}px)`));
tl.add(new Animation(el3.style, "transform", 0, 500, 2000, 0, easeIn, (v) => `translateX(${v}px)`));

pausebtn.addEventListener("click", () => tl.pause());
resumebtn.addEventListener("click", () => tl.resume());
resetbtn.addEventListener("click", () => tl.reset());
startbtb.addEventListener("click", () => tl.start());
