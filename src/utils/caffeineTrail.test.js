import assert from "node:assert/strict";
import test from "node:test";
import { buildCaffeineProjection, buildCaffeineTrailPath } from "./caffeineTrail.js";

test("buildCaffeineProjection predicts hourly caffeine decay", () => {
  const now = 1_000_000;
  const logs = [{ id: "coffee", amountMg: 156, timestamp: now }];

  const projection = buildCaffeineProjection(logs, now, 156, 2);

  assert.equal(projection.length, 3);
  assert.deepEqual(
    projection.map((point) => ({ label: point.label, mg: Math.round(point.mg), percent: Math.round(point.percent) })),
    [
      { label: "NOW", mg: 156, percent: 100 },
      { label: "+1h", mg: 78, percent: 50 },
      { label: "+2h", mg: 39, percent: 25 },
    ],
  );
});

test("buildCaffeineProjection uses the selected half-life", () => {
  const now = 1_000_000;
  const logs = [{ id: "coffee", amountMg: 156, timestamp: now }];

  const relaxedProjection = buildCaffeineProjection(logs, now, 156, 1, 0.75);
  const sensitiveProjection = buildCaffeineProjection(logs, now, 156, 1, 1.5);

  assert.equal(Math.round(relaxedProjection[1].mg), 62);
  assert.equal(Math.round(sensitiveProjection[1].mg), 98);
});

test("buildCaffeineTrailPath maps projection to an svg curve", () => {
  const projection = [
    { percent: 100 },
    { percent: 50 },
    { percent: 25 },
  ];

  const { path, areaPath, points } = buildCaffeineTrailPath(projection, { width: 200, height: 100, padding: 10 });

  assert.deepEqual(points, [
    { x: 10, y: 10 },
    { x: 100, y: 50 },
    { x: 190, y: 70 },
  ]);
  assert.equal(path, "M 10 10 C 55 10, 55 50, 100 50 C 145 50, 145 70, 190 70");
  assert.equal(areaPath, "M 10 10 C 55 10, 55 50, 100 50 C 145 50, 145 70, 190 70 L 190 90 L 10 90 Z");
});
