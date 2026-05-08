import { AnimatePresence, motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddCaffeinePanel from "./components/AddCaffeinePanel.jsx";
import BackgroundBackdrop from "./components/BackgroundBackdrop.jsx";
import BottomDock from "./components/BottomDock.jsx";
import CaffeineDisplay from "./components/CaffeineDisplay.jsx";
import EasterEggOverlay from "./components/EasterEggOverlay.jsx";
import EasterEggReplayButton from "./components/EasterEggReplayButton.js";
import Mascot from "./components/Mascot.jsx";
import ProfilePanel from "./components/ProfilePanel.jsx";
import RecordsPanel from "./components/RecordsPanel.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import StatsView from "./components/StatsView.jsx";
import TodayPanel from "./components/TodayPanel.jsx";
import backgroundHigh from "./assets/backgrounds/100_80_background.png";
import backgroundGood from "./assets/backgrounds/80_60_background.png";
import backgroundNormal from "./assets/backgrounds/60_40_background.png";
import backgroundLow from "./assets/backgrounds/40_20_background.png";
import backgroundEmpty from "./assets/backgrounds/20_0_background.png";
import { useCaffeine } from "./hooks/useCaffeine.js";
import { useProfile } from "./hooks/useProfile.js";
import { shouldReplayEasterEggOnCaffeineAdd } from "./utils/easterEgg.js";
import { getSensitivityOption } from "./utils/profile.js";

const backgroundImages = {
  high: backgroundHigh,
  good: backgroundGood,
  normal: backgroundNormal,
  low: backgroundLow,
  empty: backgroundEmpty,
};

const easterEggVideos = import.meta.glob("./assets/easter-eggs/*.{mp4,webm,mov}", {
  eager: true,
  query: "?url",
  import: "default",
});

const easterEggAudioFiles = import.meta.glob("./assets/easter-eggs/*.{mp3,wav,ogg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const maxCaffeineVideo = Object.entries(easterEggVideos).sort(([a], [b]) => a.localeCompare(b))[0]?.[1] ?? "";
const maxCaffeineAudio =
  easterEggAudioFiles["./assets/easter-eggs/caffeine-max.mp3"] ??
  Object.entries(easterEggAudioFiles).sort(([a], [b]) => a.localeCompare(b))[0]?.[1] ??
  "";

export default function App() {
  const { profile, updateProfile } = useProfile();
  const sensitivity = getSensitivityOption(profile.sensitivity);
  const caffeine = useCaffeine(profile.dailyLimitMg, sensitivity.halfLifeHours);
  const [particles, setParticles] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [toast, setToast] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const previousPercentRef = useRef(caffeine.percent);
  const maxEventArmedRef = useRef(caffeine.percent < 99.5);

  useEffect(() => {
    const previousPercent = previousPercentRef.current;

    if (caffeine.percent < 99.5) {
      maxEventArmedRef.current = true;
    }

    if (
      profile.easterEggEnabled &&
      maxEventArmedRef.current &&
      previousPercent < 99.5 &&
      Math.round(caffeine.percent) >= 100
    ) {
      maxEventArmedRef.current = false;
      setShowEasterEgg(true);
    }

    previousPercentRef.current = caffeine.percent;
  }, [caffeine.percent, profile.easterEggEnabled]);

  function handleAdd(amountMg, source = "button") {
    const shouldReplayEasterEgg = shouldReplayEasterEggOnCaffeineAdd({
      currentPercent: caffeine.percent,
      easterEggEnabled: profile.easterEggEnabled,
    });

    caffeine.addCaffeine(amountMg);
    const particle = {
      id: `${Date.now()}-${Math.random()}`,
      amountMg,
      source,
    };

    setParticles((current) => [...current, particle]);
    window.setTimeout(() => {
      setParticles((current) => current.filter((item) => item.id !== particle.id));
    }, 1100);

    if (shouldReplayEasterEgg) {
      setShowEasterEgg(true);
    }
  }

  function handleNavigate(tab) {
    setActiveTab(tab);
    if (tab === "home" || tab === "stats" || tab === "records" || tab === "profile") {
      setToast("");
    }
  }

  const isBrightBackground = caffeine.state.key === "high";

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-sky-400 text-white ${
        isBrightBackground ? "bright-background" : ""
      }`}
    >
      <BackgroundBackdrop backgroundImages={backgroundImages} activeKey={caffeine.state.key} />

      <section className="relative z-10 flex h-screen items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.985, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-screen min-h-[620px] w-full max-w-[1480px] flex-col overflow-hidden lg:min-h-[640px]"
        >
          <EasterEggReplayButton visible={activeTab === "home"} onClick={() => setShowEasterEgg(true)} />

          <button
            type="button"
            aria-label="settings"
            onClick={() => setSettingsOpen((current) => !current)}
            className="absolute right-7 top-7 z-20 grid h-14 w-14 place-items-center rounded-full border border-white/35 bg-white/20 text-white shadow-soft backdrop-blur-xl transition hover:bg-white/30"
          >
            <Settings className="h-7 w-7 drop-shadow" />
          </button>

          <AnimatePresence>
            <SettingsPanel
              open={settingsOpen}
              profile={profile}
              onUpdateProfile={updateProfile}
              onClose={() => setSettingsOpen(false)}
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === "stats" ? (
              <StatsView key="stats" caffeine={caffeine} />
            ) : activeTab === "records" ? (
              <motion.div
                key="records"
                className="relative mb-28 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 pb-3 pt-4 md:px-10 lg:mb-[104px] lg:pl-14 lg:pr-36"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <RecordsPanel
                  logs={caffeine.logs}
                  now={caffeine.now}
                  dailyLimitMg={caffeine.dailyLimitMg}
                  halfLifeHours={caffeine.halfLifeHours}
                />
              </motion.div>
            ) : activeTab === "profile" ? (
              <ProfilePanel
                key="profile"
                caffeine={caffeine}
                profile={profile}
                onUpdateProfile={updateProfile}
              />
            ) : (
              <motion.div
                key="home"
                className="relative flex flex-1 flex-col gap-7 px-6 pb-28 pt-0 md:px-10 lg:block lg:px-14"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <CaffeineDisplay percent={caffeine.percent} />

                <div className="order-2 lg:absolute lg:bottom-[136px] lg:left-[4%] lg:z-20 lg:h-[400px] lg:w-[340px] xl:w-[380px]">
                  <AddCaffeinePanel onAdd={handleAdd} particles={particles} />
                </div>

                <div className="order-1 lg:absolute lg:left-1/2 lg:top-[52%] lg:z-0 lg:w-[min(42vw,620px)] lg:-translate-x-1/2 lg:-translate-y-1/2">
                  <Mascot percent={caffeine.percent} state={caffeine.state} />
                </div>

                <div className="order-3 lg:absolute lg:bottom-[136px] lg:right-[4%] lg:z-20 lg:h-[400px] lg:w-[340px] xl:w-[380px]">
                  <TodayPanel
                    todayTotalMg={caffeine.todayTotalMg}
                    label={caffeine.state.label}
                    mood={caffeine.state.mood}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <BottomDock activeTab={activeTab} onNavigate={handleNavigate} />
        </motion.div>
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="fixed left-1/2 top-8 z-50 -translate-x-1/2 rounded-full border border-white/35 bg-white/20 px-5 py-3 text-sm font-semibold shadow-glass backdrop-blur-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <EasterEggOverlay
        open={showEasterEgg}
        videoSrc={maxCaffeineVideo}
        audioSrc={maxCaffeineAudio}
        muted={profile.muted}
        onClose={() => setShowEasterEgg(false)}
      />
    </main>
  );
}
