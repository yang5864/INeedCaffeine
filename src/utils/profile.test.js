import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_PROFILE, getSensitivityOption, normalizeProfile } from "./profile.js";

test("normalizeProfile keeps valid profile preferences", () => {
  const profile = normalizeProfile({
    displayName: "  Mina  ",
    dailyLimitMg: 208,
    sensitivity: "high",
    muted: true,
    easterEggEnabled: false,
  });

  assert.equal(profile.displayName, "Mina");
  assert.equal(profile.dailyLimitMg, 208);
  assert.equal(profile.sensitivity, "high");
  assert.equal(profile.muted, true);
  assert.equal(profile.easterEggEnabled, false);
});

test("normalizeProfile falls back from unsafe profile values", () => {
  const profile = normalizeProfile({
    displayName: "   ",
    dailyLimitMg: 1200,
    sensitivity: "extreme",
  });

  assert.deepEqual(profile, DEFAULT_PROFILE);
});

test("sensitivity options define caffeine target and decay presets", () => {
  assert.deepEqual(
    ["low", "normal", "high"].map((key) => {
      const option = getSensitivityOption(key);
      return {
        key: option.key,
        dailyLimitMg: option.dailyLimitMg,
        halfLifeHours: option.halfLifeHours,
      };
    }),
    [
      { key: "low", dailyLimitMg: 208, halfLifeHours: 0.75 },
      { key: "normal", dailyLimitMg: 156, halfLifeHours: 1 },
      { key: "high", dailyLimitMg: 104, halfLifeHours: 1.5 },
    ],
  );
});
