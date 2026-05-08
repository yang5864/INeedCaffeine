import assert from "node:assert/strict";
import test from "node:test";
import { DAILY_MAX_MG, HALF_LIFE_HOURS, getCaffeinePercent, getRemainingCaffeine } from "./caffeine.js";

test("one Compose Coffee iced americano is the 100 percent caffeine baseline", () => {
  assert.equal(DAILY_MAX_MG, 156);
  assert.equal(getCaffeinePercent(156), 100);
});

test("app caffeine decay uses a faster one hour half-life", () => {
  const timestamp = new Date("2026-05-08T12:00:00+09:00").getTime();
  const oneHourLater = timestamp + 60 * 60 * 1000;

  assert.equal(HALF_LIFE_HOURS, 1);
  assert.equal(Math.round(getRemainingCaffeine(400, timestamp, oneHourLater)), 200);
});

test("caffeine decay respects sensitivity half-life presets", () => {
  const timestamp = new Date("2026-05-08T12:00:00+09:00").getTime();
  const oneHourLater = timestamp + 60 * 60 * 1000;

  assert.equal(Math.round(getRemainingCaffeine(156, timestamp, oneHourLater, 0.75)), 62);
  assert.equal(Math.round(getRemainingCaffeine(156, timestamp, oneHourLater, 1.5)), 98);
});
