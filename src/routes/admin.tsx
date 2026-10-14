import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { getAdminDashboard } from "@/lib/admin.functions";
import { useSession } from "@/lib/useSession";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Donation dashboard · Heri-Vest" },
      { name: "description", content: "Donations, payments and AI alerts for Heri-Vest admins." },
      { property: "og:title", content: "Donation dashboard · Heri-Vest" },
      { property: "og:description", content: "Donations, payments and AI alerts for Heri-Vest admins." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const usd = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

type Review = {
  donation_id: string;
  verdict: string;
  reason: string;
  created_at: string;
  donations: { amount: number; donor_name: string; campaigns: { title: string } | null } | null;
};

function AdminPage() {
  const { user, loading } = useSession();
  const fetchDash = useServerFn(getAdminDashboard);
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "failed">("all");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard", user?.id],
    queryFn: () => fetchDash(),
    enabled: !!user,
    refetchInterval: 15_000,
  });

  const stats = useMemo(() => {
    if (!data?.isAdmin) return null;
    const paid = data.orders.filter((o) => o.status === "paid");
    const raised = paid.reduce((s, o) => s + Number(o.amount_usd), 0);
    const since = Date.now() - 30 * 86400_000;
    return {
      raised,
      count: paid.length,
      avg: paid.length ? raised / paid.length : 0,
      last30: paid.filter((o) => new Date(o.paid_at ?? o.created_at).getTime() > since).reduce((s, o) => s + Number(o.amount_usd), 0),
      pending: data.orders.filter((o) => o.status === "pending").length,
      flagged: (data.reviews as Review[]).filter((r) => r.verdict === "suspicious").length,
    };
  }, [data]);

  const titleById = useMemo(
    () => Object.fromEntries((data?.isAdmin ? data.campaigns : []).map((c) => [c.id, c.title])),
    [data],
  );

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <Link to="/" className="text-sm font-semibold text-jungle">← Back to Heri-Vest</Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold">Donation dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Live view of every payment, project totals and AI alerts. Refreshes every 15 seconds.</p>

      {loading || (user && isLoading) ? (
        <p className="mt-8 text-sm">Loading…</p>
      ) : !user ? (
        <p className="mt-8 text-sm">Please <Link to="/auth" className="font-semibold text-jungle underline">sign in</Link> with an admin account.</p>
      ) : !data?.isAdmin || !stats ? (
        <p className="mt-8 text-sm">This page is for Heri-Vest admins only.</p>
      ) : (
        <div className="mt-8 space-y-10">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {[
              ["Total raised", usd(stats.raised)],
              ["Donations", stats.count.toLocaleString()],
              ["Average gift", usd(stats.avg)],
              ["Last 30 days", usd(stats.last30)],
              ["Pending checkouts", stats.pending.toString()],
              ["AI flagged", stats.flagged.toString()],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k}</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-jungle">{v}</p>
              </div>
            ))}
          </div>

          <section>
            <h2 className="font-serif text-xl font-semibold">Projects</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {data.campaigns.map((c) => {
                const pct = c.goal_amount ? Math.min(100, (Number(c.raised_amount) / Number(c.goal_amount)) * 100) : 0;
                return (
                  <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
                    <p className="font-semibold">{c.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {usd(Number(c.raised_amount))} of {usd(Number(c.goal_amount))} · {c.donor_count} backers
                    </p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-jungle" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-xl font-semibold">Payments</h2>
              <div className="flex gap-1">
                {(["all", "paid", "pending", "failed"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${filter === f ? "bg-jungle text-cream" : "bg-muted"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="p-3">Date</th><th className="p-3">Donor</th><th className="p-3">Project</th>
                    <th className="p-3">Amount</th><th className="p-3">Via</th><th className="p-3">Status</th><th className="p-3">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.filter((o) => filter === "all" || o.status === filter).map((o) => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="whitespace-nowrap p-3 text-xs">{new Date(o.created_at).toLocaleString()}</td>
                      <td className="p-3">{o.donor_name}</td>
                      <td className="p-3">{titleById[o.campaign_id] ?? "—"}</td>
                      <td className="p-3 font-semibold">{usd(Number(o.amount_usd))}</td>
                      <td className="p-3 capitalize">{o.provider}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${o.status === "paid" ? "bg-jungle text-cream" : o.status === "failed" ? "bg-destructive text-destructive-foreground" : "bg-muted"}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="max-w-xs truncate p-3 text-xs text-muted-foreground">{o.message}</td>
                    </tr>
                  ))}
                  {data.orders.length === 0 && (
                    <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No payments yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold">AI donation alerts</h2>
            <ul className="mt-3 space-y-3">
              {data.reviews.length === 0 && <li className="text-sm text-muted-foreground">No donations reviewed yet.</li>}
              {[...(data.reviews as Review[])]
                .sort((a, b) => (a.verdict === b.verdict ? 0 : a.verdict === "suspicious" ? -1 : 1))
                .map((r) => (
                  <li key={r.donation_id} className={`rounded-xl border p-4 ${r.verdict === "suspicious" ? "border-destructive/40 bg-destructive/5" : "border-border"}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-semibold">
                        {usd(Number(r.donations?.amount ?? 0))} · {r.donations?.donor_name} → {r.donations?.campaigns?.title}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${r.verdict === "suspicious" ? "bg-destructive text-destructive-foreground" : "bg-muted"}`}>
                        {r.verdict}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.reason}</p>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
