import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

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

  const donate = useCallback(async (campaignId: string, amount: number, donorName?: string) => {
    const { error } = await supabase.from("donations").insert({
      campaign_id: campaignId,
      amount,
      donor_name: donorName?.trim() ? donorName.trim() : "Anonymous",
    });
    if (error) throw error;
    await load();
  }, [load]);

  return { campaigns, loading, donate, refresh: load };
}
