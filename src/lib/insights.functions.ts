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
