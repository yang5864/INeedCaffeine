import { DAILY_MAX_MG, calculateCurrentMg, getRemainingCaffeine } from "./caffeine.js";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  weekday: "short",
});

function startOfDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function getDayKey(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayLabel(timestamp, now) {
  const dayStart = startOfDay(timestamp);
  const todayStart = startOfDay(now);
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  if (dayStart === todayStart) return "오늘";
  if (dayStart === yesterdayStart) return "어제";
  return dateFormatter.format(new Date(timestamp));
}

function formatKoreanTime(timestamp) {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const displayHour = hour % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${hour < 12 ? "오전" : "오후"} ${displayHour}:${minute}`;
}

export function buildRecordEntries(logs, now = Date.now()) {
  return [...logs]
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((log) => ({
      ...log,
      amountMg: Math.round(log.amountMg),
      remainingMg: Math.round(getRemainingCaffeine(log.amountMg, log.timestamp, now)),
      timeLabel: formatKoreanTime(log.timestamp),
    }));
}

export function buildDailyRecords(logs, now = Date.now()) {
  const entries = buildRecordEntries(logs, now);
  const groups = new Map();

  entries.forEach((entry) => {
    const key = getDayKey(entry.timestamp);
    const existing = groups.get(key) ?? {
      key,
      timestamp: startOfDay(entry.timestamp),
      dayLabel: getDayLabel(entry.timestamp, now),
      totalMg: 0,
      currentMg: 0,
      count: 0,
      records: [],
    };

    existing.totalMg += entry.amountMg;
    existing.currentMg += entry.remainingMg;
    existing.count += 1;
    existing.records.push(entry);
    groups.set(key, existing);
  });

  return [...groups.values()]
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((day) => ({
      ...day,
      totalMg: Math.round(day.totalMg),
      currentMg: Math.round(day.currentMg),
    }));
}

export function buildRecordsSummary(logs, now = Date.now(), dailyLimitMg = DAILY_MAX_MG) {
  const days = buildDailyRecords(logs, now);
  const allTimeMg = logs.reduce((total, log) => total + log.amountMg, 0);
  const currentMg = calculateCurrentMg(logs, now);
  const largestDay = days.reduce((best, day) => (day.totalMg > best.totalMg ? day : best), {
    dayLabel: "-",
    totalMg: 0,
  });

  return {
    dayCount: days.length,
    recordCount: logs.length,
    allTimeMg: Math.round(allTimeMg),
    currentMg: Math.round(currentMg),
    maxDailyMg: Math.round(largestDay.totalMg),
    maxDailyPercent: Math.min(100, Math.round((largestDay.totalMg / dailyLimitMg) * 100)),
    maxDailyLabel: largestDay.dayLabel,
  };
}
