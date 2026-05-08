import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DAILY_MAX_MG,
  calculateCurrentMg,
  estimateBpm,
  getCaffeinePercent,
  getEnergyState,
} from "../utils/caffeine";

const STORAGE_KEY = "ineedcaffeine.logs.v1";

function readLogs() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value) {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return [
      {
        id: "demo-maximum-caffeine",
        amountMg: 400,
        timestamp: Date.now(),
      },
    ];
  } catch {
    return [];
  }
}

function writeLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function useCaffeine(dailyLimitMg = DAILY_MAX_MG) {
  const [logs, setLogs] = useState(readLogs);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    writeLogs(logs);
  }, [logs]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const addCaffeine = useCallback((amountMg) => {
    const log = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      amountMg,
      timestamp: Date.now(),
    };

    setLogs((current) => [...current, log]);
    setNow(Date.now());
  }, []);

  const stats = useMemo(() => {
    const currentMg = calculateCurrentMg(logs, now);
    const percent = getCaffeinePercent(currentMg, dailyLimitMg);
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayTotalMg = logs
      .filter((log) => log.timestamp >= todayStart.getTime())
      .reduce((total, log) => total + log.amountMg, 0);

    return {
      currentMg,
      percent,
      todayTotalMg,
      state: getEnergyState(percent),
      bpm: estimateBpm(percent),
    };
  }, [dailyLimitMg, logs, now]);

  return {
    logs,
    now,
    dailyLimitMg,
    addCaffeine,
    ...stats,
  };
}
