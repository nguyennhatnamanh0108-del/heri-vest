import { Output, streamText } from "ai";
import { z } from "zod";
import { AI_MODEL } from "@/lib/ai/gateway.server";

type Admin = (typeof import("@/integrations/supabase/client.server"))["supabaseAdmin"];

export type CampaignInsight = {
  campaign_id: string;
  summary: string;
  prediction: string;
  generated_at: string;
};

export type CampaignStats = {
  id: string;
  slug: string;
  title: string;
  location: string;
  goal: number;
  raised: number;
  donors: number;
  percent: number;
  recentDailyRate: number;
  daysToGoal: number | null;
  projectedGoalDate: string | null;
};

const DAY = 86_400_000;

/** Deterministic funding velocity + goal projection from the last 30 days of donations. */
export async function getCampaignStats(admin: Admin): Promise<CampaignStats[]> {
  const since = new Date(Date.now() - 30 * DAY).toISOString();
  const [{ data: campaigns, error }, { data: recent }] = await Promise.all([
    admin.from("campaigns").select("*").order("sort_order"),
    admin.from("donations").select("campaign_id, amount, created_at").gte("created_at", since),
  ]);
  if (error) throw error;
  return (campaigns ?? []).map((c) => {
    const mine = (recent ?? []).filter((d) => d.campaign_id === c.id);
    const total = mine.reduce((s, d) => s + Number(d.amount), 0);
    const first = mine.reduce((m, d) => Math.min(m, new Date(d.created_at).getTime()), Date.now());
    const spanDays = Math.max(1, (Date.now() - first) / DAY);
    const rate = mine.length ? total / spanDays : 0;
    const goal = Number(c.goal_amount);
    const raised = Number(c.raised_amount);
    const remaining = Math.max(0, goal - raised);
    const daysToGoal = remaining === 0 ? 0 : rate > 0 ? Math.ceil(remaining / rate) : null;
    return {
      id: c.id,
      slug: c.slug,
      title: c.title,
      location: c.location,
      goal,
      raised,
      donors: c.donor_count,
      percent: goal > 0 ? Math.round((raised / goal) * 1000) / 10 : 0,
      recentDailyRate: Math.round(rate * 100) / 100,
      daysToGoal,
      projectedGoalDate:
        daysToGoal === null ? null : new Date(Date.now() + daysToGoal * DAY).toISOString().slice(0, 10),
    };
  });
}

const insightSchema = z.object({
  items: z.array(z.object({ slug: z.string(), summary: z.string(), prediction: z.string() })),
});

const MIN_REGEN_MS = 60_000;

/** Returns cached insights, regenerating with AI when any campaign's total changed. */
export async function getOrRefreshInsights(admin: Admin): Promise<CampaignInsight[]> {
  const [stats, { data: cached }] = await Promise.all([
    getCampaignStats(admin),
    admin.from("campaign_insights").select("*"),
  ]);
  const byId = new Map((cached ?? []).map((r) => [r.campaign_id, r]));
  const stale = stats.some((s) => {
    const row = byId.get(s.id);
    return !row || Number(row.raised_snapshot) !== s.raised;
  });
  const newest = Math.max(0, ...(cached ?? []).map((r) => new Date(r.generated_at).getTime()));
  const complete = stats.every((s) => byId.has(s.id));
  if (!stale || (complete && Date.now() - newest < MIN_REGEN_MS)) {
    return (cached ?? []) as CampaignInsight[];
  }

  const result = streamText({
    model: AI_MODEL,
    instructions:
      "You write live progress updates for Heri-Vest, a Vietnam wildlife & nature crowdfunding site aimed at teens and young adults. " +
      "For each campaign write: summary — one upbeat, concrete sentence (max 22 words) on current progress using the real numbers; " +
      "prediction — one sentence (max 20 words) on when the goal may be reached based ONLY on the provided projection. " +
      "If daysToGoal is null, say there isn't enough donation activity yet to forecast and invite the first gifts. Never invent numbers. Amounts are USD.",
    prompt: JSON.stringify(stats),
    output: Output.object({ schema: insightSchema }),
  });
  const out = await result.output;
  const now = new Date().toISOString();
  const rows = stats.map((s) => {
    const item = out.items.find((i) => i.slug === s.slug);
    return {
      campaign_id: s.id,
      summary: (item?.summary ?? "").slice(0, 300),
      prediction: (item?.prediction ?? "").slice(0, 300),
      raised_snapshot: s.raised,
      generated_at: now,
    };
  });
  await admin.from("campaign_insights").upsert(rows);
  return rows;
}

const reviewSchema = z.object({ verdict: z.enum(["ok", "suspicious"]), reason: z.string() });

/** AI screening of a new donation for spam / fraud patterns. */
export async function reviewDonation(
  admin: Admin,
  donation: { id: string; campaign_id: string; amount: number; donor_name: string; message: string | null },
) {
  const since = new Date(Date.now() - 10 * 60_000).toISOString();
  const { data: burst } = await admin
    .from("donations")
    .select("amount, donor_name, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(30);
  const result = streamText({
    model: AI_MODEL,
    instructions:
      "You screen donations on a conservation crowdfunding site for spam, fraud, test-card abuse, offensive names/messages, or bot bursts. " +
      "Return verdict 'suspicious' only with a concrete reason; otherwise 'ok' with a short reason. Reason max 25 words.",
    prompt: JSON.stringify({ donation, donationsInLast10Minutes: burst ?? [] }),
    output: Output.object({ schema: reviewSchema }),
  });
  const out = await result.output;
  await admin.from("donation_reviews").upsert({
    donation_id: donation.id,
    verdict: out.verdict,
    reason: out.reason.slice(0, 300),
  });
  return out;
}
