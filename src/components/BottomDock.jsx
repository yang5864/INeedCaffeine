import { BarChart3, CalendarDays, Home, UserRound } from "lucide-react";

const items = [
  { key: "home", label: "Home", icon: Home },
  { key: "stats", label: "Stats", icon: BarChart3 },
  { key: "records", label: "Records", icon: CalendarDays },
  { key: "profile", label: "Profile", icon: UserRound },
];

export default function BottomDock({ activeTab, onNavigate }) {
  return (
    <nav className="absolute bottom-4 left-1/2 z-30 w-[min(92%,720px)] -translate-x-1/2 rounded-full border border-white/35 bg-white/20 p-2.5 shadow-glass backdrop-blur-2xl">
      <div className="grid grid-cols-4 gap-2">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              aria-label={label}
              onClick={() => onNavigate(key)}
              className={`grid h-14 place-items-center rounded-full transition ${
                isActive ? "bg-white/30 shadow-soft" : "hover:bg-white/14"
              }`}
            >
              <Icon className={`h-7 w-7 ${isActive ? "text-white" : "text-white/78"}`} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
