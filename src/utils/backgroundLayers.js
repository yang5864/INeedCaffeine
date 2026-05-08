export function buildBackgroundLayers(backgroundImages, activeKey) {
  const entries = Object.entries(backgroundImages);
  const hasActiveKey = entries.some(([key]) => key === activeKey);
  const fallbackKey = entries[0]?.[0];

  return entries.map(([key, src]) => ({
    key,
    src,
    active: key === (hasActiveKey ? activeKey : fallbackKey),
  }));
}
