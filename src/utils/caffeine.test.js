import assert from "node:assert/strict";
import test from "node:test";
import { HALF_LIFE_HOURS, getRemainingCaffeine } from "./caffeine.js";

test("app caffeine decay uses a faster one hour half-life", () => {
  const timestamp = new Date("2026-05-08T12:00:00+09:00").getTime();
  const oneHourLater = timestamp + 60 * 60 * 1000;

  assert.equal(HALF_LIFE_HOURS, 1);
  assert.equal(Math.round(getRemainingCaffeine(400, timestamp, oneHourLater)), 200);
});
