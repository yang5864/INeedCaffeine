import assert from "node:assert/strict";
import test from "node:test";
import { createHoldRepeater } from "./holdRepeater.js";

test("hold repeater can start again after it is stopped", () => {
  const intervals = [];
  const cleared = [];
  let ticks = 0;

  const repeater = createHoldRepeater({
    repeatMs: 150,
    setIntervalFn(callback, repeatMs) {
      intervals.push({ callback, repeatMs });
      return `timer-${intervals.length}`;
    },
    clearIntervalFn(timerId) {
      cleared.push(timerId);
    },
  });

  assert.equal(repeater.start(() => ticks += 1), true);
  assert.equal(ticks, 1);
  assert.equal(intervals.length, 1);

  assert.equal(repeater.stop(), true);
  assert.deepEqual(cleared, ["timer-1"]);

  assert.equal(repeater.start(() => ticks += 1), true);
  assert.equal(ticks, 2);
  assert.equal(intervals.length, 2);
  assert.equal(intervals[1].repeatMs, 150);
});

test("hold repeater ignores duplicate starts while active", () => {
  let ticks = 0;
  const repeater = createHoldRepeater({
    setIntervalFn() {
      return "timer";
    },
    clearIntervalFn() {},
  });

  assert.equal(repeater.start(() => ticks += 1), true);
  assert.equal(repeater.start(() => ticks += 1), false);
  assert.equal(ticks, 1);
});
