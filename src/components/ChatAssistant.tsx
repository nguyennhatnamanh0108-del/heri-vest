import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart, type ToolUIPart } from "ai";
import { MessageCircle, X } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Tool, ToolContent, ToolHeader, ToolOutput } from "@/components/ai-elements/tool";
import saoMascot from "@/assets/sao-mascot.png";

const suggestions = [
  "Which project needs help most right now?",
  "What is a saola?",
  "When will the mangrove goal be reached?",
];

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[min(600px,75vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border bg-jungle px-4 py-3 text-cream">
            <img src={saoMascot} alt="Sao" width={36} height={36} className="size-9 rounded-full bg-cream" />
            <div className="flex-1">
              <div className="font-serif text-base font-semibold">Ask Sao</div>
              <div className="text-[11px] text-cream/70">AI guide · live project data</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1 hover:bg-cream/10">
              <X className="size-4" />
            </button>
          </div>

          <Conversation className="flex-1">
            <ConversationContent>
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<img src={saoMascot} alt="" width={64} height={64} className="size-16" />}
                  title="Xin chào! I'm Sao"
                  description="Ask me about any Heri-Vest project or help choosing where to give."
                >
                  <div className="mt-4 flex flex-col gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => void sendMessage({ text: s })}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-jungle hover:text-jungle"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </ConversationEmptyState>
              ) : (
                messages.map((m) => (
                  <Message key={m.id} from={m.role}>
                    <MessageContent
                      className={
                        m.role === "user"
                          ? "group-[.is-user]:bg-jungle group-[.is-user]:text-cream"
                          : "bg-transparent"
                      }
                    >
                      {m.parts.map((p, i) => {
                        if (p.type === "text") return <MessageResponse key={i}>{p.text}</MessageResponse>;
                        if (isToolUIPart(p)) {
                          const tp = p as ToolUIPart;
                          return (
                            <Tool key={i} defaultOpen={false}>
                              <ToolHeader type={tp.type} state={tp.state} title="Checked live project stats" />
                              <ToolContent>
                                <ToolOutput output={tp.output} errorText={tp.errorText} />
                              </ToolContent>
                            </Tool>
                          );
                        }
                        return null;
                      })}
                    </MessageContent>
                  </Message>
                ))
              )}
              {status === "submitted" && <Shimmer className="text-sm">Sao is thinking…</Shimmer>}
              {error && (
                <p className="text-xs text-destructive">Sao couldn't answer right now: {error.message}</p>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border p-3">
            <PromptInput
              onSubmit={(msg) => {
                if (!msg.text?.trim() || busy) return;
                void sendMessage({ text: msg.text });
              }}
            >
              <PromptInputTextarea placeholder="Ask about a project…" />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} onStop={stop} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Sao chat" : "Chat with Sao"}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-jungle py-2 pl-2 pr-4 font-semibold text-cream shadow-xl transition hover:-translate-y-0.5"
      >
        <img src={saoMascot} alt="" width={40} height={40} className="size-10 rounded-full bg-cream" />
        {open ? <X className="size-4" /> : <MessageCircle className="size-4" />}
        <span className="text-sm">Ask Sao</span>
      </button>
    </>
  );
}
