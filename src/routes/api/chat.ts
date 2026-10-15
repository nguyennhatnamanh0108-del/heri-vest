import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, isStepCount, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import { AI_MODEL } from "@/lib/ai/gateway.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: UIMessage[] };
        const messages = (body.messages ?? []).slice(-30);
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { getCampaignStats } = await import("@/lib/insights.server");

        const result = streamText({
          model: AI_MODEL,
          instructions:
            "You are Sao, the friendly guide of Heri-Vest — a crowdfunding site for wildlife and nature conservation in Vietnam. " +
            "Help visitors (often teens) understand the projects and choose one to support. Be warm, concise, and clear. " +
            "Always call get_live_campaigns before quoting any numbers; never invent figures. " +
            "To donate, visitors use the amount buttons on each project card. Answer in the visitor's language.",
          messages: await convertToModelMessages(messages),
          tools: {
            get_live_campaigns: tool({
              description:
                "Live funding stats for every Heri-Vest campaign: raised, goal, percent, donors, daily funding rate, projected goal date.",
              inputSchema: z.object({}),
              execute: async () => getCampaignStats(supabaseAdmin),
            }),
          },
          stopWhen: isStepCount(10),
          abortSignal: request.signal,
        });
        return result.toUIMessageStreamResponse({ sendReasoning: true });
      },
    },
  },
});
