import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_PROFILE, normalizeProfile } from "./profile.js";

test("normalizeProfile keeps valid profile preferences", () => {
  const profile = normalizeProfile({
    displayName: "  Mina  ",
    dailyLimitMg: 320,
    sensitivity: "high",
    muted: true,
    easterEggEnabled: false,
  });

  assert.equal(profile.displayName, "Mina");
  assert.equal(profile.dailyLimitMg, 320);
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
