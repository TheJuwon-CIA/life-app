import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  Download,
  HeartHandshake,
  CalendarHeart,
  Bell,
  LogOut,
  ChevronRight,
  Pencil,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { usePlayer } from "@/components/player-provider";
import { supabase } from "@/integrations/supabase/client";
import { messages } from "@/lib/church-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Live Place" },
      {
        name: "description",
        content:
          "See your Live Place membership details, saved messages, giving history and counseling sessions.",
      },
      { property: "og:title", content: "My Profile — Live Place" },
      {
        property: "og:description",
        content: "Your saved messages, giving history and counseling sessions in one place.",
      },
    ],
  }),
  component: Profile,
});

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

function Profile() {
  const { downloads } = usePlayer();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const saved = messages.filter((m) => downloads.includes(m.id));

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, campus, created_at")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: bookings } = useQuery({
    queryKey: ["bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, counselor_name, session_date, session_time, mode")
        .order("session_date", { ascending: true });
      return data ?? [];
    },
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    toast.success("You've been signed out.");
    navigate({ to: "/auth", replace: true });
  }

  const name = profile?.full_name?.trim() || user?.email?.split("@")[0] || "Guest";
  const since = profile?.created_at
    ? `Member since ${new Date(profile.created_at).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })}`
    : "Signed in as a guest";

  const activity = [
    { icon: Download, label: "Saved messages", value: `${saved.length}` },
    { icon: CalendarHeart, label: "Counseling sessions", value: `${bookings?.length ?? 0} booked` },
    { icon: HeartHandshake, label: "Giving", value: "View history" },
  ];

  return (
    <AppShell>
      <header className="px-4 pt-8">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl">Profile</h1>
          <Link
            to="/settings"
            aria-label="Open settings"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-card"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>

        <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-card">
          {user ? (
            <>
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-warm text-xl font-semibold text-primary-foreground">
                  {initials(name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <p className="mt-1 truncate text-xs text-primary">
                    {profile?.campus ?? "Live Place · Lekki Campus"}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{since}</p>
              <Link
                to="/settings"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit profile
              </Link>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">You're browsing as a guest</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to keep your saved messages and counseling bookings synced across all your
                devices.
              </p>
              <Link
                to="/auth"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-warm px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" /> Sign in or create account
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="px-4 pt-6">
        <h2 className="text-xl">Your journey</h2>
        <div className="mt-3 space-y-2">
          {activity.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-sm">{label}</span>
              <span className="shrink-0 text-sm font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {user && (
        <section className="px-4 pt-6">
          <h2 className="text-xl">Your journey</h2>
          <div className="mt-3 space-y-2">
            {activity.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-sm">{label}</span>
                <span className="shrink-0 text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 pt-6">
        <div className="flex items-end justify-between">
          <h2 className="text-xl">Saved messages</h2>
          <Link to="/messages" className="text-xs font-semibold text-primary">
            Browse all
          </Link>
        </div>
        {saved.length === 0 ? (
          <p className="mt-3 rounded-3xl border border-border bg-card p-5 text-sm text-muted-foreground">
            You haven't downloaded any messages yet. Tap Download on any message to keep it for
            offline listening.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {saved.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
              >
                <img
                  src={m.cover}
                  alt=""
                  loading="lazy"
                  width={768}
                  height={768}
                  className="h-11 w-11 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.speaker} · {m.duration}
                  </p>
                </div>
                <Download className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="px-4 pt-6">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card"
        >
          <Settings className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <span className="flex-1 text-sm font-semibold">Settings & preferences</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Link>
        {user && !loading && (
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-border p-4 text-left active:bg-muted"
          >
            <LogOut className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
            <span className="flex-1 text-sm font-semibold text-destructive">Sign out</span>
          </button>
        )}
      </section>
    </AppShell>
  );
}