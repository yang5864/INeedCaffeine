import { calculateCurrentMg, getCaffeinePercent } from "./caffeine.js";

export function buildCaffeineProjection(logs, now, dailyLimitMg, hours = 8, halfLifeHours) {
  return Array.from({ length: hours + 1 }, (_, index) => {
    const timestamp = now + index * 60 * 60 * 1000;
    const mg = calculateCurrentMg(logs, timestamp, halfLifeHours);

    return {
      hour: index,
      label: index === 0 ? "NOW" : `+${index}h`,
      mg,
      percent: getCaffeinePercent(mg, dailyLimitMg),
    };
  });
}

export function buildCaffeineTrailPath(projection, { width = 320, height = 140, padding = 12 } = {}) {
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const bottom = height - padding;
  const points = projection.map((point, index) => {
    const x = padding + (projection.length === 1 ? 0 : (index / (projection.length - 1)) * chartWidth);
    const y = padding + ((100 - point.percent) / 100) * chartHeight;

    return {
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100,
    };
  });

  if (points.length === 0) {
    return { path: "", areaPath: "", points };
  }

  const path = points.slice(1).reduce((currentPath, point, index) => {
    const previous = points[index];
    const controlOffset = (point.x - previous.x) / 2;
    return `${currentPath} C ${round(previous.x + controlOffset)} ${round(previous.y)}, ${round(point.x - controlOffset)} ${round(point.y)}, ${round(point.x)} ${round(point.y)}`;
  }, `M ${round(points[0].x)} ${round(points[0].y)}`);

  return {
    path,
    areaPath: `${path} L ${round(points.at(-1).x)} ${round(bottom)} L ${round(points[0].x)} ${round(bottom)} Z`,
    points,
  };
}

function round(value) {
  return String(Math.round(value * 100) / 100);
}
