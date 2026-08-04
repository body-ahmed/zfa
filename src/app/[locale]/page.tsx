import { getMessages, setRequestLocale } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const homeMessages = messages.home as {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    features: Record<string, { title: string; description: string }>;
  };

  const features = ["venues", "planning", "vendors"] as const;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-fixed/30 to-transparent" />

      <section className="mx-auto max-w-container px-margin-mobile pb-20 pt-16 md:px-margin-desktop md:pb-32 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-container/50 px-4 py-1.5 text-sm text-on-primary-container">
            <Sparkles className="h-4 w-4" />
            {homeMessages.badge}
          </div>

          <h1 className="font-display text-display-lg-mobile font-bold leading-tight text-on-background md:text-display-lg">
            {homeMessages.title}
          </h1>

          <p className="mt-6 text-body-lg text-on-surface-variant">
            {homeMessages.subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/providers">{homeMessages.ctaPrimary}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">{homeMessages.ctaSecondary}</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/agent">{locale === "ar" ? "جرب المساعد" : "Try the agent"}</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {features.map((key) => (
            <div
              key={key}
              className="glass-card rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <h2 className="font-display text-title-lg font-semibold">
                {homeMessages.features[key].title}
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                {homeMessages.features[key].description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
