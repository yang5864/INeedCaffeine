export const DEFAULT_PROFILE = {
  displayName: "Caffy Keeper",
  dailyLimitMg: 400,
  sensitivity: "normal",
  muted: false,
  easterEggEnabled: true,
};

export const DAILY_LIMIT_RANGE = {
  min: 100,
  max: 600,
  step: 20,
};

export const SENSITIVITY_OPTIONS = [
  { key: "low", label: "느긋함", note: "천천히 반응" },
  { key: "normal", label: "보통", note: "균형 타입" },
  { key: "high", label: "예민함", note: "조심 모드" },
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
