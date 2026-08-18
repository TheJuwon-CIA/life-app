import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MessageCard } from "@/components/message-card";
import { usePlayer } from "@/components/player-provider";
import { messages } from "@/lib/church-data";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Stream & Download | Live Place" },
      {
        name: "description",
        content: "Browse every Live Place sermon, stream instantly, or download for offline listening.",
      },
      { property: "og:title", content: "Messages — Stream & Download | Live Place" },
      { property: "og:description", content: "Every sermon series, ready to stream or download." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "downloads">("all");
  const { downloads } = usePlayer();

  const list = messages
    .filter((m) => (tab === "downloads" ? downloads.includes(m.id) : true))
    .filter((m) =>
      `${m.title} ${m.speaker} ${m.series}`.toLowerCase().includes(query.trim().toLowerCase()),
    );

  return (
    <AppShell>
      <div className="px-4 pt-8">
        <h1 className="text-3xl">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Listen live, or take them offline with you.</p>

        <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, speaker or series"
            className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-4 flex gap-2">
          {(["all", "downloads"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                tab === t
                  ? "bg-gradient-warm text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {t === "all" ? "All messages" : `Downloads (${downloads.length})`}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {list.length === 0 ? (
            <p className="rounded-3xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              Nothing here yet.
            </p>
          ) : (
            list.map((m) => <MessageCard key={m.id} message={m} />)
          )}
        </div>
      </div>
    </AppShell>
  );
}