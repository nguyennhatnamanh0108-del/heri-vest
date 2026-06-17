import { createFileRoute } from "@tanstack/react-router";
import mangroveImg from "@/assets/mangrove.jpg";
import snowLeopardImg from "@/assets/snow-leopard.jpg";
import redwoodsImg from "@/assets/redwoods.jpg";
import heroImg from "@/assets/hero-valley.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aegis Nature — Crowdfunding for Conservation" },
      {
        name: "description",
        content:
          "Direct funding for frontline conservationists restoring fragile ecosystems and protecting endangered species. Browse vetted campaigns and donate today.",
      },
      { property: "og:title", content: "Aegis Nature — Crowdfunding for Conservation" },
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
      <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-10">
            <a href="/" className="font-serif text-xl font-medium tracking-tight text-brand-green">
              Aegis Nature
            </a>
            <ul className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
              <li>
                <a href="#campaigns" className="transition-colors hover:text-brand-green">Explore</a>
              </li>
              <li>
                <a href="#impact" className="transition-colors hover:text-brand-green">Impact Registry</a>
              </li>
              <li>
                <a href="#process" className="transition-colors hover:text-brand-green">Our Process</a>
              </li>
            </ul>
          </div>
          <a
            href="#campaigns"
            className="rounded-full bg-brand-green px-4 py-2 text-sm font-medium text-surface ring-1 ring-brand-green transition hover:brightness-110"
          >
            Donate Now
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-brand-accent" />
              Preservation Ledger № 014
            </span>
            <h1 className="mt-6 text-balance font-serif text-5xl leading-[1.05] md:text-7xl">
              Protect the wild for those who come after us.
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Direct funding for frontline conservationists restoring fragile ecosystems and
              protecting endangered species from extinction.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#campaigns"
                className="rounded-lg bg-brand-green px-5 py-3 font-medium text-surface ring-1 ring-brand-green transition hover:brightness-110"
              >
                Browse Active Campaigns
              </a>
              <a
                href="#process"
                className="rounded-lg bg-secondary px-5 py-3 font-medium text-ink ring-1 ring-border transition hover:bg-border/40"
              >
                How We Vet Projects
              </a>
            </div>
          </div>
          <div className="relative lg:col-span-5">
            <div className="overflow-hidden rounded-2xl ring-1 ring-black/5">
              <img
                src={heroImg}
                alt="Aerial view of a misty river valley in protected forest"
                width={1920}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden bg-brand-accent p-6 text-surface shadow-xl md:block">
              <div className="font-serif text-3xl">12,400</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] opacity-80">
                Hectares Protected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="border-y border-border/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-6">
          <span className="mr-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Filter By:
          </span>
          {categories.map((c, i) => (
            <button
              key={c}
              className={
                i === 0
                  ? "rounded-full bg-brand-green px-4 py-1.5 text-sm font-medium text-surface"
                  : "rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-muted-foreground ring-1 ring-border transition hover:bg-border/40"
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
            <h2 className="font-serif text-3xl md:text-4xl">Active campaigns</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Urgent priority projects requiring immediate funding from scientists in the field.
            </p>
          </div>
          <a
            href="#"
            className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-brand-green hover:underline md:block"
          >
            View all 42 →
          </a>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <article key={c.title} className="group flex flex-col">
                <div className="mb-6 aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-black/5">
                  <img
                    src={c.image}
                    alt={c.title}
                    width={1200}
                    height={896}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-brand-accent">
                  <span>{c.category}</span>
                  <span className="text-border">/</span>
                  <span>{c.location}</span>
                </div>
                <h3 className="mt-3 text-balance font-serif text-2xl leading-tight transition-colors group-hover:text-brand-green">
                  {c.title}
                </h3>
                <p className="mt-3 max-w-[42ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                  {c.blurb}
                </p>
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium">{fmt(c.raised)} raised</span>
                    <span className="text-muted-foreground">Goal: {fmt(c.goal)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                    <div
                      className="h-full rounded-full bg-brand-green transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex gap-5">
                    <div>
                      <div className="text-sm font-semibold">{c.donors.toLocaleString()}</div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        Donors
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{c.daysLeft}</div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        Days Left
                      </div>
                    </div>
                  </div>
                  <button className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-surface ring-1 ring-ink transition hover:bg-brand-green hover:ring-brand-green">
                    Donate
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="bg-brand-green text-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 py-16 lg:grid-cols-4">
          {[
            { v: "$4.2M", l: "Total Funds Raised" },
            { v: "124", l: "Species Protected" },
            { v: "18k", l: "Hectares Restored" },
            { v: "62k", l: "Active Donors" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col gap-1">
              <span className="font-serif text-3xl md:text-4xl">{s.v}</span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-surface/70">
                {s.l}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-xl">
          <h2 className="font-serif text-3xl md:text-4xl">Transparency at every step</h2>
          <p className="mt-3 text-muted-foreground">
            We ensure that every dollar you contribute reaches the ground where it is needed most.
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Scientific Vetting",
              d: "Every project is reviewed by our panel of biologists to ensure long-term ecological viability and measurable impact.",
            },
            {
              n: "02",
              t: "Direct Funding",
              d: "Funds are disbursed in phases, tied to specific milestones such as planting targets or territory patrol hours.",
            },
            {
              n: "03",
              t: "Evidence-Based Updates",
              d: "Donors receive GPS coordinates, photo updates, and quarterly impact reports from the project leads on site.",
            },
          ].map((step) => (
            <div key={step.n} className="flex flex-col gap-4">
              <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold ring-1 ring-border">
                {step.n}
              </div>
              <h4 className="font-sans text-base font-semibold">{step.t}</h4>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-12 md:flex-row">
            <div className="max-w-sm space-y-5">
              <span className="font-serif text-2xl text-brand-green">Aegis Nature</span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A registered 501(c)(3) nonprofit dedicated to the preservation of Earth's most
                critical wild spaces.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Organization
                </span>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-brand-green">Our Story</a></li>
                  <li><a href="#" className="hover:text-brand-green">Annual Reports</a></li>
                  <li><a href="#" className="hover:text-brand-green">Careers</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Resources
                </span>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-brand-green">Conservation FAQ</a></li>
                  <li><a href="#process" className="hover:text-brand-green">Project Criteria</a></li>
                  <li><a href="#" className="hover:text-brand-green">Press Kit</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 md:flex-row">
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Aegis Nature Conservation Foundation.
            </span>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
