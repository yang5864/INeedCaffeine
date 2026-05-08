import { motion } from "framer-motion";
import tetzHigh from "../assets/Tetz/100_80_Tetz.png";
import tetzGood from "../assets/Tetz/80_60_Tetz.png";
import tetzNormal from "../assets/Tetz/60_40_Tetz.png";
import tetzLow from "../assets/Tetz/40_20_Tetz.png";
import tetzEmpty from "../assets/Tetz/20_0_Tetz.png";

const mascotImages = {
  high: tetzHigh,
  good: tetzGood,
  normal: tetzNormal,
  low: tetzLow,
  empty: tetzEmpty,
};

export default function Mascot({ percent, state }) {
  const isMax = percent >= 99;

  return (
    <div className="relative mx-auto flex h-[300px] w-full max-w-[580px] items-center justify-center md:h-[350px] lg:h-[360px] lg:max-w-none">
      <motion.div
        className={`absolute h-[70%] w-[70%] rounded-full bg-gradient-to-br ${state.glow} opacity-60 blur-3xl`}
        animate={{
          scale: isMax ? [1, 1.16, 1] : [1, 1.05, 1],
          opacity: isMax ? [0.58, 0.88, 0.58] : [0.48, 0.62, 0.48],
        }}
        transition={{ duration: isMax ? 1.5 : 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {isMax && (
        <motion.div
          className="absolute h-[92%] w-[92%] rounded-full border border-white/55"
          animate={{ scale: [0.82, 1.12], opacity: [0.8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <motion.img
        key={state.key}
        src={mascotImages[state.key]}
        alt={`${state.label} caffeine mascot`}
        className="relative z-10 h-[min(48vh,500px)] max-h-full w-auto max-w-[min(84vw,600px)] select-none object-contain drop-shadow-[0_38px_45px_rgba(30,95,165,0.28)] lg:max-w-[min(36vw,560px)]"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [-6, 6, -6],
          rotate: 0,
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 },
          y: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0 },
        }}
        draggable="false"
      />
    </div>
  );
}
