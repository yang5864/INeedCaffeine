export const HALF_LIFE_HOURS = 5;
export const DAILY_MAX_MG = 400;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getRemainingCaffeine(amountMg, timestamp, now = Date.now(), halfLife = HALF_LIFE_HOURS) {
  if (timestamp > now) return 0;
  const elapsedHours = (now - timestamp) / 1000 / 60 / 60;
  return amountMg * Math.pow(0.5, elapsedHours / halfLife);
}

export function calculateCurrentMg(logs, now = Date.now()) {
  return logs.reduce((total, log) => total + getRemainingCaffeine(log.amountMg, log.timestamp, now), 0);
}

export function getCaffeinePercent(currentMg, dailyMaxMg = DAILY_MAX_MG) {
  return clamp((currentMg / dailyMaxMg) * 100, 0, 100);
}

export function getEnergyState(percent) {
  if (percent >= 80) {
    return {
      key: "high",
      label: "MAX",
      mood: "최고!",
      glow: "from-white via-cyan-200 to-sky-200",
    };
  }

  if (percent >= 60) {
    return {
      key: "good",
      label: "GOOD",
      mood: "좋음",
      glow: "from-cyan-100 via-white to-blue-100",
    };
  }

  if (percent >= 40) {
    return {
      key: "normal",
      label: "NORMAL",
      mood: "집중 중",
      glow: "from-white via-sky-100 to-white",
    };
  }

  if (percent >= 20) {
    return {
      key: "low",
      label: "LOW",
      mood: "졸림",
      glow: "from-white via-blue-100 to-indigo-100",
    };
  }

  return {
    key: "empty",
    label: "EMPTY",
    mood: "방전",
    glow: "from-slate-50 via-sky-100 to-white",
  };
}

export function estimateBpm(percent) {
  return 68 + Math.round(percent * 0.15);
}
