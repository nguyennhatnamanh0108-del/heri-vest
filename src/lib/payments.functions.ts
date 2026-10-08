import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const createVnpayPayment = createServerFn({ method: "POST" })
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
    const { buildPaymentUrl, USD_TO_VND } = await import("./vnpay.server");
    const { data: campaign } = await supabaseAdmin.from("campaigns").select("id, title").eq("id", data.campaignId).maybeSingle();
    if (!campaign) throw new Error("Project not found");

    const amountUsd = Math.round(data.amount * 100) / 100;
    const amountVnd = Math.round(amountUsd * USD_TO_VND);
    const txnRef = `HV${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const { error } = await supabaseAdmin.from("payment_orders").insert({
      txn_ref: txnRef,
      campaign_id: campaign.id,
      amount_usd: amountUsd,
      amount_vnd: amountVnd,
      donor_name: data.donorName || "Anonymous",
      message: data.message || null,
    });
    if (error) throw new Error("Could not start payment");

    const req = getRequest();
    const origin = new URL(req.url).origin;
    const ip = (req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "127.0.0.1").split(",")[0]!.trim();
    const url = buildPaymentUrl({
      txnRef,
      amountVnd,
      info: `Ung ho Heri-Vest ${txnRef}`,
      returnUrl: `${origin}/donate/return`,
      ip,
    });
    return { url };
  });

export const confirmVnpayReturn = createServerFn({ method: "POST" })
  .inputValidator((d) => z.record(z.string(), z.string()).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { verifyParams, settleOrder } = await import("./vnpay.server");
    if (!verifyParams(data)) return { status: "invalid" as const, amountUsd: null, title: null };
    await settleOrder(supabaseAdmin, data);
    const { data: order } = await supabaseAdmin
      .from("payment_orders")
      .select("status, amount_usd, campaigns(title)")
      .eq("txn_ref", data["vnp_TxnRef"] ?? "")
      .maybeSingle();
    return {
      status: (order?.status ?? "invalid") as "paid" | "failed" | "pending" | "invalid",
      amountUsd: order ? Number(order.amount_usd) : null,
      title: (order?.campaigns as { title: string } | null)?.title ?? null,
    };
  });
