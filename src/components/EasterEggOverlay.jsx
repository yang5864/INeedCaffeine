import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Sparkles, Volume2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function EasterEggOverlay({ open, videoSrc, audioSrc, muted, onClose }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [replayKey, setReplayKey] = useState(0);
  const [audioBlocked, setAudioBlocked] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (!open) return;
    setAudioBlocked(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    if (audioRef.current && !muted) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1;
      audioRef.current.play().catch(() => setAudioBlocked(true));
    }
  }, [muted, open, replayKey]);

  useEffect(() => {
    if (open || !audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, [open]);

  function playAudio() {
    if (!audioRef.current || muted) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().then(() => setAudioBlocked(false)).catch(() => setAudioBlocked(true));
  }

  function replay() {
    setReplayKey((current) => current + 1);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-sky-950/45 px-4 text-white backdrop-blur-md md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 16 }).map((_, index) => (
              <motion.span
                key={index}
                className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_22px_rgba(255,255,255,0.9)]"
                style={{
                  left: `${8 + ((index * 19) % 86)}%`,
                  top: `${10 + ((index * 31) % 78)}%`,
                }}
                animate={{
                  y: [0, -22, 0],
                  scale: [0.5, 1.35, 0.5],
                  opacity: [0.15, 0.95, 0.15],
                }}
                transition={{
                  duration: 1.8 + (index % 5) * 0.25,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.07,
                }}
              />
            ))}
          </motion.div>

          <motion.section
            className="relative w-full max-w-[min(96vw,1280px)] overflow-hidden rounded-[38px] border border-white/35 bg-white/18 p-4 shadow-[0_28px_90px_rgba(33,91,168,0.45)] backdrop-blur-2xl md:p-5"
            initial={{ y: 34, scale: 0.92, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 22, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute left-1/2 top-0 h-36 w-2/3 -translate-x-1/2 rounded-full bg-cyan-200/40 blur-3xl" />

            <div className="relative flex items-center justify-between gap-4 px-2 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">Secret Unlocked</p>
                <h2 className="mt-1 text-3xl font-black tracking-wide drop-shadow md:text-5xl">MAX CAFFEINE</h2>
              </div>

              <div className="flex items-center gap-2">
                {audioSrc && !muted && audioBlocked && (
                  <button
                    type="button"
                    onClick={playAudio}
                    aria-label="play sound"
                    className="grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-white/18 shadow-soft backdrop-blur-xl transition hover:bg-white/28"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                )}
                {videoSrc && (
                  <button
                    type="button"
                    onClick={replay}
                    aria-label="replay"
                    className="grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-white/18 shadow-soft backdrop-blur-xl transition hover:bg-white/28"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="close"
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/35 bg-white/18 shadow-soft backdrop-blur-xl transition hover:bg-white/28"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {videoSrc ? (
              <>
                <video
                  key={`video-${replayKey}`}
                  ref={videoRef}
                  src={videoSrc}
                  className="relative aspect-video max-h-[72vh] w-full rounded-[30px] border border-white/20 bg-black/20 object-cover shadow-soft"
                  autoPlay
                  controls
                  muted
                  playsInline
                />
                {audioSrc && <audio key={`audio-${replayKey}`} ref={audioRef} src={audioSrc} preload="auto" />}
              </>
            ) : (
              <div className="relative grid aspect-video max-h-[72vh] place-items-center rounded-[30px] border border-white/20 bg-white/14 shadow-soft">
                <motion.div
                  className="absolute h-56 w-56 rounded-full bg-cyan-200/50 blur-3xl"
                  animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.45, 0.85, 0.45] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="relative grid h-40 w-40 place-items-center rounded-full border border-white/35 bg-white/20 shadow-glass backdrop-blur-xl"
                  animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-16 w-16 fill-white/70 text-white" />
                </motion.div>
              </div>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
