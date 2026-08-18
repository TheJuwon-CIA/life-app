import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Video, MapPin } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { counselingTopics, counselors, nextDates, timeSlots } from "@/lib/church-data";

export const Route = createFileRoute("/counseling")({
  head: () => ({
    meta: [
      { title: "Book Counseling — Live Place" },
      {
        name: "description",
        content: "Book a private counseling session with a Live Place pastor — in person or by video call.",
      },
      { property: "og:title", content: "Book Counseling — Live Place" },
      { property: "og:description", content: "Confidential pastoral care, booked in under a minute." },
    ],
  }),
  component: CounselingPage,
});

function CounselingPage() {
  const dates = nextDates();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(counselingTopics[0]!);
  const [counselor, setCounselor] = useState(counselors[0]!.id);
  const [date, setDate] = useState(dates[0]!.value);
  const [slot, setSlot] = useState(timeSlots[0]!);
  const [mode, setMode] = useState<"video" | "person">("video");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const who = counselors.find((c) => c.id === counselor)?.name ?? "A pastor";
    const when = dates.find((d) => d.value === date)?.label;
    if (!user) {
      toast.error("Sign in to save your booking across devices.");
      navigate({ to: "/auth" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      topic,
      counselor_id: counselor,
      counselor_name: who,
      session_date: date,
      session_time: slot,
      mode,
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error("Could not save your request. Please try again.");
      return;
    }
    toast.success(`Session requested: ${who} · ${when} at ${slot}`);
    setNotes("");
  };

  return (
    <AppShell>
      <form onSubmit={submit} className="px-4 pt-8">
        <h1 className="text-3xl">Counseling</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A safe, confidential conversation with someone who cares.
        </p>

        <h2 className="mt-6 text-lg">What is this about?</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {counselingTopics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                topic === t
                  ? "bg-gradient-warm text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <h2 className="mt-7 text-lg">Choose a counselor</h2>
        <div className="mt-3 space-y-2">
          {counselors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCounselor(c.id)}
              className={`grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border p-3 text-left ${
                counselor === c.id ? "border-primary bg-muted" : "border-border bg-card"
              }`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-warm text-sm font-bold text-primary-foreground">
                {c.name.split(" ").slice(-1)[0]![0]}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{c.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{c.role}</span>
              </span>
            </button>
          ))}
        </div>

        <h2 className="mt-7 text-lg">Pick a day</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {dates.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDate(d.value)}
              className={`shrink-0 rounded-2xl border px-4 py-3 text-xs font-semibold ${
                date === d.value ? "border-primary bg-muted text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <h2 className="mt-6 text-lg">Time</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {timeSlots.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSlot(t)}
              className={`rounded-2xl border py-3 text-xs font-semibold ${
                slot === t ? "border-primary bg-muted" : "border-border text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("video")}
            className={`flex items-center justify-center gap-2 rounded-2xl border py-3 text-xs font-semibold ${
              mode === "video" ? "border-primary bg-muted" : "border-border text-muted-foreground"
            }`}
          >
            <Video className="h-4 w-4" /> Video call
          </button>
          <button
            type="button"
            onClick={() => setMode("person")}
            className={`flex items-center justify-center gap-2 rounded-2xl border py-3 text-xs font-semibold ${
              mode === "person" ? "border-primary bg-muted" : "border-border text-muted-foreground"
            }`}
          >
            <MapPin className="h-4 w-4" /> At church
          </button>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Anything you'd like your counselor to know beforehand (optional)"
          className="mt-4 w-full rounded-2xl border border-border bg-card p-4 text-sm outline-none placeholder:text-muted-foreground"
        />

        <button
          type="submit"
          disabled={saving}
          className="mt-5 w-full rounded-full bg-gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {saving ? "Requesting…" : "Request session"}
        </button>
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-4 w-4 text-primary" /> Kept strictly confidential
        </p>
      </form>
    </AppShell>
  );
}