import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProviderShowcase } from "@/components/providers/provider-showcase";

export default async function ProvidersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.providers");

  return (
    <div className="mx-auto max-w-container px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-display text-headline-md font-bold">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-on-surface-variant">{t("description")}</p>
      </div>
      <ProviderShowcase />
    </div>
  );
}
