import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Headphones, Download, HeartHandshake, CalendarHeart, ArrowRight, Radio } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero-worship.jpg";
import cover1 from "@/assets/cover-1.jpg";
import cover2 from "@/assets/cover-2.jpg";
import cover3 from "@/assets/cover-3.jpg";
import { completeOnboarding } from "@/lib/onboarding";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get Started — Live Place" },
      {
        name: "description",
        content:
          "Welcome to Live Place. Stream and download messages, give your offering and book pastoral counseling.",
      },
      { property: "og:title", content: "Get Started — Live Place" },
      {
        property: "og:description",
        content: "A quick tour of Live Place: messages, giving and counseling in one app.",
      },
    ],
  }),
  component: Onboarding,
});

const slides = [
  {
    image: cover1,
    icon: Headphones,
    eyebrow: "Never miss a word",
    title: "Stream every message the moment it drops",
    body: "Full series, guest ministrations and Sunday messages, ready to play the second you open the app.",
  },
  {
    image: cover2,
    icon: Download,
    eyebrow: "Listen anywhere",
    title: "Download for offline, data-free listening",
    body: "Save messages to your phone and keep listening on the commute, on a flight or with no signal at all.",
  },
  {
    image: cover3,
    icon: HeartHandshake,
    eyebrow: "Give with ease",
    title: "Tithe and offering in a few taps",
    body: "Give one-time or monthly to tithe, missions and the building fund, and keep every receipt in one place.",
  },
  {
    image: hero,
    icon: CalendarHeart,
    eyebrow: "You are not alone",
    title: "Book confidential pastoral counseling",
    body: "Pick a pastor, choose a time that works for you, and have a private conversation that stays private.",
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const last = step === slides.length;

  function finish() {
    completeOnboarding(name.trim() || undefined);
    navigate({ to: "/auth" });
  }

  function skip() {
    completeOnboarding(name.trim() || undefined);
    navigate({ to: "/" });
  }

  if (last) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-10 pt-16">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary">
          <Radio className="h-4 w-4" aria-hidden="true" /> Live Place
        </div>
        <h1 className="mt-8 text-3xl leading-tight">Let's set up your account</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Tell us what to call you, then create your account so your downloads, giving and
          counseling bookings stay with you on every device.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            finish();
          }}
        >
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Full name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Nwachukwu"
              className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-warm px-5 py-4 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Continue to sign in <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        <button
          onClick={skip}
          className="mt-6 text-xs font-semibold text-muted-foreground underline"
        >
          Continue as guest
        </button>
      </main>
    );
  }

  const slide = slides[step]!;
  const Icon = slide.icon;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col">
      <div className="relative h-[58vh] min-h-[360px] overflow-hidden">
        <img
          src={slide.image}
          alt=""
          width={768}
          height={768}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-deep" />
        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary">
              <Radio className="h-4 w-4" aria-hidden="true" /> Live Place
            </div>
            <button
              onClick={skip}
              className="text-xs font-semibold text-overlay-muted"
            >
              Skip
            </button>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-warm text-primary-foreground shadow-glow">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>
      </div>

      <section className="flex flex-1 flex-col px-6 pb-10 pt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {slide.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl leading-tight">{slide.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{slide.body}</p>

        <div className="mt-auto pt-8">
          <div className="flex items-center gap-2" aria-hidden="true">
            {slides.map((s, i) => (
              <span
                key={s.eyebrow}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="rounded-full border border-border px-5 py-4 text-sm font-semibold"
              >
                Back
              </button>
            )}
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-warm px-5 py-4 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              {step === slides.length - 1 ? "Get started" : "Next"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
