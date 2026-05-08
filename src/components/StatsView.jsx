import { motion } from "framer-motion";
import { Clock3, Coffee, Gauge, TimerReset, TrendingDown, Trophy } from "lucide-react";
import { calculateCurrentMg, getCaffeinePercent } from "../utils/caffeine";

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

function buildProjection(logs, now, dailyLimitMg) {
  return Array.from({ length: 9 }, (_, index) => {
    const timestamp = now + index * 60 * 60 * 1000;
    const mg = calculateCurrentMg(logs, timestamp);
    return {
      hour: index,
      label: index === 0 ? "NOW" : `+${index}h`,
      mg,
      percent: getCaffeinePercent(mg, dailyLimitMg),
    };
  });
}

function getPeakPercent(logs, now, dailyLimitMg) {
  const todayLogs = getTodayLogs(logs, now);
  if (todayLogs.length === 0) return 0;

  return Math.max(
    ...todayLogs.map((log) => getCaffeinePercent(calculateCurrentMg(logs, log.timestamp), dailyLimitMg)),
    getCaffeinePercent(calculateCurrentMg(logs, now), dailyLimitMg),
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
  const projection = buildProjection(caffeine.logs, caffeine.now, caffeine.dailyLimitMg);
  const peakPercent = Math.round(getPeakPercent(caffeine.logs, caffeine.now, caffeine.dailyLimitMg));
  const currentMg = Math.round(caffeine.currentMg);
  const remainingToMax = Math.max(0, caffeine.dailyLimitMg - currentMg);
  const crashEta = getCrashEta(projection);
  const maxBar = Math.max(...projection.map((point) => point.percent), 1);

  const headlineStats = [
    { label: "현재 잔류", value: `${currentMg} mg`, icon: Gauge },
    { label: "오늘 컵수", value: `${todayLogs.length}`, icon: Coffee },
    { label: "오늘 피크", value: `${peakPercent}%`, icon: Trophy },
    { label: "크래시 예상", value: crashEta, icon: TimerReset },
  ];

  return (
    <motion.section
      key="stats"
      className="relative mb-28 flex min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4 md:px-10 lg:mb-[116px] lg:px-14"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="rounded-[34px] border border-white/35 bg-white/20 p-6 text-white shadow-glass backdrop-blur-2xl md:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Stats Arcade</p>
              <h2 className="mt-2 text-3xl font-black tracking-wide drop-shadow md:text-5xl">CAFFEINE TRAIL</h2>
            </div>
            <div className="rounded-full border border-white/30 bg-white/18 px-4 py-2 text-sm font-bold shadow-soft">
              {caffeine.state.label}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
            {headlineStats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-[24px] border border-white/24 bg-white/14 p-4 shadow-soft">
                <Icon className="h-6 w-6 text-white/90" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-white/68">{label}</p>
                <strong className="mt-1 block text-2xl font-black">{value}</strong>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] border border-white/24 bg-white/12 p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white/72">앞으로 8시간</p>
                <h3 className="text-xl font-black">카페인 하강 곡선</h3>
              </div>
              <TrendingDown className="h-8 w-8 text-cyan-100" />
            </div>

            <div className="mt-5 flex h-44 items-end gap-2">
              {projection.map((point) => (
                <div key={point.label} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <motion.div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-200/70 via-white/80 to-white shadow-[0_0_22px_rgba(255,255,255,0.35)]"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(8, (point.percent / maxBar) * 100)}%` }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <span className="text-[11px] font-bold text-white/70">{point.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[34px] border border-white/35 bg-white/20 p-6 text-white shadow-glass backdrop-blur-2xl md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">Capacity</p>
                <h3 className="mt-1 text-2xl font-black">오늘 여유 슬롯</h3>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/20 shadow-soft">
                <Coffee className="h-6 w-6 fill-white/50" />
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between">
                <strong className="text-5xl font-black">{remainingToMax}</strong>
                <span className="mb-1 text-sm font-bold text-white/72">mg to {caffeine.dailyLimitMg}mg</span>
              </div>
              <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/30">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-white via-cyan-100 to-sky-200"
                  animate={{ width: `${caffeine.percent}%` }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-white/35 bg-white/20 p-6 text-white shadow-glass backdrop-blur-2xl md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">Receipts</p>
                <h3 className="mt-1 text-2xl font-black">오늘 마신 기록</h3>
              </div>
              <Clock3 className="h-7 w-7 text-white/85" />
            </div>

            <div className="mt-5 max-h-52 space-y-2 overflow-y-auto pr-1">
              {todayLogs.length > 0 ? (
                todayLogs.slice(0, 8).map((log) => (
                  <div
                    key={log.id}
                    className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl border border-white/18 bg-white/12 px-3 py-2.5"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white/20">
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
