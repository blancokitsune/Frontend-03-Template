const assert = require("assert");

// import { parseHTML } from "../src/parser";
import { parseHTML } from "../src/pc";

describe("parse html:", () => {
  it("<a></a>", function () {
    const tree = parseHTML("<a></a>");
    assert.equal(tree.children[0].tagName, "a");
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href="//time.geelbang.org"></a>', () => {
    let tree = parseHTML('<a href="//time.geelbang.org"></a>');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it("<a href ></a>", () => {
    let tree = parseHTML("<a href ></a>");
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it("<a href id></a>", () => {
    let tree = parseHTML("<a href id></a>");
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].children.length, 0);
  });

  it("<a/>", function () {
    let tree = parseHTML("<a/>");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<A /> upper case", function () {
    let tree = parseHTML("<A />");
    assert.equal(tree.children.length, 1);
    assert.equal(tree.children[0].children.length, 0);
  });

  it("<>", function () {
    let tree = parseHTML("<>");
    assert.equal(tree.children[0].type, "text");
  });
});
