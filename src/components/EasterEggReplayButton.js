import { createElement } from "react";
import { PlayCircle } from "lucide-react";

export default function EasterEggReplayButton({ visible = true, onClick }) {
  if (!visible) return null;

  return createElement(
    "button",
    {
      type: "button",
      "aria-label": "이스터에그 재생하기",
      onClick,
      className:
        "absolute left-7 top-7 z-20 inline-flex h-14 items-center gap-2 rounded-full border border-white/35 bg-white/20 px-4 text-sm font-black text-white shadow-soft backdrop-blur-xl transition hover:bg-white/30 active:scale-[0.98] sm:px-5",
    },
    createElement(PlayCircle, {
      className: "h-6 w-6 shrink-0 drop-shadow",
      "aria-hidden": "true",
    }),
    createElement("span", { className: "drop-shadow" }, "이스터에그 재생하기"),
  );
}
