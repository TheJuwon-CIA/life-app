import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, HeartHandshake, CalendarHeart, Radio, Download, Headphones, ArrowRight } from "lucide-react";
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
      <header className="relative h-[64vh] min-h-[440px] overflow-hidden bg-secondary">
        <img
          src={hero}
          alt="Congregation worshipping together"
          width={1024}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-deep" />
        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <Radio className="h-4 w-4" /> Live Place
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{latest.series}</p>
            <h1 className="mt-2 text-4xl font-bold leading-[1.05] tracking-tight text-overlay-foreground">
              {latest.title}
            </h1>
            <p className="mt-3 text-sm font-medium text-overlay-muted">
              {latest.speaker} · {latest.duration}
            </p>
            <button
              onClick={() => play(latest)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-warm px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Play className="h-4 w-4 fill-current" /> Play latest message
            </button>
          </div>
        </div>
      </header>

      <section className="px-4 pt-6" aria-labelledby="about-live-place">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Welcome
          </div>
          <h2 id="about-live-place" className="mt-3 text-2xl font-bold tracking-tight">
            Church in your pocket
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Stream every message the moment it drops, save favourites for offline listening, give in a few taps, and
            book a private counseling session with a pastor.
          </p>
          <ul className="mt-5 grid gap-3 text-sm">
            <li className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-muted">
                <Headphones className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              Stream sermons and full series on demand
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-muted">
                <Download className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              Download for offline, data-free listening
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-muted">
                <HeartHandshake className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              Give securely, one-time or monthly
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-muted">
                <CalendarHeart className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              Book confidential pastoral counseling
            </li>
          </ul>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-4 pt-4">
        <Link
          to="/give"
          className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-colors hover:border-primary/30"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10">
            <HeartHandshake className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-4 text-sm font-semibold">Give offering</p>
          <p className="text-xs text-muted-foreground">Tithe, missions, building</p>
          <ArrowRight className="mt-3 h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
        <Link
          to="/counseling"
          className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-colors hover:border-primary/30"
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10">
            <CalendarHeart className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-4 text-sm font-semibold">Book counseling</p>
          <p className="text-xs text-muted-foreground">Private session with a pastor</p>
          <ArrowRight className="mt-3 h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      </section>

      <section className="px-4 pt-8">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold tracking-tight">Recent messages</h2>
          <Link to="/messages" className="text-xs font-semibold text-primary">
            See all
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {messages.slice(0, 2).map((m) => (
            <MessageCard key={m.id} message={m} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
