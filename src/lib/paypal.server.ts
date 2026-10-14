type Admin = (typeof import("@/integrations/supabase/client.server"))["supabaseAdmin"];

function config() {
  const clientId = process.env["PAYPAL_CLIENT_ID"];
  const secret = process.env["PAYPAL_CLIENT_SECRET"];
  if (!clientId || !secret) throw new Error("PayPal is not configured yet");
  const live = process.env["PAYPAL_ENV"] === "live";
  return { clientId, secret, base: live ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com" };
}

async function token() {
  const { clientId, secret, base } = config();
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${btoa(`${clientId}:${secret}`)}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed (${res.status})`);
  const j = (await res.json()) as { access_token: string };
  return { access: j.access_token, base };
}

export async function createPaypalOrder(o: { txnRef: string; amountUsd: number; description: string; returnUrl: string; cancelUrl: string }) {
  const { access, base } = await token();
  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json", "PayPal-Request-Id": o.txnRef },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ custom_id: o.txnRef, description: o.description.slice(0, 127), amount: { currency_code: "USD", value: o.amountUsd.toFixed(2) } }],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "Heri-Vest",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            landing_page: "GUEST_CHECKOUT",
            return_url: o.returnUrl,
            cancel_url: o.cancelUrl,
          },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`PayPal order failed (${res.status}): ${await res.text()}`);
  const j = (await res.json()) as { id: string; links: { rel: string; href: string }[] };
  const link = j.links.find((l) => l.rel === "payer-action" || l.rel === "approve");
  if (!link) throw new Error("PayPal returned no checkout link");
  return { orderId: j.id, url: link.href };
}

/** Captures a PayPal order and settles our payment order idempotently. */
export async function capturePaypalOrder(admin: Admin, paypalOrderId: string) {
  const { data: order } = await admin.from("payment_orders").select("*").eq("provider", "paypal").eq("provider_txn_no", paypalOrderId).maybeSingle();
  if (!order) return { status: "invalid" as const, order: null };
  if (order.status !== "pending") return { status: order.status as "paid" | "failed", order };

  const { access, base } = await token();
  const res = await fetch(`${base}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json", "PayPal-Request-Id": `cap-${order.txn_ref}` },
  });
  const j = (await res.json().catch(() => ({}))) as {
    status?: string;
    purchase_units?: { payments?: { captures?: { id: string; status: string; amount: { value: string; currency_code: string } }[] } }[];
  };
  const cap = j.purchase_units?.[0]?.payments?.captures?.[0];
  const success =
    res.ok && j.status === "COMPLETED" && cap?.status === "COMPLETED" && cap.amount.currency_code === "USD" && Number(cap.amount.value) === Number(order.amount_usd);
  if (!success && res.status >= 500) return { status: "pending" as const, order };

  const { data: claimed } = await admin
    .from("payment_orders")
    .update({ status: success ? "paid" : "failed", response_code: j.status ?? String(res.status), paid_at: success ? new Date().toISOString() : null })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();
  if (!claimed) return { status: "paid" as const, order };

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
  return { status: success ? ("paid" as const) : ("failed" as const), order };
}
