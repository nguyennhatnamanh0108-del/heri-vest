import { createFileRoute } from "@tanstack/react-router";

// VNPay server-to-server payment notification. Signature verified before any write.
export const Route = createFileRoute("/api/public/vnpay-ipn")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = Object.fromEntries(new URL(request.url).searchParams.entries());
        try {
          const { verifyParams, settleOrder } = await import("@/lib/vnpay.server");
          if (!verifyParams(params)) return Response.json({ RspCode: "97", Message: "Invalid signature" });
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const r = await settleOrder(supabaseAdmin, params);
          return Response.json({ RspCode: r.code, Message: r.message });
        } catch (e) {
          console.error("vnpay ipn failed", e);
          return Response.json({ RspCode: "99", Message: "Unknown error" });
        }
      },
    },
  },
});
