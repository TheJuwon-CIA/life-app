import { Link } from "@tanstack/react-router";
import { Home, Headphones, HeartHandshake, CalendarHeart, User, Pause, Play, X } from "lucide-react";
import type { ReactNode } from "react";
import { formatTime, usePlayer } from "@/components/player-provider";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/messages", label: "Messages", icon: Headphones },
  { to: "/give", label: "Give", icon: HeartHandshake },
  { to: "/counseling", label: "Counsel", icon: CalendarHeart },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-40">
      {children}
      <MiniPlayer />
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
        <ul className="grid grid-cols-5">
          {tabs.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex flex-col items-center gap-1 py-3 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function MiniPlayer() {
  const { current, playing, toggle, progress, duration, close } = usePlayer();
  if (!current) return null;
  const pct = duration ? Math.min(100, (progress / duration) * 100) : 0;

  return (
    <div className="fixed bottom-[68px] left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-border bg-card p-3 shadow-card">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <img
          src={current.cover}
          alt=""
          loading="lazy"
          width={768}
          height={768}
          className="h-11 w-11 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{current.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {formatTime(progress)} / {current.duration}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-warm text-primary-foreground shadow-glow"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={close}
            aria-label="Close player"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-gradient-warm" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}