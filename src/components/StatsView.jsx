import { motion } from "framer-motion";
import { Clock3, Coffee, Gauge, TimerReset, TrendingDown, Trophy } from "lucide-react";
import { calculateCurrentMg, getCaffeinePercent } from "../utils/caffeine";
import { buildCaffeineProjection, buildCaffeineTrailPath } from "../utils/caffeineTrail.js";

function formatTime(timestamp) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

function getTodayStart(now) {
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  return todayStart.getTime();
}

function getTodayLogs(logs, now) {
  const todayStart = getTodayStart(now);
  return logs.filter((log) => log.timestamp >= todayStart).sort((a, b) => b.timestamp - a.timestamp);
}

function getPeakPercent(logs, now, dailyLimitMg, halfLifeHours) {
  const todayLogs = getTodayLogs(logs, now);
  if (todayLogs.length === 0) return 0;

  return Math.max(
    ...todayLogs.map((log) =>
      getCaffeinePercent(calculateCurrentMg(logs, log.timestamp, halfLifeHours), dailyLimitMg),
    ),
    getCaffeinePercent(calculateCurrentMg(logs, now, halfLifeHours), dailyLimitMg),
  );
}

function getCrashEta(projection) {
  const crashPoint = projection.find((point) => point.percent < 40);
  if (!crashPoint) return "8h+";
  if (crashPoint.hour === 0) return "now";
  return `~${crashPoint.hour}h`;
}

export default function StatsView({ caffeine }) {
  const todayLogs = getTodayLogs(caffeine.logs, caffeine.now);
  const projection = buildCaffeineProjection(
    caffeine.logs,
    caffeine.now,
    caffeine.dailyLimitMg,
    8,
    caffeine.halfLifeHours,
  );
  const trail = buildCaffeineTrailPath(projection, { width: 420, height: 150, padding: 16 });
  const peakPercent = Math.round(
    getPeakPercent(caffeine.logs, caffeine.now, caffeine.dailyLimitMg, caffeine.halfLifeHours),
  );
  const currentMg = Math.round(caffeine.currentMg);
  const remainingToMax = Math.max(0, caffeine.dailyLimitMg - currentMg);
  const crashEta = getCrashEta(projection);

  const headlineStats = [
    { label: "현재 잔류", value: `${currentMg} mg`, icon: Gauge },
    { label: "오늘 컵수", value: `${todayLogs.length}`, icon: Coffee },
    { label: "오늘 피크", value: `${peakPercent}%`, icon: Trophy },
    { label: "크래시 예상", value: crashEta, icon: TimerReset },
  ];

  return (
    <motion.section
      key="stats"
      className="relative mb-28 flex min-h-0 flex-1 items-center overflow-hidden px-4 pb-3 pt-4 md:px-10 lg:mb-[104px] lg:pl-14 lg:pr-36"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto grid max-h-full w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[1.16fr_0.84fr]">
        <div className="rounded-[30px] border border-white/35 bg-white/20 p-5 text-white shadow-glass backdrop-blur-2xl md:p-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Stats Arcade</p>
              <h2 className="mt-1 text-3xl font-black tracking-wide drop-shadow md:text-4xl">CAFFEINE TRAIL</h2>
            </div>
            <div className="rounded-full border border-white/30 bg-white/18 px-4 py-2 text-sm font-bold shadow-soft">
              {caffeine.state.label}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {headlineStats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-[22px] border border-white/24 bg-white/14 p-3.5 shadow-soft">
                <Icon className="h-5 w-5 text-white/90" />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-white/68">{label}</p>
                <strong className="mt-0.5 block text-xl font-black">{value}</strong>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[26px] border border-white/24 bg-white/12 p-4 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white/72">앞으로 8시간</p>
                <h3 className="text-xl font-black">카페인 하강 곡선</h3>
              </div>
              <TrendingDown className="h-7 w-7 text-cyan-100" />
            </div>

            <div className="relative mt-4 h-36 overflow-hidden rounded-[22px] border border-white/16 bg-white/10 px-3 pb-7 pt-2 shadow-[inset_0_1px_18px_rgba(255,255,255,0.08)]">
              <div className="absolute inset-x-4 top-[28%] h-px bg-white/16" />
              <div className="absolute inset-x-4 top-[55%] h-px bg-white/12" />
              <div className="absolute inset-x-4 top-[82%] h-px bg-white/10" />

              <svg
                className="absolute inset-x-3 top-2 h-[112px] w-[calc(100%-1.5rem)] overflow-visible"
                viewBox="0 0 420 150"
                preserveAspectRatio="none"
                role="img"
                aria-label="8시간 카페인 하강 곡선"
              >
                <defs>
                  <linearGradient id="caffeineTrailLine" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
                    <stop offset="52%" stopColor="rgba(186,230,253,0.94)" />
                    <stop offset="100%" stopColor="rgba(103,232,249,0.86)" />
                  </linearGradient>
                  <linearGradient id="caffeineTrailArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
                    <stop offset="100%" stopColor="rgba(103,232,249,0.02)" />
                  </linearGradient>
                  <filter id="caffeineTrailGlow" x="-20%" y="-30%" width="140%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <motion.path
                  d={trail.areaPath}
                  fill="url(#caffeineTrailArea)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45 }}
                />
                <motion.path
                  d={trail.path}
                  fill="none"
                  stroke="url(#caffeineTrailLine)"
                  strokeLinecap="round"
                  strokeWidth="5"
                  filter="url(#caffeineTrailGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
                {trail.points.map((point, index) => (
                  <motion.circle
                    key={projection[index].label}
                    cx={point.x}
                    cy={point.y}
                    r={index === 0 ? 6 : 4.5}
                    fill="white"
                    stroke="rgba(125,211,252,0.95)"
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.045, duration: 0.28 }}
                  />
                ))}
              </svg>

              <div className="absolute inset-x-3 bottom-2 grid grid-cols-9 gap-1">
                {projection.map((point) => (
                  <div key={point.label} className="min-w-0 text-center">
                    <span className="block truncate text-[10px] font-black text-white/72">{point.label}</span>
                    <span className="block truncate text-[10px] font-bold text-white/48">{Math.round(point.percent)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[30px] border border-white/35 bg-white/20 p-5 text-white shadow-glass backdrop-blur-2xl md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">Capacity</p>
                <h3 className="mt-1 text-xl font-black">오늘 여유 슬롯</h3>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 shadow-soft">
                <Coffee className="h-5 w-5 fill-white/50" />
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-end justify-between">
                <strong className="text-4xl font-black">{remainingToMax}</strong>
                <span className="mb-1 text-sm font-bold text-white/72">mg to {caffeine.dailyLimitMg}mg</span>
              </div>
              <div className="mt-3 h-3.5 overflow-hidden rounded-full bg-white/30">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-white via-cyan-100 to-sky-200"
                  animate={{ width: `${caffeine.percent}%` }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/35 bg-white/20 p-5 text-white shadow-glass backdrop-blur-2xl md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">Receipts</p>
                <h3 className="mt-1 text-xl font-black">오늘 마신 기록</h3>
              </div>
              <Clock3 className="h-6 w-6 text-white/85" />
            </div>

            <div className="mt-4 max-h-44 space-y-2 overflow-y-auto pr-1">
              {todayLogs.length > 0 ? (
                todayLogs.slice(0, 8).map((log) => (
                  <div
                    key={log.id}
                    className="grid grid-cols-[40px_1fr_auto] items-center gap-3 rounded-2xl border border-white/18 bg-white/12 px-3 py-2"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20">
                      <Coffee className="h-5 w-5 fill-white/50" />
                    </span>
                    <span className="font-bold">{formatTime(log.timestamp)}</span>
                    <strong>{log.amountMg} mg</strong>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/18 bg-white/12 px-4 py-8 text-center font-bold text-white/72">
                  아직 오늘 기록이 없어요
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
