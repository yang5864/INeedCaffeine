export function parseStoredCaffeineLogs(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function syncCaffeineLogsSnapshot({ rawValue, lastRawRef, onLogsChange }) {
  const nextRaw = rawValue ?? "";

  if (nextRaw === lastRawRef.current) {
    return false;
  }

  lastRawRef.current = nextRaw;
  onLogsChange(parseStoredCaffeineLogs(nextRaw));
  return true;
}
