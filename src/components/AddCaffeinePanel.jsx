import { AnimatePresence, motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createHoldRepeater } from "../utils/holdRepeater.js";

export default function AddCaffeinePanel({ onAdd, particles }) {
  const holdRepeater = useRef(null);
  const [holding, setHolding] = useState(false);

  if (!holdRepeater.current) {
    holdRepeater.current = createHoldRepeater();
  }

  useEffect(() => {
    return () => holdRepeater.current.stop();
  }, []);

  function stopHold() {
    setHolding(false);
    holdRepeater.current.stop();
  }

  function startHold() {
    const started = holdRepeater.current.start(() => onAdd(5, "hold"));
    if (started) setHolding(true);
  }

  return (
    <GlassPanel title="ADD CAFFEINE">
      <div className="relative flex items-center justify-center gap-8 pt-5 md:gap-10 lg:gap-7 xl:gap-9">
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              initial={{
                opacity: 0,
                y: 8,
                scale: 0.78,
                x: particle.source === "sip" ? 92 : -42,
              }}
              animate={{ opacity: [0, 1, 0], y: -84, scale: [0.8, 1, 0.95] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.05, ease: "easeOut" }}
              className="pointer-events-none absolute top-8 z-20 rounded-full border border-white/35 bg-white/30 px-3 py-1 text-sm font-black text-white shadow-soft backdrop-blur-xl"
            >
              +{particle.amountMg}mg
            </motion.span>
          ))}
        </AnimatePresence>

        <motion.button
          type="button"
          onPointerDown={startHold}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          animate={{ scale: holding ? 0.95 : 1 }}
          whileTap={{ scale: 0.94 }}
          className="group relative grid h-40 w-40 place-items-center rounded-full border border-white/35 bg-white/16 shadow-soft backdrop-blur-xl transition hover:bg-white/24 md:h-44 md:w-44"
        >
          <span className="absolute inset-2 rounded-full border border-white/20 bg-white/10" />
          {holding && <span className="absolute inset-0 animate-ripple rounded-full border border-white/60" />}
          <Coffee className="relative h-16 w-16 fill-white/95 text-white drop-shadow" />
        </motion.button>

        <div className="h-24 w-px bg-white/20" />

        <motion.button
          type="button"
          onClick={() => onAdd(10, "sip")}
          whileTap={{ scale: 0.9 }}
          className="grid h-28 w-28 place-items-center rounded-full border border-white/35 bg-white/14 shadow-soft backdrop-blur-xl transition hover:bg-white/24 md:h-32 md:w-32"
        >
          <Coffee className="h-11 w-11 fill-white/95 text-white drop-shadow" />
        </motion.button>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_1px_1fr] items-start gap-5 text-center">
        <div>
          <strong className="text-lg font-black">꾹 누르기</strong>
          <p className="mt-2 text-sm font-bold text-white/72">길게 눌러서 카페인 UP!</p>
        </div>
        <span className="h-12 bg-white/15" />
        <div>
          <strong className="text-lg font-black">한 모금</strong>
          <p className="mt-2 text-sm font-bold text-white/72">한 모금씩 카페인 UP!</p>
        </div>
      </div>
    </GlassPanel>
  );
}

function GlassPanel({ title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, x: -28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col rounded-[34px] border border-white/35 bg-white/20 p-6 text-white shadow-glass backdrop-blur-2xl md:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Controls</p>
      <h2 className="mt-1 text-2xl font-black tracking-wide drop-shadow-sm">{title}</h2>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </motion.section>
  );
}
