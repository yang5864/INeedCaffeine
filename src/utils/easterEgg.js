export function shouldReplayEasterEggOnCaffeineAdd({ currentPercent, easterEggEnabled }) {
  return easterEggEnabled && Math.round(currentPercent) >= 100;
}
