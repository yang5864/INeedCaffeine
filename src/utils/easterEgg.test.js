import assert from "node:assert/strict";
import test from "node:test";
import { shouldReplayEasterEggOnCaffeineAdd } from "./easterEgg.js";

test("replays the easter egg when caffeine is already at 100 percent and more is added", () => {
  assert.equal(
    shouldReplayEasterEggOnCaffeineAdd({
      currentPercent: 100,
      easterEggEnabled: true,
    }),
    true,
  );
});

test("does not replay the easter egg below 100 percent or when disabled", () => {
  assert.equal(
    shouldReplayEasterEggOnCaffeineAdd({
      currentPercent: 99,
      easterEggEnabled: true,
    }),
    false,
  );
  assert.equal(
    shouldReplayEasterEggOnCaffeineAdd({
      currentPercent: 100,
      easterEggEnabled: false,
    }),
    false,
  );
});
