import { DAILY_MAX_MG } from "./caffeine.js";

export const DEFAULT_PROFILE = {
  displayName: "Caffy Keeper",
  dailyLimitMg: DAILY_MAX_MG,
  sensitivity: "normal",
  muted: false,
  easterEggEnabled: true,
};

export const DAILY_LIMIT_RANGE = {
  min: 52,
  max: 312,
  step: 13,
};

export const SENSITIVITY_OPTIONS = [
  { key: "low", label: "느긋함", note: "카페인 잘 안 받는 타입", dailyLimitMg: 208, halfLifeHours: 0.75 },
  { key: "normal", label: "보통", note: "컴포즈 아메리카노 1잔 기준", dailyLimitMg: DAILY_MAX_MG, halfLifeHours: 1 },
  { key: "high", label: "예민함", note: "카페인 잘 받는 타입", dailyLimitMg: 104, halfLifeHours: 1.5 },
];

export function normalizeProfile(value) {
  const source = value && typeof value === "object" ? value : {};
  const displayName =
    typeof source.displayName === "string" ? source.displayName.trim().slice(0, 24) : DEFAULT_PROFILE.displayName;
  const dailyLimitMg = Number(source.dailyLimitMg);
  const sensitivity = SENSITIVITY_OPTIONS.some((option) => option.key === source.sensitivity)
    ? source.sensitivity
    : DEFAULT_PROFILE.sensitivity;

  return {
    displayName: displayName || DEFAULT_PROFILE.displayName,
    dailyLimitMg:
      Number.isFinite(dailyLimitMg) && dailyLimitMg >= DAILY_LIMIT_RANGE.min && dailyLimitMg <= DAILY_LIMIT_RANGE.max
        ? Math.round(dailyLimitMg / DAILY_LIMIT_RANGE.step) * DAILY_LIMIT_RANGE.step
        : DEFAULT_PROFILE.dailyLimitMg,
    sensitivity,
    muted: typeof source.muted === "boolean" ? source.muted : DEFAULT_PROFILE.muted,
    easterEggEnabled:
      typeof source.easterEggEnabled === "boolean" ? source.easterEggEnabled : DEFAULT_PROFILE.easterEggEnabled,
  };
}

export function getSensitivityOption(key) {
  return SENSITIVITY_OPTIONS.find((option) => option.key === key) ?? SENSITIVITY_OPTIONS[1];
}
