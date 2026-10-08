import { createHmac, timingSafeEqual } from "crypto";

type Admin = (typeof import("@/integrations/supabase/client.server"))["supabaseAdmin"];

/** Fixed USD→VND rate used to charge donations in VND. */
export const USD_TO_VND = 25_000;
const SANDBOX_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

function config() {
  const tmnCode = process.env["VNPAY_TMN_CODE"];
  const hashSecret = process.env["VNPAY_HASH_SECRET"];
  if (!tmnCode || !hashSecret) throw new Error("VNPay is not configured yet");
  return { tmnCode, hashSecret, payUrl: process.env["VNPAY_PAY_URL"] || SANDBOX_URL };
}

/** VNPay encoding: encodeURIComponent with spaces as '+'. */
const enc = (v: string) => encodeURIComponent(v).replace(/%20/g, "+");

export function signParams(params: Record<string, string>, secret: string) {
  const query = Object.keys(params)
    .filter((k) => params[k] !== "" && params[k] != null)
    .sort()
    .map((k) => `${enc(k)}=${enc(params[k]!)}`)
    .join("&");
  return { query, hash: createHmac("sha512", secret).update(Buffer.from(query, "utf-8")).digest("hex") };
}

function vnTime(d: Date) {
  const t = new Date(d.getTime() + 7 * 3600_000).toISOString();
  return t.slice(0, 19).replace(/[-T:]/g, "");
}

export function buildPaymentUrl(o: { txnRef: string; amountVnd: number; info: string; returnUrl: string; ip: string }) {
  const { tmnCode, hashSecret, payUrl } = config();
  const now = new Date();
  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: String(o.amountVnd * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: o.txnRef,
    vnp_OrderInfo: o.info,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: o.returnUrl,
    vnp_IpAddr: o.ip,
    vnp_CreateDate: vnTime(now),
    vnp_ExpireDate: vnTime(new Date(now.getTime() + 15 * 60_000)),
  };
  const { query, hash } = signParams(params, hashSecret);
  return `${payUrl}?${query}&vnp_SecureHash=${hash}`;
}

export function verifyParams(all: Record<string, string>) {
  const { hashSecret } = config();
  const given = (all["vnp_SecureHash"] ?? "").toLowerCase();
  const rest: Record<string, string> = {};
  for (const [k, v] of Object.entries(all)) {
    if (k.startsWith("vnp_") && k !== "vnp_SecureHash" && k !== "vnp_SecureHashType") rest[k] = v;
  }
  const { hash } = signParams(rest, hashSecret);
  const a = Buffer.from(hash);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Idempotently settle an order from verified VNPay params. Returns a VNPay RspCode. */
export async function settleOrder(admin: Admin, p: Record<string, string>) {
  const { data: order } = await admin.from("payment_orders").select("*").eq("txn_ref", p["vnp_TxnRef"] ?? "").maybeSingle();
  if (!order) return { code: "01", message: "Order not found", status: null as string | null };
  if (Number(p["vnp_Amount"]) !== Number(order.amount_vnd) * 100) return { code: "04", message: "Invalid amount", status: order.status };
  if (order.status !== "pending") return { code: "02", message: "Order already confirmed", status: order.status };

  const success = p["vnp_ResponseCode"] === "00" && p["vnp_TransactionStatus"] === "00";
  // Claim the order atomically so concurrent IPN/return calls can't double-count.
  const { data: claimed } = await admin
    .from("payment_orders")
    .update({
      status: success ? "paid" : "failed",
      response_code: p["vnp_ResponseCode"] ?? null,
      provider_txn_no: p["vnp_TransactionNo"] ?? null,
      paid_at: success ? new Date().toISOString() : null,
    })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();
  if (!claimed) return { code: "02", message: "Order already confirmed", status: order.status };

  if (success) {
    const { data: donation } = await admin
      .from("donations")
      .insert({ campaign_id: order.campaign_id, amount: order.amount_usd, donor_name: order.donor_name, message: order.message })
      .select("id, campaign_id, amount, donor_name, message")
      .single();
    if (donation) {
      await admin.from("payment_orders").update({ donation_id: donation.id }).eq("id", order.id);
      try {
        const { reviewDonation } = await import("./insights.server");
        await reviewDonation(admin, { ...donation, amount: Number(donation.amount) });
      } catch (e) {
        console.error("donation review failed", e);
      }
    }
  }
  return { code: "00", message: "Confirm Success", status: success ? "paid" : "failed" };
}
