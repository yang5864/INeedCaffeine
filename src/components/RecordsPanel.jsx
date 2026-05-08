import { motion } from "framer-motion";
import { CalendarDays, Clock3, Coffee, Flame, Gauge, History } from "lucide-react";
import { buildDailyRecords, buildRecordEntries, buildRecordsSummary } from "../utils/records.js";

const numberFormatter = new Intl.NumberFormat("ko-KR");

function mg(value) {
  return `${numberFormatter.format(value)} mg`;
}

export default function RecordsPanel({ logs, now, dailyLimitMg = 400 }) {
  const days = buildDailyRecords(logs, now);
  const entries = buildRecordEntries(logs, now);
  const summary = buildRecordsSummary(logs, now, dailyLimitMg);
  const recentEntries = entries.slice(0, 10);

  return (
    <motion.section
      key="records-panel"
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto grid w-full max-w-6xl gap-5 rounded-[34px] border border-white/35 bg-white/20 p-6 text-white shadow-glass backdrop-blur-2xl md:p-7 lg:grid-cols-[0.92fr_1.08fr]"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20 shadow-soft">
            <History className="h-6 w-6 text-white" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Records Arcade</p>
            <h2 className="truncate text-3xl font-black tracking-wide drop-shadow-sm md:text-4xl">카페인 기록</h2>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <SummaryTile icon={Coffee} label="총 섭취량" value={mg(summary.allTimeMg)} />
          <SummaryTile icon={Gauge} label="현재 추정" value={mg(summary.currentMg)} />
          <SummaryTile icon={CalendarDays} label="기록 일수" value={`${summary.dayCount}일`} />
          <SummaryTile icon={Flame} label="최고 일일" value={mg(summary.maxDailyMg)} sub={`${summary.maxDailyPercent}%`} />
        </div>

        <div className="mt-5 space-y-3">
          {days.length === 0 ? (
            <EmptyState />
          ) : (
            days.map((day) => <DaySummary key={day.key} day={day} dailyLimitMg={dailyLimitMg} />)
          )}
        </div>
      </div>

      <div className="min-w-0 rounded-[28px] border border-white/24 bg-white/12 p-4 shadow-soft md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Timeline</p>
            <h3 className="text-xl font-black">최근 섭취</h3>
          </div>
          <span className="rounded-full border border-white/24 bg-white/16 px-3 py-1 text-sm font-black text-white/86 shadow-soft">
            {summary.recordCount}회
          </span>
        </div>

        <div className="mt-4 max-h-[390px] space-y-2 overflow-y-auto pr-1">
          {recentEntries.length === 0 ? (
            <EmptyState compact />
          ) : (
            recentEntries.map((entry) => <RecordRow key={entry.id} entry={entry} />)
          )}
        </div>
      </div>
    </motion.section>
  );
}

function SummaryTile({ icon: Icon, label, value, sub }) {
  return (
    <div className="min-w-0 rounded-[24px] border border-white/24 bg-white/14 p-4 shadow-soft">
      <div className="flex items-center gap-2 text-white/75">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate text-sm font-semibold">{label}</span>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <strong className="truncate text-xl font-black text-white">{value}</strong>
        {sub && <span className="pb-0.5 text-sm font-bold text-white/70">{sub}</span>}
      </div>
    </div>
  );
}

function DaySummary({ day, dailyLimitMg }) {
  return (
    <article className="rounded-[24px] border border-white/24 bg-white/12 p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black">{day.dayLabel}</h3>
          <p className="mt-0.5 text-sm font-bold text-white/70">{day.count}번 섭취</p>
        </div>
        <strong className="shrink-0 text-lg font-black">{mg(day.totalMg)}</strong>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white/80"
          style={{ width: `${Math.min(100, (day.totalMg / dailyLimitMg) * 100)}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-bold text-white/68">현재 남은 추정량 {mg(day.currentMg)}</p>
    </article>
  );
}

function RecordRow({ entry }) {
  return (
    <article className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-[22px] border border-white/18 bg-white/12 p-3">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-white/22">
        <Coffee className="h-5 w-5 fill-white/70 text-white" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-base font-black">{mg(entry.amountMg)} 섭취</p>
        <div className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-white/68">
          <Clock3 className="h-3.5 w-3.5 shrink-0" />
          <span>{entry.timeLabel}</span>
        </div>
      </div>
      <div className="text-right">
        <strong className="block text-sm font-black">{mg(entry.remainingMg)}</strong>
        <span className="text-xs font-bold uppercase text-white/58">left</span>
      </div>
    </article>
  );
}

function EmptyState({ compact = false }) {
  return (
    <div className={`grid place-items-center rounded-[24px] border border-white/20 bg-white/12 text-center ${compact ? "min-h-32 p-4" : "min-h-40 p-6"}`}>
      <div>
        <Coffee className="mx-auto h-8 w-8 text-white/75" />
        <p className="mt-3 text-sm font-semibold text-white/78">아직 기록이 없습니다</p>
      </div>
    </div>
  );
}
