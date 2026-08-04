import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-headline-md font-bold">404</h1>
      <p className="mt-2 text-on-surface-variant">{t("notFound")}</p>
    </div>
  );
}
