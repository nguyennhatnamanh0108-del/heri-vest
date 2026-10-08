import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { createVnpayPayment } from "@/lib/payments.functions";

export type CampaignRow = Tables<"campaigns">;

export function useLiveCampaigns() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) setCampaigns(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();

    const channel = supabase
      .channel("live-campaigns")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "campaigns" },
        (payload) => {
          const next = payload.new as CampaignRow | undefined;
          if (!next?.id) return;
          setCampaigns((prev) =>
            prev.some((c) => c.id === next.id)
              ? prev.map((c) => (c.id === next.id ? next : c))
              : [...prev, next].sort((a, b) => a.sort_order - b.sort_order),
          );
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load]);

  /** Starts a real VNPay checkout and redirects the browser to it. */
  const donate = useCallback(async (campaignId: string, amount: number, donorName?: string) => {
    const { url } = await createVnpayPayment({ data: { campaignId, amount, donorName } });
    window.location.href = url;
  }, []);

  return { campaigns, loading, donate, refresh: load };
}
