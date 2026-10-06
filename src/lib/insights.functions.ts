import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getCampaignInsights = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { getOrRefreshInsights } = await import("./insights.server");
  try {
    return { insights: await getOrRefreshInsights(supabaseAdmin), error: null as string | null };
  } catch (e) {
    console.error("insights failed", e);
    const { data } = await supabaseAdmin.from("campaign_insights").select("*");
    return { insights: data ?? [], error: "AI insights are temporarily unavailable." };
  }
});

export const submitDonation = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        campaignId: z.string().uuid(),
        amount: z.number().positive().max(100000),
        donorName: z.string().max(80).optional(),
        message: z.string().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("donations")
      .insert({
        campaign_id: data.campaignId,
        amount: Math.round(data.amount * 100) / 100,
        donor_name: data.donorName?.trim() || "Anonymous",
        message: data.message?.trim() || null,
      })
      .select("id, campaign_id, amount, donor_name, message")
      .single();
    if (error) throw new Error("Could not record donation");
    try {
      const { reviewDonation } = await import("./insights.server");
      await reviewDonation(supabaseAdmin, { ...row, amount: Number(row.amount) });
    } catch (e) {
      console.error("donation review failed", e);
    }
    return { ok: true };
  });

export const getFlaggedDonations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) return { isAdmin: false, reviews: [] };
    const { data: reviews } = await context.supabase
      .from("donation_reviews")
      .select("donation_id, verdict, reason, created_at, donations(amount, donor_name, message, campaigns(title))")
      .order("created_at", { ascending: false })
      .limit(100);
    return { isAdmin: true, reviews: reviews ?? [] };
  });
