import assert from "node:assert/strict";
import test from "node:test";
import { buildBackgroundLayers } from "./backgroundLayers.js";

test("buildBackgroundLayers keeps every background mounted and marks one active", () => {
  const layers = buildBackgroundLayers(
    {
      high: "high.png",
      good: "good.png",
      empty: "empty.png",
    },
    "good",
  );

  assert.deepEqual(layers, [
    { key: "high", src: "high.png", active: false },
    { key: "good", src: "good.png", active: true },
    { key: "empty", src: "empty.png", active: false },
  ]);
});

test("buildBackgroundLayers falls back to the first layer when state key is missing", () => {
  const layers = buildBackgroundLayers(
    {
      high: "high.png",
      low: "low.png",
    },
    "unknown",
  );

  assert.equal(layers[0].active, true);
  assert.equal(layers[1].active, false);
});
