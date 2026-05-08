import { motion } from "framer-motion";
import { Coffee, Laugh, Zap } from "lucide-react";

const rows = [
  { key: "total", label: "총 섭취량", icon: Coffee },
  { key: "energy", label: "에너지 레벨", icon: Zap },
  { key: "mood", label: "기분 상태", icon: Laugh },
];

export default function TodayPanel({ todayTotalMg, label, mood }) {
  const values = {
    total: `${Math.round(todayTotalMg)} mg`,
    energy: label,
    mood,
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col rounded-[34px] border border-white/35 bg-white/20 p-6 text-white shadow-glass backdrop-blur-2xl md:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Live Summary</p>
      <h2 className="mt-1 text-2xl font-black tracking-wide drop-shadow-sm">TODAY</h2>
      <div className="flex flex-1 flex-col justify-center space-y-3">
        {rows.map(({ key, label: rowLabel, icon: Icon }) => (
          <div
            key={key}
            className="grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-[22px] border border-white/18 bg-white/12 px-3 py-2.5 shadow-soft"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/20 shadow-soft">
              <Icon className="h-6 w-6 fill-white/50 text-white" />
            </span>
            <span className="text-base font-bold text-white/86">{rowLabel}</span>
            <strong className="text-base font-black text-white">{values[key]}</strong>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
