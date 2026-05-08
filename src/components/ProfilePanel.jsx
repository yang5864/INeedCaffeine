import { motion } from "framer-motion";
import { BadgeCheck, Gauge, ShieldCheck, SlidersHorizontal, Target, UserRound } from "lucide-react";
import { CAFFEINE_BASELINE_LABEL } from "../utils/caffeine.js";
import { DAILY_LIMIT_RANGE, SENSITIVITY_OPTIONS, getSensitivityOption } from "../utils/profile.js";

export default function ProfilePanel({ caffeine, profile, onUpdateProfile }) {
  const sensitivity = getSensitivityOption(profile.sensitivity);
  const goalPercent = Math.min(100, (caffeine.todayTotalMg / profile.dailyLimitMg) * 100);
  const remainingMg = Math.max(0, profile.dailyLimitMg - Math.round(caffeine.todayTotalMg));
  const avatarInitial = profile.displayName.trim().charAt(0).toUpperCase() || "C";

  const summary = [
    { label: "오늘 목표", value: `${remainingMg}mg 남음`, icon: Target },
    { label: "현재 잔류", value: `${Math.round(caffeine.currentMg)}mg`, icon: Gauge },
    { label: "감소 속도", value: `${sensitivity.halfLifeHours}h`, icon: ShieldCheck },
  ];

  return (
    <motion.section
      key="profile"
      className="relative mb-28 flex min-h-0 flex-1 items-center overflow-hidden px-4 pb-3 pt-4 md:px-10 lg:mb-[104px] lg:pl-14 lg:pr-36"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto grid max-h-full w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[30px] border border-white/35 bg-white/20 p-5 text-white shadow-glass backdrop-blur-2xl md:p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] border border-white/35 bg-white/24 text-3xl font-black shadow-soft">
              {avatarInitial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Tetz Keeper</p>
              <h2 className="mt-1 truncate text-3xl font-black tracking-wide drop-shadow">{profile.displayName}</h2>
            </div>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-bold text-white/78">닉네임</span>
            <div className="mt-2 flex items-center gap-3 rounded-[24px] border border-white/24 bg-white/14 px-4 py-3 shadow-soft">
              <UserRound className="h-5 w-5 text-white/75" />
              <input
                value={profile.displayName}
                onChange={(event) => onUpdateProfile({ displayName: event.target.value })}
                className="w-full bg-transparent text-lg font-bold text-white outline-none placeholder:text-white/45"
                placeholder="닉네임"
                maxLength={24}
              />
            </div>
          </label>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-white/78">일일 카페인 목표</span>
              <strong className="rounded-full border border-white/24 bg-white/16 px-3 py-1 text-sm shadow-soft">
                {profile.dailyLimitMg}mg
              </strong>
            </div>
            <p className="mt-2 text-xs font-bold text-white/62">{CAFFEINE_BASELINE_LABEL}</p>
            <input
              type="range"
              min={DAILY_LIMIT_RANGE.min}
              max={DAILY_LIMIT_RANGE.max}
              step={DAILY_LIMIT_RANGE.step}
              value={profile.dailyLimitMg}
              onChange={(event) => onUpdateProfile({ dailyLimitMg: Number(event.target.value) })}
              className="mt-3 h-3 w-full accent-white"
              aria-label="일일 카페인 목표"
            />
            <div className="mt-2 flex justify-between text-xs font-bold text-white/60">
              <span>{DAILY_LIMIT_RANGE.min}mg</span>
              <span>{DAILY_LIMIT_RANGE.max}mg</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {SENSITIVITY_OPTIONS.map((option) => {
              const active = option.key === profile.sensitivity;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => onUpdateProfile({ sensitivity: option.key, dailyLimitMg: option.dailyLimitMg })}
                  className={`rounded-[20px] border px-3 py-2 text-left shadow-soft transition ${
                    active ? "border-white/55 bg-white/30" : "border-white/18 bg-white/12 hover:bg-white/18"
                  }`}
                >
                  <span className="block text-sm font-black">{option.label}</span>
                  <span className="mt-1 block text-xs font-bold text-white/62">{option.note}</span>
                  <span className="mt-1 block text-xs font-black text-white/78">
                    {option.dailyLimitMg}mg · {option.halfLifeHours}h
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-full">
          <div className="flex w-full flex-col justify-center rounded-[30px] border border-white/35 bg-white/20 p-6 text-white shadow-glass backdrop-blur-2xl md:p-8">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Personal Meter</p>
                <h3 className="mt-1 text-2xl font-black">내 카페인 프로필</h3>
              </div>
              <SlidersHorizontal className="h-8 w-8 text-white/85" />
            </div>

            <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-3">
              {summary.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-[24px] border border-white/24 bg-white/16 p-5 shadow-soft">
                  <Icon className="h-6 w-6 text-white/88" />
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-white/64">{label}</p>
                  <strong className="mt-1 block text-xl font-black">{value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-[28px] border border-white/24 bg-white/14 p-6 shadow-soft">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white/70">오늘 섭취량</p>
                  <strong className="mt-1 block text-5xl font-black">{Math.round(caffeine.todayTotalMg)}</strong>
                </div>
                <span className="mb-2 text-sm font-bold text-white/72">/ {profile.dailyLimitMg}mg</span>
              </div>
              <div className="mt-5 h-4 overflow-hidden rounded-full bg-white/30">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-white via-cyan-100 to-sky-200"
                  animate={{ width: `${goalPercent}%` }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white/72">
                <BadgeCheck className="h-5 w-5 text-cyan-100" />
                <span>{sensitivity.note} 기준으로 {caffeine.state.mood} 상태</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
