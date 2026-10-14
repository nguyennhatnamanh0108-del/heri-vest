import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) return { isAdmin: false as const };
    const [campaigns, orders, reviews] = await Promise.all([
      context.supabase.from("campaigns").select("id, title, raised_amount, goal_amount, donor_count").order("sort_order"),
      context.supabase
        .from("payment_orders")
        .select("id, txn_ref, provider, amount_usd, donor_name, message, status, created_at, paid_at, campaign_id")
        .order("created_at", { ascending: false })
        .limit(200),
      context.supabase
        .from("donation_reviews")
        .select("donation_id, verdict, reason, created_at, donations(amount, donor_name, campaigns(title))")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    return {
      isAdmin: true as const,
      campaigns: campaigns.data ?? [],
      orders: orders.data ?? [],
      reviews: reviews.data ?? [],
    };
  });
