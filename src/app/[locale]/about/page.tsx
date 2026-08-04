import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnimatedSection } from "@/components/ui/animated-section";

const milestones = [
  { title: "Trusted by couples", value: "1.2k+" },
  { title: "Verified vendors", value: "320" },
  { title: "Weddings planned", value: "850+" },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.about");

  return (
    <div className="mx-auto max-w-container px-margin-mobile py-16 md:px-margin-desktop">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <AnimatedSection className="rounded-[2rem] border border-outline-variant/60 bg-surface-container-low/70 p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">About Zaffa</p>
          <h1 className="mt-3 font-display text-headline-md font-bold">{t("title")}</h1>
          <p className="mt-4 max-w-2xl text-on-surface-variant">{t("description")}</p>
          <p className="mt-6 text-sm leading-7 text-on-surface-variant">We bring together trusted vendors, modern planning tools, and elegant discovery experiences so couples can build a memorable celebration with confidence.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.05} className="rounded-[2rem] border border-outline-variant/60 bg-background/70 p-8 shadow-sm">
          <h2 className="font-display text-title-lg font-semibold">Why couples choose Zaffa</h2>
          <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
            <li>• Curated venue and vendor discovery</li>
            <li>• Transparent pricing and comparison tools</li>
            <li>• Smart planning support for budgeting and scheduling</li>
          </ul>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {milestones.map((item) => (
              <div key={item.title} className="rounded-2xl bg-surface-container-low p-3 text-center">
                <p className="font-display text-title-lg font-semibold text-on-background">{item.value}</p>
                <p className="mt-1 text-xs text-on-surface-variant">{item.title}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
