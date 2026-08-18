import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Repeat } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { givingFunds } from "@/lib/church-data";

export const Route = createFileRoute("/give")({
  head: () => ({
    meta: [
      { title: "Give — Offering & Tithe | Live Place" },
      {
        name: "description",
        content: "Give your offering, tithe, missions or building fund gift securely from your phone.",
      },
      { property: "og:title", content: "Give — Offering & Tithe | Live Place" },
      { property: "og:description", content: "Simple, secure giving in a few taps." },
    ],
  }),
  component: GivePage,
});

const presets = [1000, 2500, 5000, 10000];

function GivePage() {
  const [fund, setFund] = useState(givingFunds[0]!.id);
  const [amount, setAmount] = useState("5000");
  const [recurring, setRecurring] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const label = givingFunds.find((f) => f.id === fund)?.label ?? "Offering";
    toast.success(`Thank you! ₦${value.toLocaleString()} ${recurring ? "monthly " : ""}to ${label}`);
  };

  return (
    <AppShell>
      <form onSubmit={submit} className="px-4 pt-8">
        <h1 className="text-3xl">Give</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          “Each one should give what he has decided in his heart.”
        </p>

        <div className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-card">
          <p className="text-xs uppercase tracking-widest text-primary">Amount</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl text-muted-foreground">₦</span>
            <input
              value={amount}
              inputMode="numeric"
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full min-w-0 bg-transparent text-4xl font-semibold outline-none"
              aria-label="Giving amount"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(String(p))}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                  amount === String(p)
                    ? "bg-gradient-warm text-primary-foreground"
                    : "border border-border text-muted-foreground"
                }`}
              >
                ₦{p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <h2 className="mt-7 text-lg">Choose a fund</h2>
        <div className="mt-3 space-y-2">
          {givingFunds.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFund(f.id)}
              className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border p-4 text-left ${
                fund === f.id ? "border-primary bg-muted" : "border-border bg-card"
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{f.label}</span>
                <span className="block truncate text-xs text-muted-foreground">{f.hint}</span>
              </span>
              <span
                className={`h-4 w-4 shrink-0 rounded-full border ${
                  fund === f.id ? "border-primary bg-gradient-warm" : "border-border"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setRecurring((r) => !r)}
          className="mt-4 grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left"
        >
          <Repeat className="h-5 w-5 shrink-0 text-primary" />
          <span className="min-w-0 text-sm font-medium">Make this a monthly gift</span>
          <span
            className={`h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
              recurring ? "bg-gradient-warm" : "bg-secondary"
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-background transition-transform ${
                recurring ? "translate-x-5" : ""
              }`}
            />
          </span>
        </button>

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-glow"
        >
          Give now
        </button>
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" /> Encrypted and receipted to your email
        </p>
      </form>
    </AppShell>
  );
}