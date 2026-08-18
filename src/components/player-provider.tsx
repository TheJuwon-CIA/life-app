import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/lib/church-data";

type PlayerState = {
  current: Message | null;
  playing: boolean;
  progress: number;
  duration: number;
  downloads: string[];
  play: (m: Message) => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  close: () => void;
  download: (m: Message) => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

const STORAGE_KEY = "liveplace.downloads";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Message | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [downloads, setDownloads] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDownloads(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  // Sync saved messages with the member's account so downloads follow them
  // across devices. Local saves made as a guest are merged up on sign-in.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase.from("saved_messages").select("message_id");
      if (cancelled) return;
      const remote = (data ?? []).map((r) => r.message_id);
      let local: string[] = [];
      try {
        local = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
      } catch {
        local = [];
      }
      const missing = local.filter((id) => !remote.includes(id));
      if (missing.length) {
        await supabase
          .from("saved_messages")
          .upsert(
            missing.map((message_id) => ({ user_id: user.id, message_id })),
            { onConflict: "user_id,message_id" },
          );
      }
      const merged = Array.from(new Set([...remote, ...local]));
      setDownloads(merged);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const play = (m: Message) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (current?.id === m.id) {
      void audio.play();
      setPlaying(true);
      return;
    }
    setCurrent(m);
    audio.src = m.audioUrl;
    void audio.play().then(() => setPlaying(true));
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) {
      void audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = seconds;
  };

  const close = () => {
    audioRef.current?.pause();
    setPlaying(false);
    setCurrent(null);
  };

  const download = (m: Message) => {
    if (user) {
      void supabase
        .from("saved_messages")
        .upsert({ user_id: user.id, message_id: m.id }, { onConflict: "user_id,message_id" });
    }
    setDownloads((prev) => {
      const next = prev.includes(m.id) ? prev : [...prev, m.id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <PlayerContext.Provider
      value={{ current, playing, progress, duration, downloads, play, toggle, seek, close, download }}
    >
      {children}
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}