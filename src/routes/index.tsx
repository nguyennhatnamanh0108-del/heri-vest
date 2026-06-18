import { createFileRoute } from "@tanstack/react-router";
import mangroveImg from "@/assets/mangrove.jpg";
import snowLeopardImg from "@/assets/snow-leopard.jpg";
import redwoodsImg from "@/assets/redwoods.jpg";
import heroImg from "@/assets/hero-valley.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heri-Vest — Save Vietnam's Wild Side" },
      {
        name: "description",
        content:
          "Join the crew funding rangers, scientists and local heroes protecting Vietnam's jungles, oceans and wildlife. Pick a project, chip in, see the impact.",
      },
      { property: "og:title", content: "Heri-Vest — Save Vietnam's Wild Side" },
      {
        property: "og:description",
        content:
          "Fund rangers, scientists and local heroes protecting Vietnam's wild places. Easy to follow, easy to give.",
      },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Index,
});

type Campaign = {
  image: string;
  emoji: string;
  category: string;
  location: string;
  title: string;
  blurb: string;
  raised: number;
  goal: number;
  donors: number;
  daysLeft: number;
  accent: "rice" | "bamboo" | "lacquer";
};

const campaigns: Campaign[] = [
  {
    image: mangroveImg,
    emoji: "🌊",
    category: "Oceans",
    location: "Hạ Long Bay",
    title: "Plant 5,000 Mangrove Saplings",
    blurb:
      "Bring back the coastal forest that shelters baby fish, crabs and seahorses — and keeps villages safe from storms.",
    raised: 14200,
    goal: 20000,
    donors: 412,
    daysLeft: 12,
    accent: "bamboo",
  },
  {
    image: snowLeopardImg,
    emoji: "🐾",
    category: "Wildlife",
    location: "Pù Mát",
    title: "Protect the Mysterious Saola",
    blurb:
      "Fund night patrols and camera traps to defend the 'Asian Unicorn' — one of the rarest animals on Earth.",
    raised: 48900,
    goal: 60000,
    donors: 1102,
    daysLeft: 4,
    accent: "lacquer",
  },
  {
    image: redwoodsImg,
    emoji: "🐘",
    category: "Forests",
    location: "Yok Đôn",
    title: "Give Elephants Their Forest Back",
    blurb:
      "Secure 400 hectares so rescued elephants can roam free, eat wild and live like elephants again.",
    raised: 152000,
    goal: 400000,
    donors: 894,
    daysLeft: 28,
    accent: "rice",
  },
];

const categories = [
  { label: "All", emoji: "✨" },
  { label: "Wildlife", emoji: "🐅" },
  { label: "Oceans", emoji: "🐢" },
  { label: "Forests", emoji: "🌳" },
  { label: "Climate", emoji: "☀️" },
];

const accentBg: Record<Campaign["accent"], string> = {
  rice: "bg-rice",
  bamboo: "bg-bamboo text-cream",
  lacquer: "bg-lacquer text-cream",
};

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `$${n.toLocaleString()}`;

/* ---------- Hand-drawn SVG critters & ornaments ---------- */

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M8 56C8 28 28 8 56 8c0 28-20 48-48 48Z"
        fill="currentColor"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M14 50 50 14" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Sun({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <circle cx="32" cy="32" r="14" fill="currentColor" stroke="#1a1a1a" strokeWidth="3" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 32 + Math.cos(a) * 20;
        const y1 = 32 + Math.sin(a) * 20;
        const x2 = 32 + Math.cos(a) * 30;
        const y2 = 32 + Math.sin(a) * 30;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />;
      })}
    </svg>
  );
}

function Tiger({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <circle cx="60" cy="64" r="40" fill="currentColor" stroke="#1a1a1a" strokeWidth="4" />
      <path d="M28 38l8 14M92 38l-8 14" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 36c4-6 10-6 12 0M78 36c2-6 8-6 12 0" fill="#1a1a1a" />
      <circle cx="48" cy="60" r="4" fill="#1a1a1a" />
      <circle cx="72" cy="60" r="4" fill="#1a1a1a" />
      <path d="M55 76q5 5 10 0" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M60 70l-3 4h6z" fill="#1a1a1a" />
      <path d="M38 50q4-4 8 0M74 50q4-4 8 0M40 70q3 3 6 0M74 70q3 3 6 0" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Turtle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none">
      <ellipse cx="60" cy="60" rx="38" ry="28" fill="currentColor" stroke="#1a1a1a" strokeWidth="4" />
      <path d="M60 32v56M28 60h64M40 38l40 44M80 38l-40 44" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle cx="100" cy="50" r="10" fill="currentColor" stroke="#1a1a1a" strokeWidth="4" />
      <circle cx="104" cy="48" r="2" fill="#1a1a1a" />
      <path d="M22 44l-8-4M22 76l-8 4M98 80l4 8M22 60h-10" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function Wiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 12" className={className} preserveAspectRatio="none">
      <path d="M0 6 Q37 -4 75 6 T150 6 T225 6 T300 6" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------- Page -------------------- */

function Index() {
  return (
    <div className="min-h-screen bg-cream text-ink overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b-4 border-ink bg-rice">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2 font-serif text-2xl font-black text-jungle">
            <span className="grid size-9 place-items-center rounded-full border-[3px] border-ink bg-bamboo text-cream">
              <Leaf className="size-5 text-rice" />
            </span>
            Heri-Vest
          </a>
          <ul className="hidden items-center gap-2 text-sm font-extrabold uppercase tracking-wide md:flex">
            {[
              { href: "#campaigns", label: "Projects" },
              { href: "#impact", label: "Impact" },
              { href: "#process", label: "How it works" },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3 py-1.5 transition hover:bg-jungle hover:text-cream"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#campaigns"
            className="rounded-full border-[3px] border-ink bg-lacquer px-5 py-2.5 text-sm font-black uppercase tracking-wide text-cream shadow-pop-sm transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Donate ❤
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,oklch(0.86_0.17_90/0.55),transparent_55%),radial-gradient(circle_at_85%_70%,oklch(0.55_0.14_150/0.4),transparent_55%)]" />
        <Sun className="pointer-events-none absolute right-10 top-10 size-24 text-rice" />
        <Leaf className="pointer-events-none absolute left-6 top-40 size-16 -rotate-12 text-bamboo" />
        <Leaf className="pointer-events-none absolute bottom-10 right-1/3 hidden size-20 rotate-45 text-jungle md:block" />

        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-cream px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-pop-sm">
              <span className="size-2 animate-pulse rounded-full bg-lacquer" />
              42 live missions · Vietnam
            </span>
            <h1 className="mt-6 font-serif text-6xl font-black leading-[0.95] md:text-7xl lg:text-[5.5rem]">
              Save the <span className="rounded-2xl bg-rice px-3 underline decoration-lacquer decoration-[6px] underline-offset-[10px]">wild</span>{" "}
              side of <span className="italic text-bamboo">Vietnam</span>. 🐾
            </h1>
            <p className="mt-7 max-w-xl text-lg font-bold text-ink/75 md:text-xl">
              Pick a project. Chip in a few bucks. Watch rangers, scientists and local heroes
              protect jungles, reefs and the animals you love.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#campaigns"
                className="rounded-full border-[3px] border-ink bg-jungle px-7 py-4 font-black uppercase tracking-wide text-cream shadow-pop transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                Find a project →
              </a>
              <a
                href="#process"
                className="rounded-full border-[3px] border-ink bg-cream px-7 py-4 font-black uppercase tracking-wide text-ink shadow-pop-sm transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
              >
                How it works
              </a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-bold text-ink/70">
              <div className="flex -space-x-2">
                {["bg-rice", "bg-bamboo", "bg-lacquer", "bg-jungle"].map((c, i) => (
                  <span key={i} className={`grid size-9 place-items-center rounded-full border-[3px] border-ink ${c} text-cream`}>
                    {["🦋", "🐘", "🐢", "🌿"][i]}
                  </span>
                ))}
              </div>
              <span>62,000+ teens & families have backed a mission</span>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="rotate-2 overflow-hidden rounded-[2.5rem] border-4 border-ink bg-cream p-2 shadow-pop-lg transition hover:rotate-0">
              <img
                src={heroImg}
                alt="Misty jungle valley in Vietnam"
                width={1920}
                height={1280}
                className="h-full w-full rounded-[2rem] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 -rotate-6 rounded-2xl border-[3px] border-ink bg-rice px-5 py-4 shadow-pop-sm">
              <div className="font-serif text-3xl font-black">12,400</div>
              <div className="text-[10px] font-black uppercase tracking-widest">Hectares saved 🌳</div>
            </div>
            <div className="absolute -right-4 top-6 rotate-12 rounded-2xl border-[3px] border-ink bg-bamboo px-4 py-3 font-black text-cream shadow-pop-sm">
              100% transparent ✨
            </div>
          </div>
        </div>
      </section>

      {/* Filter strip */}
      <section className="border-y-4 border-ink bg-jungle">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-5">
          <span className="mr-2 text-xs font-black uppercase tracking-widest text-rice">
            Browse:
          </span>
          {categories.map((c, i) => (
            <button
              key={c.label}
              className={
                i === 0
                  ? "rounded-full border-[3px] border-ink bg-rice px-4 py-2 text-sm font-black uppercase tracking-wide text-ink shadow-pop-sm"
                  : "rounded-full border-[3px] border-ink/0 bg-jungle px-4 py-2 text-sm font-black uppercase tracking-wide text-cream/80 transition hover:border-ink hover:bg-cream hover:text-ink"
              }
            >
              <span className="mr-1">{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Campaigns */}
      <section id="campaigns" className="relative mx-auto max-w-7xl px-6 py-24">
        <Leaf className="pointer-events-none absolute right-8 top-12 size-20 rotate-12 text-bamboo/30" />
        <div className="mb-14 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-rice px-3 py-1 text-[11px] font-black uppercase tracking-widest shadow-pop-sm">
            🔥 Needs help now
          </span>
          <h2 className="mt-4 font-serif text-5xl font-black md:text-6xl">
            Pick your <span className="italic text-bamboo">mission</span>.
          </h2>
          <p className="mt-3 text-lg font-bold text-ink/70">
            Every project is run by real scientists and rangers on the ground. Tap one to dive in.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <article
                key={c.title}
                className="group flex flex-col overflow-hidden rounded-[2rem] border-4 border-ink bg-cream shadow-pop transition hover:-translate-y-1 hover:translate-x-0 hover:shadow-pop-lg"
              >
                <div className="relative aspect-[5/4] overflow-hidden border-b-4 border-ink">
                  <img
                    src={c.image}
                    alt={c.title}
                    width={1200}
                    height={960}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span
                    className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border-[3px] border-ink ${accentBg[c.accent]} px-3 py-1 text-[11px] font-black uppercase tracking-wide shadow-pop-sm`}
                  >
                    {c.emoji} {c.category} · {c.location}
                  </span>
                  <span className="absolute bottom-4 right-4 rounded-full border-[3px] border-ink bg-cream px-3 py-1 text-xs font-black">
                    ⏳ {c.daysLeft} days
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-2xl font-black leading-tight group-hover:text-bamboo">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-ink/70">
                    {c.blurb}
                  </p>
                  <div className="mt-5">
                    <div className="mb-2 flex items-end justify-between">
                      <span className="font-serif text-2xl font-black text-jungle">
                        {fmt(c.raised)}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wide text-ink/60">
                        of {fmt(c.goal)} · {pct}%
                      </span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full border-[3px] border-ink bg-cream">
                      <div
                        className="h-full rounded-full bg-bamboo transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-black">
                      <span className="grid size-8 place-items-center rounded-full border-[3px] border-ink bg-rice">
                        👥
                      </span>
                      {c.donors.toLocaleString()} backers
                    </div>
                    <button className="rounded-full border-[3px] border-ink bg-lacquer px-5 py-2.5 text-sm font-black uppercase tracking-wide text-cream shadow-pop-sm transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
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
      <section id="impact" className="relative overflow-hidden border-y-4 border-ink bg-bamboo text-cream">
        <Sun className="pointer-events-none absolute -left-10 -top-10 size-40 text-rice" />
        <Turtle className="pointer-events-none absolute -bottom-6 right-6 size-48 text-rice md:size-60" />
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-rice px-3 py-1 text-[11px] font-black uppercase tracking-widest text-ink shadow-pop-sm">
              📊 Real impact
            </span>
            <h2 className="mt-4 font-serif text-5xl font-black text-cream md:text-6xl">
              Numbers we're <span className="text-rice">proud</span> of.
            </h2>
            <Wiggle className="mt-3 h-3 w-56 text-rice" />
          </div>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {[
              { v: "$4.2M", l: "Raised so far", e: "💸" },
              { v: "124", l: "Species protected", e: "🐾" },
              { v: "18k", l: "Hectares restored", e: "🌱" },
              { v: "62k", l: "Awesome backers", e: "🙌" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-3xl border-4 border-ink bg-cream p-5 text-ink shadow-pop-sm"
              >
                <div className="text-3xl">{s.e}</div>
                <div className="mt-2 font-serif text-4xl font-black text-jungle md:text-5xl">
                  {s.v}
                </div>
                <div className="mt-1 text-xs font-black uppercase tracking-widest text-ink/70">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="relative mx-auto max-w-7xl px-6 py-24">
        <Tiger className="pointer-events-none absolute -top-4 right-4 hidden size-32 rotate-6 text-rice md:block" />
        <div className="mb-14 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-rice px-3 py-1 text-[11px] font-black uppercase tracking-widest shadow-pop-sm">
            🧭 How it works
          </span>
          <h2 className="mt-4 font-serif text-5xl font-black md:text-6xl">
            Easy as <span className="italic text-bamboo">1-2-3</span>.
          </h2>
          <p className="mt-3 text-lg font-bold text-ink/70">
            No middlemen. No mystery. Just your donation doing the thing.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              n: "1",
              t: "Pick a project",
              d: "Scroll through real missions led by Vietnamese rangers and scientists. Read the plan, the budget, the deadline.",
              bg: "bg-rice",
              emoji: "🔎",
            },
            {
              n: "2",
              t: "Chip in",
              d: "Donate any amount. Funds go straight to the field — no middlemen, no sketchy fees.",
              bg: "bg-bamboo text-cream",
              emoji: "💚",
            },
            {
              n: "3",
              t: "See the proof",
              d: "Get photos, GPS pins and short video updates from the team every month. Watch your money do the work.",
              bg: "bg-lacquer text-cream",
              emoji: "📸",
            },
          ].map((step) => (
            <div
              key={step.n}
              className={`relative flex flex-col gap-3 rounded-[2rem] border-4 border-ink ${step.bg} p-7 shadow-pop transition hover:-translate-y-1`}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-full border-[3px] border-ink bg-cream font-serif text-2xl font-black text-jungle">
                  {step.n}
                </span>
                <span className="text-3xl">{step.emoji}</span>
              </div>
              <h4 className="font-serif text-2xl font-black">{step.t}</h4>
              <p className="text-sm font-semibold leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-ink bg-rice p-10 text-center shadow-pop-lg md:p-16">
          <Leaf className="pointer-events-none absolute -left-6 -top-6 size-28 rotate-12 text-bamboo" />
          <Leaf className="pointer-events-none absolute -bottom-8 -right-6 size-32 -rotate-45 text-jungle" />
          <h3 className="mx-auto max-w-2xl font-serif text-4xl font-black md:text-5xl">
            Ready to help save something <span className="italic text-lacquer">wild</span>?
          </h3>
          <p className="mx-auto mt-4 max-w-lg font-bold text-ink/75">
            $5 plants a tree. $20 funds a ranger patrol. $50 feeds a rescued elephant for a week.
          </p>
          <a
            href="#campaigns"
            className="mt-8 inline-flex rounded-full border-[3px] border-ink bg-jungle px-8 py-4 font-black uppercase tracking-wide text-cream shadow-pop transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Pick a mission 🐾
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-ink bg-jungle py-16 text-cream">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-12 md:flex-row">
            <div className="max-w-sm space-y-4">
              <span className="flex items-center gap-2 font-serif text-2xl font-black">
                <span className="grid size-9 place-items-center rounded-full border-[3px] border-cream bg-rice">
                  <Leaf className="size-5 text-jungle" />
                </span>
                Heri-Vest
              </span>
              <p className="text-sm font-semibold text-cream/75">
                A non-profit crew funding Vietnam's frontline conservation heroes. Built for the
                next generation that actually wants to save this place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-rice">
                  About
                </span>
                <ul className="space-y-3 text-sm font-bold text-cream/80">
                  <li><a href="#" className="hover:text-rice">Our story</a></li>
                  <li><a href="#" className="hover:text-rice">Yearly reports</a></li>
                  <li><a href="#" className="hover:text-rice">Join the team</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-rice">
                  Help
                </span>
                <ul className="space-y-3 text-sm font-bold text-cream/80">
                  <li><a href="#" className="hover:text-rice">FAQ</a></li>
                  <li><a href="#process" className="hover:text-rice">How we vet projects</a></li>
                  <li><a href="#" className="hover:text-rice">Press kit</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t-2 border-cream/15 pt-6 md:flex-row">
            <span className="text-xs font-bold text-cream/60">
              © {new Date().getFullYear()} Heri-Vest · Made with 💚 in Vietnam
            </span>
            <div className="flex gap-6 text-xs font-bold text-cream/60">
              <a href="#" className="hover:text-rice">Privacy</a>
              <a href="#" className="hover:text-rice">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
