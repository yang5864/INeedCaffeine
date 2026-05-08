import assert from "node:assert/strict";
import test from "node:test";
import { getCaffeineLevelVisual } from "./caffeineVisuals.js";

test("getCaffeineLevelVisual uses red danger styling at 20 percent and below", () => {
  assert.equal(getCaffeineLevelVisual(20).key, "danger");
  assert.equal(getCaffeineLevelVisual(8).barClass.includes("from-red"), true);
});

test("getCaffeineLevelVisual uses yellow caution styling above 20 through 40 percent", () => {
  assert.equal(getCaffeineLevelVisual(21).key, "caution");
  assert.equal(getCaffeineLevelVisual(40).key, "caution");
  assert.equal(getCaffeineLevelVisual(40).barClass.includes("from-amber"), true);
});

test("getCaffeineLevelVisual uses green max styling at 100 percent", () => {
  assert.equal(getCaffeineLevelVisual(100).key, "max");
  assert.equal(getCaffeineLevelVisual(120).key, "max");
  assert.equal(getCaffeineLevelVisual(100).barClass.includes("from-emerald"), true);
});
