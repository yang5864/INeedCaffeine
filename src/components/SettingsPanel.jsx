import { motion } from "framer-motion";
import { BellOff, Sparkles, Volume2, VolumeX, X } from "lucide-react";

export default function SettingsPanel({ open, profile, onUpdateProfile, onClose }) {
  if (!open) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-7 top-24 z-50 w-[min(88vw,360px)] rounded-[30px] border border-white/35 bg-sky-950/36 p-5 text-white shadow-glass backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Settings</p>
          <h2 className="mt-1 text-2xl font-black">앱 설정</h2>
        </div>
        <button
          type="button"
          aria-label="close settings"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/24 bg-white/14 transition hover:bg-white/22"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <SettingToggle
          active={!profile.muted}
          iconOn={Volume2}
          iconOff={VolumeX}
          title="사운드"
          description={profile.muted ? "음소거 중" : "효과음 켜짐"}
          onClick={() => onUpdateProfile({ muted: !profile.muted })}
        />
        <SettingToggle
          active={profile.easterEggEnabled}
          iconOn={Sparkles}
          iconOff={BellOff}
          title="이스터에그"
          description={profile.easterEggEnabled ? "100% 연출 켜짐" : "100% 연출 꺼짐"}
          onClick={() => onUpdateProfile({ easterEggEnabled: !profile.easterEggEnabled })}
        />
      </div>
    </motion.aside>
  );
}

function SettingToggle({ active, iconOn: IconOn, iconOff: IconOff, title, description, onClick }) {
  const Icon = active ? IconOn : IconOff;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid w-full grid-cols-[48px_1fr_auto] items-center gap-3 rounded-[24px] border p-3 text-left shadow-soft transition ${
        active ? "border-white/36 bg-white/20" : "border-white/18 bg-sky-950/22 hover:bg-white/12"
      }`}
    >
      <span className="grid h-12 w-12 place-items-center rounded-full bg-white/18">
        <Icon className="h-6 w-6" />
      </span>
      <span className="min-w-0">
        <span className="block text-base font-black">{title}</span>
        <span className="mt-0.5 block text-sm font-bold text-white/66">{description}</span>
      </span>
      <span
        className={`relative h-8 w-14 rounded-full border transition ${
          active ? "border-emerald-100/55 bg-emerald-300/38" : "border-white/24 bg-white/12"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-soft transition ${
            active ? "left-7" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}
