import assert from "node:assert/strict";
import test from "node:test";
import { parseStoredCaffeineLogs, syncCaffeineLogsSnapshot } from "./caffeineLogs.js";

test("parseStoredCaffeineLogs starts new users with no caffeine logs", () => {
  assert.deepEqual(parseStoredCaffeineLogs(null), []);
  assert.deepEqual(parseStoredCaffeineLogs("[]"), []);
});

test("parseStoredCaffeineLogs keeps valid stored logs", () => {
  const logs = [{ id: "coffee", amountMg: 80, timestamp: 123 }];

  assert.deepEqual(parseStoredCaffeineLogs(JSON.stringify(logs)), logs);
});

test("syncCaffeineLogsSnapshot applies external storage updates once", () => {
  const nextRaw = JSON.stringify([{ id: "test-empty", amountMg: 40, timestamp: 1000 }]);
  const lastRawRef = { current: "" };
  let nextLogs = [];

  const didSync = syncCaffeineLogsSnapshot({
    rawValue: nextRaw,
    lastRawRef,
    onLogsChange: (logs) => {
      nextLogs = logs;
    },
  });

  assert.equal(didSync, true);
  assert.deepEqual(nextLogs, [{ id: "test-empty", amountMg: 40, timestamp: 1000 }]);
  assert.equal(lastRawRef.current, nextRaw);

  const didSyncAgain = syncCaffeineLogsSnapshot({
    rawValue: nextRaw,
    lastRawRef,
    onLogsChange: () => {
      throw new Error("unchanged storage should not sync again");
    },
  });

  assert.equal(didSyncAgain, false);
});
