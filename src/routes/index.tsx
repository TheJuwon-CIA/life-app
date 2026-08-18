import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, HeartHandshake, CalendarHeart, Radio, Download, Headphones } from "lucide-react";
import { useEffect } from "react";
import hero from "@/assets/hero-worship.jpg";
import { AppShell } from "@/components/app-shell";
import { MessageCard } from "@/components/message-card";
import { usePlayer } from "@/components/player-provider";
import { messages } from "@/lib/church-data";
import { hasOnboarded } from "@/lib/onboarding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Live Place — Listen, Give, Get Counsel" },
      {
        name: "description",
        content:
          "Stream and download Live Place messages, give your offering, and book a counseling session from your phone.",
      },
      { property: "og:title", content: "Live Place — Listen, Give, Get Counsel" },
      {
        property: "og:description",
        content: "Sermons on demand, secure giving, and pastoral counseling in one app.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { play } = usePlayer();
  const latest = messages[0]!;
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (!hasOnboarded()) navigate({ to: "/onboarding", replace: true });
  }, [navigate]);

  return (
    <AppShell>
      <header className="relative h-[62vh] min-h-[420px] overflow-hidden">
        <img
          src={hero}
          alt="Congregation worshipping in golden light"
          width={1024}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-deep" />
        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary">
            <Radio className="h-4 w-4" /> Live Place
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">{latest.series}</p>
            <h1 className="mt-1 text-3xl leading-tight text-overlay-foreground">{latest.title}</h1>
            <p className="mt-2 text-sm text-overlay-muted">
              {latest.speaker} · {latest.duration}
            </p>
            <button
              onClick={() => play(latest)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-warm px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Play className="h-4 w-4" /> Play latest message
            </button>
          </div>
        </div>
      </header>

      <section className="px-4 pt-6" aria-labelledby="about-live-place">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Welcome to Live Place
          </p>
          <h2 id="about-live-place" className="mt-2 text-2xl leading-tight">
            Church in your pocket, every day of the week
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Live Place keeps you connected to the Word wherever life takes you. Stream every
            message the moment it drops, save your favourites for offline listening on the commute,
            give your tithe and offering in a few taps, and book a private counseling session with a
            pastor who will walk with you.
          </p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-primary" aria-hidden="true" /> Stream sermons and
              full series on demand
            </li>
            <li className="flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" aria-hidden="true" /> Download for
              offline, data-free listening
            </li>
            <li className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-primary" aria-hidden="true" /> Give securely,
              one-time or monthly
            </li>
            <li className="flex items-center gap-2">
              <CalendarHeart className="h-4 w-4 text-primary" aria-hidden="true" /> Book confidential
              pastoral counseling
            </li>
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-4 pt-5">
        <Link
          to="/give"
          className="rounded-3xl border border-border bg-card p-4 shadow-card"
        >
          <HeartHandshake className="h-5 w-5 text-primary" />
          <p className="mt-3 text-sm font-semibold">Give offering</p>
          <p className="text-xs text-muted-foreground">Tithe, missions, building</p>
        </Link>
        <Link
          to="/counseling"
          className="rounded-3xl border border-border bg-card p-4 shadow-card"
        >
          <CalendarHeart className="h-5 w-5 text-accent" />
          <p className="mt-3 text-sm font-semibold">Book counseling</p>
          <p className="text-xs text-muted-foreground">Private session with a pastor</p>
        </Link>
      </section>

      <section className="px-4 pt-7">
        <div className="flex items-end justify-between">
          <h2 className="text-xl">Recent messages</h2>
          <Link to="/messages" className="text-xs font-semibold text-primary">
            See all
          </Link>
        </div>
        <div className="mt-3 space-y-3">
          {messages.slice(0, 2).map((m) => (
            <MessageCard key={m.id} message={m} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
