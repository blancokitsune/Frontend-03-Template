import { Component, createElement } from "./framework";

export { STATE, ATTRIBUTE } from "./framework";

export class Button extends Component {
  constructor() {
    super();
  }
  render() {
    this.childontainer = <span />;
    this.root = (<div>{this.childontainer}</div>).render();
    return this.root;
  }

  appendChild(child) {
    if (!this.childontainer) {
      this.render();
    }
    this.childontainer.appendChild(child);
  }
}
