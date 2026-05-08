import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getCaffeineLevelVisual } from "../utils/caffeineVisuals.js";

export default function CaffeineDisplay({ percent }) {
  const value = useMotionValue(percent);
  const rounded = useTransform(value, (latest) => Math.round(latest));
  const visual = getCaffeineLevelVisual(percent);
  const previousVisualKey = useRef(visual.key);
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    const controls = animate(value, percent, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [percent, value]);

  useEffect(() => {
    if (previousVisualKey.current !== visual.key) {
      setFlashKey((current) => current + 1);
      previousVisualKey.current = visual.key;
    }
  }, [visual.key]);

  return (
    <header className="relative z-10 mx-auto mt-12 w-full max-w-[520px] px-6 text-center md:mt-10">
      {visual.key === "max" && <MaxCaffeineEffect />}

      {flashKey > 0 && (
        <motion.div
          key={flashKey}
          className={`pointer-events-none fixed inset-0 z-[1] ${visual.flashClass}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.28, 0, 0.22, 0, 0.16, 0] }}
          transition={{ duration: 0.82, ease: "easeInOut" }}
        />
      )}

      <p className={`relative z-10 text-[13px] font-bold uppercase tracking-[0.22em] ${visual.labelClass} drop-shadow-sm`}>
        CAFFEINE LEVEL
      </p>
      <div className={`relative z-10 mt-1 flex items-end justify-center transition-colors duration-300 ${visual.numberClass}`}>
        <motion.strong className="text-[72px] font-black leading-none md:text-[96px]">
          {rounded}
        </motion.strong>
        <span className="mb-3 ml-2 text-[34px] font-black md:mb-4 md:text-[44px]">%</span>
      </div>

      <div className="relative z-10 mx-auto mt-5 h-3 max-w-[330px] overflow-hidden rounded-full bg-white/55 shadow-[inset_0_1px_5px_rgba(255,255,255,0.65)]">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${visual.barClass}`}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </header>
  );
}

function MaxCaffeineEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute left-1/2 top-[18%] h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-300/35 blur-3xl"
        animate={{
          scale: [0.75, 1.28, 0.9, 1.42, 0.82],
          opacity: [0.15, 0.65, 0.2, 0.75, 0.18],
        }}
        transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
      />
      {Array.from({ length: 14 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 rounded-full bg-lime-100 shadow-[0_0_18px_rgba(190,242,100,0.95)]"
          style={{
            left: `${12 + ((index * 17) % 76)}%`,
            top: `${12 + ((index * 29) % 42)}%`,
          }}
          animate={{
            opacity: [0, 1, 0.25, 1, 0],
            scale: [0.35, 1.35, 0.7, 1.6, 0.35],
            y: [0, -18, 4, -26, 0],
          }}
          transition={{
            duration: 1.15 + (index % 4) * 0.18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.045,
          }}
        />
      ))}
    </div>
  );
}
