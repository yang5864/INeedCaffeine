export function createHoldRepeater({
  repeatMs = 150,
  setIntervalFn = globalThis.setInterval,
  clearIntervalFn = globalThis.clearInterval,
} = {}) {
  let timerId = null;

  return {
    start(callback) {
      if (timerId !== null) return false;

      callback();
      timerId = setIntervalFn(callback, repeatMs);
      return true;
    },
    stop() {
      if (timerId === null) return false;

      clearIntervalFn(timerId);
      timerId = null;
      return true;
    },
  };
}
