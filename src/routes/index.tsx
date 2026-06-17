import { createFileRoute } from "@tanstack/react-router";
import mangroveImg from "@/assets/mangrove.jpg";
import snowLeopardImg from "@/assets/snow-leopard.jpg";
import redwoodsImg from "@/assets/redwoods.jpg";
import heroImg from "@/assets/hero-valley.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heri-Vest — Crowdfunding for Conservation" },
      {
        name: "description",
        content:
          "Direct funding for frontline conservationists restoring fragile ecosystems and protecting endangered species. Browse vetted campaigns and donate today.",
      },
      { property: "og:title", content: "Heri-Vest — Crowdfunding for Conservation" },
      {
        property: "og:description",
        content:
          "Direct funding for frontline conservationists restoring fragile ecosystems and protecting endangered species.",
      },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Index,
});

type Campaign = {
  image: string;
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
    image: mangroveImg,
    category: "Oceans",
    location: "Indonesia",
    title: "Restore the Karimunjawa Mangrove Belt",
    blurb:
      "Planting 50,000 saplings to protect coastal villages from rising tides and provide nursery grounds for local marine life.",
    raised: 14200,
    goal: 20000,
    donors: 412,
    daysLeft: 12,
  },
  {
    image: snowLeopardImg,
    category: "Wildlife",
    location: "Nepal",
    title: "The Snow Leopard Corridor Initiative",
    blurb:
      "Funding GPS collaring and local ranger patrols to reduce human-wildlife conflict in the Annapurna Conservation Area.",
    raised: 48900,
    goal: 60000,
    donors: 1102,
    daysLeft: 4,
  },
  {
    image: redwoodsImg,
    category: "Forests",
    location: "California",
    title: "Secure the Lost Canyon Redwoods",
    blurb:
      "A critical land acquisition project to protect 400 acres of old-growth redwood forest from private development.",
    raised: 152000,
    goal: 400000,
    donors: 894,
    daysLeft: 28,
  },
];

const categories = ["All Projects", "Wildlife", "Oceans", "Forests", "Climate"];

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `$${n.toLocaleString()}`;

function Index() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b-2 border-ink/10 bg-brand-yellow/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-10">
            <a href="/" className="flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight text-brand-green">
              <span className="inline-block size-3 rounded-full bg-brand-green ring-4 ring-brand-lime/60" />
              Heri-Vest
            </a>
            <ul className="hidden items-center gap-7 text-sm font-semibold text-ink/80 md:flex">
              <li><a href="#campaigns" className="transition-colors hover:text-brand-green">Explore</a></li>
              <li><a href="#impact" className="transition-colors hover:text-brand-green">Impact</a></li>
              <li><a href="#process" className="transition-colors hover:text-brand-green">Process</a></li>
            </ul>
          </div>
          <a
            href="#campaigns"
            className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-brand-yellow shadow-[0_4px_0_0_oklch(0.22_0.04_150)] transition hover:translate-y-0.5 hover:shadow-[0_2px_0_0_oklch(0.22_0.04_150)]"
          >
            Donate Now →
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-yellow via-brand-lime/40 to-surface">
        <div className="pointer-events-none absolute -right-32 -top-32 size-[480px] rounded-full bg-brand-lime/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 size-[420px] rounded-full bg-brand-yellow/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-brand-green bg-surface px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-green">
              <span className="size-2 animate-pulse rounded-full bg-brand-green" />
              Live · 42 campaigns running
            </span>
            <h1 className="mt-6 text-balance font-serif text-5xl leading-[1.02] md:text-7xl">
              Protect the wild <span className="italic text-brand-green">for those</span> who come after us.
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink/75 md:text-xl">
              Direct funding for frontline conservationists restoring fragile ecosystems and
              protecting endangered species from extinction.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#campaigns"
                className="rounded-full bg-brand-green px-6 py-3.5 font-bold text-brand-yellow shadow-[0_6px_0_0_oklch(0.22_0.04_150)] transition hover:translate-y-1 hover:shadow-[0_2px_0_0_oklch(0.22_0.04_150)]"
              >
                Browse Active Campaigns
              </a>
              <a
                href="#process"
                className="rounded-full border-2 border-ink bg-surface px-6 py-3.5 font-bold text-ink transition hover:bg-brand-lime/40"
              >
                How We Vet Projects
              </a>
            </div>
          </div>
          <div className="relative lg:col-span-5">
            <div className="overflow-hidden rounded-[2rem] border-4 border-ink shadow-[12px_12px_0_0_oklch(0.42_0.13_150)]">
              <img
                src={heroImg}
                alt="Aerial view of a misty river valley in protected forest"
                width={1920}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border-4 border-ink bg-brand-yellow p-5 shadow-[6px_6px_0_0_oklch(0.42_0.13_150)] md:block">
              <div className="font-serif text-3xl font-bold text-ink">12,400</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/70">
                Hectares Protected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="border-y-2 border-ink/10 bg-brand-green">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-5">
          <span className="mr-3 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-yellow">
            Filter By:
          </span>
          {categories.map((c, i) => (
            <button
              key={c}
              className={
                i === 0
                  ? "rounded-full bg-brand-yellow px-4 py-1.5 text-sm font-bold text-ink ring-2 ring-brand-yellow"
                  : "rounded-full bg-transparent px-4 py-1.5 text-sm font-semibold text-brand-yellow/80 ring-2 ring-brand-yellow/30 transition hover:bg-brand-yellow/10 hover:text-brand-yellow"
              }
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Campaigns */}
      <section id="campaigns" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-green">— Now funding</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">Active campaigns</h2>
            <p className="mt-3 max-w-md text-ink/70">
              Urgent priority projects requiring immediate funding from scientists in the field.
            </p>
          </div>
          <a
            href="#"
            className="hidden rounded-full bg-brand-lime/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-green ring-2 ring-brand-green/20 hover:bg-brand-lime/60 md:block"
          >
            View all 42 →
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c, i) => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            const accents = ["bg-brand-yellow", "bg-brand-lime", "bg-brand-yellow"];
            return (
              <article
                key={c.title}
                className="group flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-surface shadow-[6px_6px_0_0_oklch(0.42_0.13_150)] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_oklch(0.42_0.13_150)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink">
                  <img
                    src={c.image}
                    alt={c.title}
                    width={1200}
                    height={896}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <span className={`absolute left-4 top-4 rounded-full ${accents[i % accents.length]} px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ink ring-2 ring-ink`}>
                    {c.category} · {c.location}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-balance font-serif text-2xl leading-tight transition-colors group-hover:text-brand-green">
                    {c.title}
                  </h3>
                  <p className="mt-3 max-w-[42ch] text-pretty text-sm leading-relaxed text-ink/70">
                    {c.blurb}
                  </p>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-bold text-brand-green">{fmt(c.raised)} raised</span>
                      <span className="text-ink/60">of {fmt(c.goal)}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full border-2 border-ink bg-surface">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-lime to-brand-green transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex gap-5">
                      <div>
                        <div className="font-serif text-lg font-bold">{c.donors.toLocaleString()}</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/60">
                          Donors
                        </div>
                      </div>
                      <div>
                        <div className="font-serif text-lg font-bold text-brand-green">{c.daysLeft}</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/60">
                          Days Left
                        </div>
                      </div>
                    </div>
                    <button className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-brand-yellow transition hover:bg-brand-green">
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
      <section id="impact" className="relative overflow-hidden bg-brand-green text-brand-yellow">
        <div className="pointer-events-none absolute -right-20 top-1/2 size-[400px] -translate-y-1/2 rounded-full bg-brand-lime/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-lime">— Our impact</span>
            <h2 className="mt-3 font-serif text-4xl text-surface md:text-5xl">
              Real numbers from <span className="italic text-brand-yellow">real ground</span>.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { v: "$4.2M", l: "Total Funds Raised" },
              { v: "124", l: "Species Protected" },
              { v: "18k", l: "Hectares Restored" },
              { v: "62k", l: "Active Donors" },
            ].map((s) => (
              <div key={s.l} className="rounded-3xl border-2 border-brand-yellow/30 bg-brand-green/40 p-6 backdrop-blur-sm">
                <span className="block font-serif text-4xl text-brand-yellow md:text-5xl">{s.v}</span>
                <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-brand-lime">
                  {s.l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-green">— How it works</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Transparency at every step</h2>
          <p className="mt-3 text-ink/70">
            We ensure that every dollar you contribute reaches the ground where it is needed most.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Scientific Vetting", d: "Every project is reviewed by our panel of biologists to ensure long-term ecological viability and measurable impact.", bg: "bg-brand-yellow" },
            { n: "02", t: "Direct Funding", d: "Funds are disbursed in phases, tied to specific milestones such as planting targets or territory patrol hours.", bg: "bg-brand-lime" },
            { n: "03", t: "Evidence-Based Updates", d: "Donors receive GPS coordinates, photo updates, and quarterly impact reports from the project leads on site.", bg: "bg-brand-yellow" },
          ].map((step) => (
            <div key={step.n} className={`flex flex-col gap-4 rounded-3xl border-2 border-ink ${step.bg} p-7 shadow-[6px_6px_0_0_oklch(0.42_0.13_150)]`}>
              <div className="flex size-12 items-center justify-center rounded-full border-2 border-ink bg-surface font-serif text-lg font-bold text-brand-green">
                {step.n}
              </div>
              <h4 className="font-serif text-2xl font-semibold text-ink">{step.t}</h4>
              <p className="text-pretty text-sm leading-relaxed text-ink/80">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-brand-green bg-ink py-20 text-brand-yellow">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-12 md:flex-row">
            <div className="max-w-sm space-y-5">
              <span className="flex items-center gap-2 font-serif text-2xl font-bold text-brand-yellow">
                <span className="inline-block size-3 rounded-full bg-brand-lime ring-4 ring-brand-green" />
                Heri-Vest
              </span>
              <p className="text-sm leading-relaxed text-brand-yellow/70">
                A registered 501(c)(3) nonprofit dedicated to the preservation of Earth's most
                critical wild spaces.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-lime">
                  Organization
                </span>
                <ul className="space-y-3 text-sm text-brand-yellow/70">
                  <li><a href="#" className="hover:text-brand-lime">Our Story</a></li>
                  <li><a href="#" className="hover:text-brand-lime">Annual Reports</a></li>
                  <li><a href="#" className="hover:text-brand-lime">Careers</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-lime">
                  Resources
                </span>
                <ul className="space-y-3 text-sm text-brand-yellow/70">
                  <li><a href="#" className="hover:text-brand-lime">Conservation FAQ</a></li>
                  <li><a href="#process" className="hover:text-brand-lime">Project Criteria</a></li>
                  <li><a href="#" className="hover:text-brand-lime">Press Kit</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-brand-yellow/20 pt-8 md:flex-row">
            <span className="text-xs text-brand-yellow/60">
              © {new Date().getFullYear()} Heri-Vest Conservation Foundation.
            </span>
            <div className="flex gap-6 text-xs text-brand-yellow/60">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
