import { createFileRoute } from "@tanstack/react-router";
import mangroveAsset from "@/assets/mangrove-real.png.asset.json";
import saolaAsset from "@/assets/saola-real.png.asset.json";
import elephantsAsset from "@/assets/elephants-real.png.asset.json";
import heroImg from "@/assets/hero-valley.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Heri-Vest — Fund Vietnam's Wild Future",
    meta: [
      {
        name: "description",
        content:
          "A modern giving platform for Vietnam's conservation frontlines. Fund rangers, scientists and local heroes protecting jungles, oceans and wildlife.",
      },
      { property: "og:title", content: "Heri-Vest — Fund Vietnam's Wild Future" },
      { property: "og:type", content: "website" },
      {
        property: "og:description",
        content:
          "A modern giving platform for Vietnam's conservation frontlines. Transparent, tracked, and made for the next generation of givers.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Index,
});

type Campaign = {
  image: string;
  focus: string;
  emoji: string;
  category: string;
  location: string;
  title: string;
  blurb: string;
  raised: number;
  goal: number;
  donors: number;
  daysLeft: number;
};

const campaigns: Campaign[] = [
  {
    image: mangroveAsset.url,
    focus: "center 40%",
    emoji: "🌊",
    category: "Oceans",
    location: "Hạ Long Bay",
    title: "Restore 5,000 Mangrove Saplings",
    blurb:
      "Rebuild the coastal forest that shelters juvenile fish and shields fishing villages from storm surges.",
    raised: 0,
    goal: 20000,
    donors: 0,
    daysLeft: 0,
  },
  {
    image: saolaAsset.url,
    focus: "center",
    emoji: "🐾",
    category: "Wildlife",
    location: "Pù Mát",
    title: "Protect the Elusive Saola",
    blurb:
      "Equip anti-poaching night patrols and expand a camera-trap grid for the rarest large mammal on Earth.",
    raised: 0,
    goal: 60000,
    donors: 0,
    daysLeft: 0,
  },
  {
    image: elephantsAsset.url,
    focus: "center 55%",
    emoji: "🐘",
    category: "Forests",
    location: "Yok Đôn",
    title: "Return 400 Hectares to Elephants",
    blurb:
      "Secure protected corridor so rescued Asian elephants can forage, roam, and live in a real wild home.",
    raised: 0,
    goal: 400000,
    donors: 0,
    daysLeft: 0,
  },
];

const categories = [
  { label: "All", emoji: "✦" },
  { label: "Wildlife", emoji: "🐅" },
  { label: "Oceans", emoji: "🐢" },
  { label: "Forests", emoji: "🌳" },
  { label: "Climate", emoji: "☀︎" },
];

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `$${n.toLocaleString()}`;

/* ---------- Light SVG ornaments ---------- */

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M8 56C8 28 28 8 56 8c0 28-20 48-48 48Z"
        fill="currentColor"
      />
      <path d="M14 50 50 14" stroke="oklch(0.24 0.04 160)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function Wiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 12" className={className} preserveAspectRatio="none">
      <path d="M0 6 Q37 -4 75 6 T150 6 T225 6 T300 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------- Page -------------------- */

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2.5 font-serif text-xl font-semibold text-jungle">
            <span className="grid size-8 place-items-center rounded-lg bg-jungle text-cream">
              <Leaf className="size-4 text-rice" />
            </span>
            Heri-Vest
          </a>
          <ul className="hidden items-center gap-1 text-sm font-semibold md:flex">
            {[
              { href: "#campaigns", label: "Projects" },
              { href: "#impact", label: "Impact" },
              { href: "#process", label: "How it works" },
              { href: "#about", label: "About" },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-foreground/70 transition hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-foreground/70 transition hover:text-foreground sm:inline-flex"
            >
              Sign in
            </a>
            <a
              href="#campaigns"
              className="inline-flex items-center gap-1.5 rounded-full bg-jungle px-4 py-2 text-sm font-semibold text-cream transition hover:bg-jungle/90"
            >
              Donate <span className="text-rice">♡</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,oklch(0.88_0.14_92/0.35),transparent_55%),radial-gradient(circle_at_90%_60%,oklch(0.58_0.13_152/0.22),transparent_55%)]" />

        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:py-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-cream px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70">
              <span className="size-1.5 animate-pulse rounded-full bg-lacquer" />
              Launching soon · Vietnam
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              Fund the people saving Vietnam's{" "}
              <span className="relative italic text-bamboo">
                wild places
                <Wiggle className="absolute -bottom-2 left-0 h-2 w-full text-rice" />
              </span>
              .
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">
              A modern giving platform built with rangers, scientists and local NGOs on the ground.
              Pick a project, back it in seconds, and follow every dollar to the field.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#campaigns"
                className="inline-flex items-center gap-2 rounded-full bg-jungle px-6 py-3.5 text-sm font-semibold text-cream shadow-pop transition hover:-translate-y-0.5"
              >
                Browse projects
                <span aria-hidden>→</span>
              </a>
              <a
                href="#process"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-cream px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                How it works
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-foreground/60">
              <div className="flex -space-x-2">
                {["bg-rice", "bg-bamboo", "bg-lacquer", "bg-jungle"].map((c, i) => (
                  <span
                    key={i}
                    className={`grid size-8 place-items-center rounded-full border-2 border-background ${c} text-xs text-cream`}
                  >
                    {["🦋", "🐘", "🐢", "🌿"][i]}
                  </span>
                ))}
              </div>
              <span className="font-semibold">0 givers so far · pre-launch</span>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="overflow-hidden rounded-3xl bg-cream shadow-pop-lg">
              <img
                src={heroImg}
                alt="Misty jungle valley in Vietnam"
                width={1920}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-border bg-cream px-5 py-4 shadow-pop">
              <div className="font-serif text-3xl font-semibold text-jungle">0</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/60">
                Hectares protected
              </div>
            </div>
            <div className="absolute -right-3 top-6 rounded-full bg-rice px-3.5 py-1.5 text-xs font-semibold text-ink shadow-pop-sm">
              ✓ 100% transparent
            </div>
          </div>
        </div>
      </section>

      {/* Filter strip */}
      <section className="border-y border-border bg-muted/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-4">
          <span className="mr-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">
            Filter
          </span>
          {categories.map((c, i) => (
            <button
              key={c.label}
              className={
                i === 0
                  ? "inline-flex items-center gap-1.5 rounded-full bg-jungle px-4 py-1.5 text-sm font-semibold text-cream"
                  : "inline-flex items-center gap-1.5 rounded-full border border-border bg-cream px-4 py-1.5 text-sm font-semibold text-foreground/70 transition hover:border-jungle hover:text-foreground"
              }
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Campaigns */}
      <section id="campaigns" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-rice/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
              Featured missions
            </span>
            <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              Where your money <span className="italic text-bamboo">actually</span> goes.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/70">
              Every project is vetted, budgeted, and led by teams on the ground. Read the plan
              before you give.
            </p>
          </div>
          <a
            href="#"
            className="text-sm font-semibold text-jungle underline-offset-4 hover:underline"
          >
            View launch projects →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <article
                key={c.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-cream transition hover:-translate-y-1 hover:shadow-pop-lg"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    width={1200}
                    height={960}
                    loading="lazy"
                    style={{ objectPosition: c.focus }}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur">
                    <span>{c.emoji}</span>
                    {c.category} · {c.location}
                  </span>
                  <span className="absolute bottom-4 right-4 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-cream backdrop-blur">
                    Pre-launch
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl leading-snug tracking-tight group-hover:text-bamboo">
                    {c.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-foreground/65">
                    {c.blurb}
                  </p>
                  <div className="mt-5">
                    <div className="mb-2 flex items-end justify-between">
                      <span className="font-serif text-2xl font-semibold text-jungle">
                        {fmt(c.raised)}
                      </span>
                      <span className="text-xs font-semibold text-foreground/55">
                        of {fmt(c.goal)} · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-bamboo transition-[width] duration-1000 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
                    <div className="text-xs font-semibold text-foreground/60">
                      <span className="text-foreground">{c.donors.toLocaleString()}</span> backers
                    </div>
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-lacquer px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cream transition hover:bg-lacquer/90">
                      Donate →
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="border-y border-border bg-jungle text-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rice">
                Pre-launch impact
              </span>
              <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
                Numbers we <span className="italic text-rice">stand behind</span>.
              </h2>
              <p className="mt-3 max-w-xl text-cream/70">
                Tracking will begin at launch, with every funded project updated from the field.
              </p>
            </div>
            <a
              href="#"
              className="text-sm font-semibold text-rice underline-offset-4 hover:underline"
            >
              Download 2026 report →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { v: "$0", l: "Deployed to the field" },
              { v: "0", l: "Species protected" },
              { v: "0", l: "Hectares restored" },
              { v: "0", l: "Active backers" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-cream/15 bg-cream/[0.04] p-6 backdrop-blur-sm"
              >
                <div className="font-serif text-4xl font-semibold text-cream md:text-5xl">
                  {s.v}
                </div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-cream/60">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-rice/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
            How it works
          </span>
          <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
            Three steps. <span className="italic text-bamboo">Zero</span> middlemen.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/70">
            Give with confidence. Track your impact from your phone.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Pick a project",
              d: "Browse missions vetted by our science team. Read the plan, budget, timeline, and who's on the ground.",
              emoji: "🔎",
            },
            {
              n: "02",
              t: "Give in seconds",
              d: "Donate any amount with card, Apple Pay, or bank transfer. 96¢ of every dollar reaches the project.",
              emoji: "💚",
            },
            {
              n: "03",
              t: "Follow the impact",
              d: "Get monthly photo, video and GPS updates from the field. See exactly what your donation unlocked.",
              emoji: "📸",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="relative flex flex-col gap-4 rounded-2xl border border-border bg-cream p-7 transition hover:-translate-y-1 hover:shadow-pop"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-semibold tracking-[0.2em] text-foreground/40">
                  {step.n}
                </span>
                <span className="text-2xl">{step.emoji}</span>
              </div>
              <h4 className="font-serif text-2xl tracking-tight">{step.t}</h4>
              <p className="text-sm leading-relaxed text-foreground/65">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section id="about" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-rice p-10 md:p-16">
          <Leaf className="pointer-events-none absolute -right-8 -top-8 size-40 text-bamboo/40" />
          <Leaf className="pointer-events-none absolute -bottom-10 -left-10 size-48 -rotate-45 text-jungle/25" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
              Get started
            </span>
            <h3 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
              Back something wild <span className="italic text-lacquer">this week</span>.
            </h3>
            <p className="mt-4 text-base leading-relaxed text-ink/75">
              $5 plants a tree · $20 funds a ranger patrol · $50 feeds a rescued elephant for a week.
              Every gift is tax-deductible and 100% traceable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#campaigns"
                className="inline-flex items-center gap-2 rounded-full bg-jungle px-6 py-3.5 text-sm font-semibold text-cream shadow-pop transition hover:-translate-y-0.5"
              >
                Pick a mission →
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-cream/80"
              >
                Talk to our team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-ink py-16 text-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-12 md:flex-row">
            <div className="max-w-sm space-y-4">
              <span className="flex items-center gap-2.5 font-serif text-xl font-semibold">
                <span className="grid size-8 place-items-center rounded-lg bg-jungle">
                  <Leaf className="size-4 text-rice" />
                </span>
                Heri-Vest
              </span>
              <p className="text-sm leading-relaxed text-cream/65">
                A modern giving platform funding Vietnam's frontline conservation projects. Built
                with the next generation of givers in mind.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16 sm:grid-cols-3">
              <div className="space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/50">
                  Platform
                </span>
                <ul className="space-y-2.5 text-sm text-cream/75">
                  <li><a href="#campaigns" className="hover:text-rice">Projects</a></li>
                  <li><a href="#impact" className="hover:text-rice">Impact</a></li>
                  <li><a href="#process" className="hover:text-rice">How it works</a></li>
                </ul>
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/50">
                  Company
                </span>
                <ul className="space-y-2.5 text-sm text-cream/75">
                  <li><a href="#" className="hover:text-rice">Our story</a></li>
                  <li><a href="#" className="hover:text-rice">Annual reports</a></li>
                  <li><a href="#" className="hover:text-rice">Careers</a></li>
                </ul>
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/50">
                  Support
                </span>
                <ul className="space-y-2.5 text-sm text-cream/75">
                  <li><a href="#" className="hover:text-rice">FAQ</a></li>
                  <li><a href="#" className="hover:text-rice">Contact</a></li>
                  <li><a href="#" className="hover:text-rice">Press kit</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 md:flex-row">
            <span className="text-xs text-cream/50">
              © {new Date().getFullYear()} Heri-Vest · Made with care in Vietnam
            </span>
            <div className="flex gap-6 text-xs text-cream/50">
              <a href="#" className="hover:text-rice">Privacy</a>
              <a href="#" className="hover:text-rice">Terms</a>
              <a href="#" className="hover:text-rice">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
