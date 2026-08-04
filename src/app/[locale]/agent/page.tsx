import { setRequestLocale } from "next-intl/server";
import { WeddingAgentChat } from "@/components/agent/wedding-agent-chat";

export default async function AgentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-container px-margin-mobile py-16 md:px-margin-desktop md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            AI planning assistant
          </p>
          <h1 className="mt-3 font-display text-display-lg-mobile font-bold text-on-background md:text-display-lg">
            Plan your wedding with a smart assistant
          </h1>
          <p className="mt-4 text-body-lg text-on-surface-variant">
            Ask about your budget, venue shortlist, vendors, or timeline and get tailored guidance instantly.
          </p>
        </div>

        <WeddingAgentChat />
      </div>
    </div>
  );
}
