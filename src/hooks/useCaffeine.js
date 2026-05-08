import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DAILY_MAX_MG,
  calculateCurrentMg,
  estimateBpm,
  getCaffeinePercent,
  getEnergyState,
} from "../utils/caffeine";
import { parseStoredCaffeineLogs, syncCaffeineLogsSnapshot } from "../utils/caffeineLogs.js";

const STORAGE_KEY = "ineedcaffeine.logs.v1";
const STORAGE_SYNC_INTERVAL_MS = 500;

function readLogsRaw() {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

function writeLogs(logs) {
  const raw = JSON.stringify(logs);
  localStorage.setItem(STORAGE_KEY, raw);
  return raw;
}

export function useCaffeine(dailyLimitMg = DAILY_MAX_MG, halfLifeHours) {
  const lastRawRef = useRef("");
  const [logs, setLogs] = useState(() => {
    const raw = readLogsRaw();
    lastRawRef.current = raw;
    return parseStoredCaffeineLogs(raw);
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    lastRawRef.current = writeLogs(logs);
  }, [logs]);

  const syncFromStorage = useCallback(() => {
    const didSync = syncCaffeineLogsSnapshot({
      rawValue: readLogsRaw(),
      lastRawRef,
      onLogsChange: setLogs,
    });

    if (didSync) {
      setNow(Date.now());
    }
  }, []);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === STORAGE_KEY || event.key === null) {
        syncFromStorage();
      }
    }

    window.addEventListener("storage", handleStorage);
    const timer = window.setInterval(syncFromStorage, STORAGE_SYNC_INTERVAL_MS);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.clearInterval(timer);
    };
  }, [syncFromStorage]);

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
    const currentMg = calculateCurrentMg(logs, now, halfLifeHours);
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
  }, [dailyLimitMg, halfLifeHours, logs, now]);

  return {
    logs,
    now,
    dailyLimitMg,
    halfLifeHours,
    addCaffeine,
    ...stats,
  };
}
