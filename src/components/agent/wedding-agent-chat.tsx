"use client";

import { useMemo, useState } from "react";
import { Sparkles, SendHorizonal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { getAgentReply } from "@/lib/agent/wedding-agent";

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

export function WeddingAgentChat() {
  const t = useTranslations("agent");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: t("placeholder"),
    },
  ]);
  const [draft, setDraft] = useState("");

  const locale = useMemo(() => (t.rich("locale") as unknown as string) || "en", [t]);

  const handleSend = () => {
    const value = draft.trim();
    if (!value) return;

    const nextMessages = [
      ...messages,
      { id: Date.now(), role: "user" as const, content: value },
    ];
    setMessages(nextMessages);
    setDraft("");

    const reply = getAgentReply(value, locale === "ar" ? "ar" : "en");
    setMessages([
      ...nextMessages,
      { id: Date.now() + 1, role: "assistant" as const, content: reply },
    ]);
  };

  return (
    <div className="rounded-3xl border border-outline-variant/70 bg-surface-container-low/80 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-primary-container p-3 text-on-primary-container">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-title-lg font-semibold text-on-surface">
            {t("title")}
          </h2>
          <p className="text-sm text-on-surface-variant">{t("subtitle")}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "assistant"
                ? "bg-primary-container/60 text-on-primary-container"
                : "ml-auto bg-surface-container-high text-on-surface"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 rounded-full border border-outline-variant bg-background px-4 py-3 text-sm outline-none ring-0"
          placeholder={t("inputPlaceholder")}
        />
        <Button size="icon" onClick={handleSend} aria-label={t("send")}> 
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
