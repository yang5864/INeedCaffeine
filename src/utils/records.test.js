import assert from "node:assert/strict";
import test from "node:test";
import { buildDailyRecords, buildRecordEntries, buildRecordsSummary } from "./records.js";

const at = (iso) => new Date(iso).getTime();
const now = at("2026-05-08T12:00:00+09:00");

test("buildRecordEntries sorts caffeine logs newest first with remaining caffeine", () => {
  const entries = buildRecordEntries(
    [
      { id: "morning", amountMg: 100, timestamp: at("2026-05-08T08:00:00+09:00") },
      { id: "yesterday", amountMg: 60, timestamp: at("2026-05-07T21:00:00+09:00") },
      { id: "noon", amountMg: 80, timestamp: at("2026-05-08T11:30:00+09:00") },
    ],
    now,
  );

  assert.deepEqual(
    entries.map((entry) => entry.id),
    ["noon", "morning", "yesterday"],
  );
  assert.equal(entries[0].amountMg, 80);
  assert.equal(entries[0].remainingMg, 57);
  assert.equal(entries[2].timeLabel, "오후 9:00");
});

test("buildDailyRecords groups logs by local day and totals intake", () => {
  const days = buildDailyRecords(
    [
      { id: "first", amountMg: 100, timestamp: at("2026-05-08T08:00:00+09:00") },
      { id: "second", amountMg: 80, timestamp: at("2026-05-08T11:30:00+09:00") },
      { id: "third", amountMg: 60, timestamp: at("2026-05-07T21:00:00+09:00") },
    ],
    now,
  );

  assert.equal(days.length, 2);
  assert.equal(days[0].dayLabel, "오늘");
  assert.equal(days[0].totalMg, 180);
  assert.equal(days[0].count, 2);
  assert.equal(days[1].dayLabel, "어제");
  assert.equal(days[1].totalMg, 60);
  assert.equal(days[1].records[0].id, "third");
});

test("buildRecordsSummary uses the active daily limit for peak percent", () => {
  const summary = buildRecordsSummary(
    [{ id: "only", amountMg: 300, timestamp: at("2026-05-08T08:00:00+09:00") }],
    now,
    600,
  );

  assert.equal(summary.maxDailyMg, 300);
  assert.equal(summary.maxDailyPercent, 50);
});
