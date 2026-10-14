import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const createPaypalPayment = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        campaignId: z.string().uuid(),
        amount: z.number().min(1).max(100000),
        donorName: z.string().trim().max(80).optional(),
        message: z.string().trim().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createPaypalOrder } = await import("./paypal.server");
    const { data: campaign } = await supabaseAdmin.from("campaigns").select("id, title").eq("id", data.campaignId).maybeSingle();
    if (!campaign) throw new Error("Project not found");

    const amountUsd = Math.round(data.amount * 100) / 100;
    const txnRef = `HV${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const origin = new URL(getRequest().url).origin;
    const { orderId, url } = await createPaypalOrder({
      txnRef,
      amountUsd,
      description: `Donation to ${campaign.title} · Heri-Vest`,
      returnUrl: `${origin}/donate/return`,
      cancelUrl: `${origin}/donate/return?cancelled=1`,
    });
    const { error } = await supabaseAdmin.from("payment_orders").insert({
      txn_ref: txnRef,
      provider: "paypal",
      provider_txn_no: orderId,
      campaign_id: campaign.id,
      amount_usd: amountUsd,
      amount_vnd: 0,
      donor_name: data.donorName || "Anonymous",
      message: data.message || null,
    });
    if (error) throw new Error("Could not start payment");
    return { url };
  });

export const confirmPaypalReturn = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ token: z.string().min(5).max(64) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { capturePaypalOrder } = await import("./paypal.server");
    const r = await capturePaypalOrder(supabaseAdmin, data.token);
    let title: string | null = null;
    if (r.order) {
      const { data: c } = await supabaseAdmin.from("campaigns").select("title").eq("id", r.order.campaign_id).maybeSingle();
      title = c?.title ?? null;
    }
    return { status: r.status, amountUsd: r.order ? Number(r.order.amount_usd) : null, title };
  });
