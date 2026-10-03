import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/useSession";

export const Route = createFileRoute("/auth")({
  head: () => ({
    title: "Sign in — Heri-Vest",
    meta: [
      {
        name: "description",
        content:
          "Create your Heri-Vest account or sign in to back Vietnam's conservation projects and follow your impact.",
      },
      { property: "og:title", content: "Sign in — Heri-Vest" },
      { property: "og:type", content: "website" },
      {
        property: "og:description",
        content: "Create your Heri-Vest account or sign in to back Vietnam's conservation projects.",
      },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  useEffect(() => {
    if (!sessionLoading && user) {
      void navigate({ to: "/", replace: true });
    }
  }, [sessionLoading, user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setConfirmSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        void navigate({ to: "/", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,oklch(0.88_0.14_92/0.35),transparent_55%),radial-gradient(circle_at_90%_60%,oklch(0.58_0.13_152/0.22),transparent_55%)]" />

      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2.5 font-serif text-2xl font-semibold text-jungle"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-jungle text-cream">
            <svg viewBox="0 0 64 64" className="size-4 text-rice" fill="none">
              <path d="M8 56C8 28 28 8 56 8c0 28-20 48-48 48Z" fill="currentColor" />
            </svg>
          </span>
          Heri-Vest
        </Link>

        <div className="rounded-3xl border border-border bg-cream p-8 shadow-pop">
          {confirmSent ? (
            <div className="text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-bamboo/15 text-2xl">
                📬
              </div>
              <h1 className="mt-4 font-serif text-2xl tracking-tight">Check your inbox</h1>
              <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                We sent a confirmation link to <span className="font-semibold text-foreground">{email}</span>.
                Click it to activate your account, then come back and sign in.
              </p>
              <button
                onClick={() => {
                  setConfirmSent(false);
                  setMode("signin");
                }}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-jungle px-6 py-3 text-sm font-semibold text-cream transition hover:bg-jungle/90"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-2xl tracking-tight">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-1.5 text-sm text-foreground/65">
                {mode === "signin"
                  ? "Sign in to follow the projects you back."
                  : "Join the next generation of conservation backers."}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/60">
                    Email
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-jungle focus:ring-2 focus:ring-jungle/20"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/60">
                    Password
                  </span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-jungle focus:ring-2 focus:ring-jungle/20"
                  />
                </label>
                <button
                  type="submit"
                  disabled={pending}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-jungle px-6 py-3.5 text-sm font-semibold text-cream shadow-pop transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {pending
                    ? "One moment…"
                    : mode === "signin"
                      ? "Sign in"
                      : "Sign up"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-foreground/65">
                {mode === "signin" ? "New to Heri-Vest?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="font-semibold text-jungle underline-offset-4 hover:underline"
                >
                  {mode === "signin" ? "Create an account" : "Sign in"}
                </button>
              </p>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-foreground/50">
          Protected by Lovable Cloud auth · Your data stays private
        </p>
      </div>
    </div>
  );
}
