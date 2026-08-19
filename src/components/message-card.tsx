import { Download, Check, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { usePlayer } from "@/components/player-provider";
import type { Message } from "@/lib/church-data";

export function MessageCard({ message }: { message: Message }) {
  const { current, playing, play, toggle, downloads, download } = usePlayer();
  const isCurrent = current?.id === message.id;
  const saved = downloads.includes(message.id);

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
        <img
          src={message.cover}
          alt={`${message.title} cover art`}
          loading="lazy"
          width={768}
          height={768}
          className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{message.series}</p>
          <h3 className="truncate text-base font-bold tracking-tight">{message.title}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {message.speaker} · {message.date} · {message.duration}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => (isCurrent ? toggle() : play(message))}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-warm px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow"
            >
              {isCurrent && playing ? (
                <>
                  <Pause className="h-3.5 w-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" /> Stream
                </>
              )}
            </button>
            <a
              href={message.audioUrl}
              download
              onClick={() => {
                download(message);
                toast.success("Saved for offline listening");
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground"
            >
              {saved ? <Check className="h-3.5 w-3.5 text-primary" /> : <Download className="h-3.5 w-3.5" />}
              {saved ? "Saved" : "Download"}
            </a>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{message.description}</p>
    </article>
  );
}