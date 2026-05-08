export function getCaffeineLevelVisual(percent) {
  if (percent >= 100) {
    return {
      key: "max",
      labelClass: "text-emerald-100",
      numberClass: "text-emerald-100 drop-shadow-[0_0_30px_rgba(74,222,128,0.9)]",
      barClass: "from-emerald-300 via-lime-200 to-green-100 shadow-[0_0_24px_rgba(74,222,128,0.95)]",
      flashClass: "bg-emerald-300",
    };
  }

  if (percent <= 20) {
    return {
      key: "danger",
      labelClass: "text-red-100",
      numberClass: "text-red-100 drop-shadow-[0_0_26px_rgba(248,113,113,0.82)]",
      barClass: "from-red-500 via-rose-300 to-orange-200 shadow-[0_0_22px_rgba(248,113,113,0.82)]",
      flashClass: "bg-red-400",
    };
  }

  if (percent <= 40) {
    return {
      key: "caution",
      labelClass: "text-amber-100",
      numberClass: "text-amber-100 drop-shadow-[0_0_26px_rgba(251,191,36,0.82)]",
      barClass: "from-amber-400 via-yellow-200 to-orange-100 shadow-[0_0_22px_rgba(251,191,36,0.8)]",
      flashClass: "bg-amber-300",
    };
  }

  return {
    key: "normal",
    labelClass: "text-cyan-100",
    numberClass: "text-white drop-shadow-[0_6px_22px_rgba(45,122,197,0.35)]",
    barClass: "from-cyan-200 via-sky-100 to-white shadow-[0_0_18px_rgba(255,255,255,0.9)]",
    flashClass: "bg-cyan-200",
  };
}
