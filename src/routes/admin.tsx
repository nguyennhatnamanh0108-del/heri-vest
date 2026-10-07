import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getFlaggedDonations } from "@/lib/insights.functions";
import { useSession } from "@/lib/useSession";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Donation alerts · Heri-Vest" },
      { name: "description", content: "AI-screened donation alerts for Heri-Vest admins." },
      { property: "og:title", content: "Donation alerts · Heri-Vest" },
      { property: "og:description", content: "AI-screened donation alerts for Heri-Vest admins." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Review = {
  donation_id: string;
  verdict: string;
  reason: string;
  created_at: string;
  donations: { amount: number; donor_name: string; message: string | null; campaigns: { title: string } | null } | null;
};

function AdminPage() {
  const { user, loading } = useSession();
  const fetchFlags = useServerFn(getFlaggedDonations);
  const { data, isLoading } = useQuery({
    queryKey: ["donation-reviews", user?.id],
    queryFn: () => fetchFlags(),
    enabled: !!user,
    refetchInterval: 15_000,
  });

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <Link to="/" className="text-sm font-semibold text-jungle">← Back to Heri-Vest</Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold">Donation alerts</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every donation is screened by AI. Suspicious ones are shown first.</p>
      {loading || (user && isLoading) ? (
        <p className="mt-8 text-sm">Loading…</p>
      ) : !user ? (
        <p className="mt-8 text-sm">Please <Link to="/auth" className="font-semibold text-jungle underline">sign in</Link> with an admin account.</p>
      ) : !data?.isAdmin ? (
        <p className="mt-8 text-sm">This page is for Heri-Vest admins only.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {data.reviews.length === 0 && <li className="text-sm text-muted-foreground">No donations reviewed yet.</li>}
          {[...(data.reviews as Review[])]
            .sort((a, b) => (a.verdict === b.verdict ? 0 : a.verdict === "suspicious" ? -1 : 1))
            .map((r) => (
              <li key={r.donation_id} className={`rounded-xl border p-4 ${r.verdict === "suspicious" ? "border-destructive/40 bg-destructive/5" : "border-border"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold">
                    ${Number(r.donations?.amount ?? 0).toLocaleString()} · {r.donations?.donor_name} → {r.donations?.campaigns?.title}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${r.verdict === "suspicious" ? "bg-destructive text-destructive-foreground" : "bg-muted"}`}>
                    {r.verdict}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.reason}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
