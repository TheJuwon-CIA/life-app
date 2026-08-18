import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, Radio, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Live Place" },
      {
        name: "description",
        content:
          "Sign in to Live Place to keep your saved messages, giving and counseling bookings synced across your devices.",
      },
      { property: "og:title", content: "Sign In — Live Place" },
      {
        property: "og:description",
        content: "Create a Live Place account to sync downloads and bookings across devices.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/", replace: true });
  }, [loading, session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name.trim() },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm your account.");
          return;
        }
        toast.success("Welcome to Live Place!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    setBusy(false);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-12 pt-16">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary">
        <Radio className="h-4 w-4" aria-hidden="true" /> Live Place
      </div>
      <h1 className="mt-8 text-3xl leading-tight">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Sign in so your saved messages, giving and counseling bookings follow you on every device.
      </p>

      <button
        type="button"
        onClick={onGoogle}
        disabled={busy}
        className="mt-7 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-5 py-4 text-sm font-semibold shadow-card disabled:opacity-60"
      >
        <span
          aria-hidden="true"
          className="grid h-5 w-5 place-items-center rounded-full bg-muted text-xs font-bold"
        >
          G
        </span>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {mode === "signup" && (
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
        )}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Password
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-warm px-5 py-4 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <>
              {mode === "signup" ? "Create account" : "Sign in"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        className="mt-6 text-xs font-semibold text-primary underline"
      >
        {mode === "signup" ? "I already have an account" : "I need to create an account"}
      </button>

      <Link to="/" className="mt-4 text-xs font-semibold text-muted-foreground underline">
        Continue as guest
      </Link>
    </main>
  );
}