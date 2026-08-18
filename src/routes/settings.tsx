import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  Wifi,
  PlayCircle,
  Trash2,
  ShieldCheck,
  FileText,
  Phone,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Live Place" },
      {
        name: "description",
        content:
          "Manage Live Place notifications, playback, download quality and privacy preferences.",
      },
      { property: "og:title", content: "Settings — Live Place" },
      {
        property: "og:description",
        content: "Notifications, playback, downloads and privacy preferences for Live Place.",
      },
    ],
  }),
  component: SettingsPage,
});

type ToggleKey = "sermonAlerts" | "givingReceipts" | "autoplay" | "wifiOnly";

const toggles: { key: ToggleKey; label: string; hint: string; icon: typeof Bell }[] = [
  {
    key: "sermonAlerts",
    label: "New message alerts",
    hint: "Get notified when a sermon drops",
    icon: Bell,
  },
  {
    key: "givingReceipts",
    label: "Giving receipts",
    hint: "Email a receipt after every gift",
    icon: FileText,
  },
  {
    key: "autoplay",
    label: "Autoplay next message",
    hint: "Continue the series automatically",
    icon: PlayCircle,
  },
  {
    key: "wifiOnly",
    label: "Download on Wi-Fi only",
    hint: "Save mobile data",
    icon: Wifi,
  },
];

const qualities = ["Standard", "High", "Lossless"] as const;

function SettingsPage() {
  const [state, setState] = useState<Record<ToggleKey, boolean>>({
    sermonAlerts: true,
    givingReceipts: true,
    autoplay: false,
    wifiOnly: true,
  });
  const [quality, setQuality] = useState<(typeof qualities)[number]>("High");

  return (
    <AppShell>
      <header className="px-4 pt-8">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Profile
        </Link>
        <h1 className="mt-3 text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tune how Live Place notifies you, plays messages and stores downloads.
        </p>
      </header>

      <section className="px-4 pt-6">
        <h2 className="text-xl">Preferences</h2>
        <div className="mt-3 space-y-2">
          {toggles.map(({ key, label, hint, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{label}</p>
                <p className="truncate text-xs text-muted-foreground">{hint}</p>
              </div>
              <button
                role="switch"
                aria-checked={state[key]}
                aria-label={label}
                onClick={() => setState((s) => ({ ...s, [key]: !s[key] }))}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                  state[key] ? "bg-gradient-warm" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-background transition-all ${
                    state[key] ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-xl">Download quality</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {qualities.map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                quality === q
                  ? "bg-gradient-warm text-primary-foreground shadow-glow"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
        <button
          onClick={() => toast.success("Offline downloads cleared")}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-border p-4 text-left"
        >
          <Trash2 className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
          <span className="flex-1 text-sm font-semibold">Clear offline downloads</span>
        </button>
      </section>

      <section className="px-4 pt-6">
        <h2 className="text-xl">Support & legal</h2>
        <div className="mt-3 space-y-2">
          {[
            { icon: Phone, label: "Contact the church office" },
            { icon: ShieldCheck, label: "Privacy policy" },
            { icon: FileText, label: "Terms of use" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-card"
            >
              <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="flex-1 text-sm font-semibold">{label}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Live Place · Version 1.0.0</p>
      </section>
    </AppShell>
  );
}