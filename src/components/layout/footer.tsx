import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-outline-variant/50 bg-surface-container-low">
      <div className="mx-auto max-w-container px-margin-mobile py-12 md:px-margin-desktop">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-bold text-primary">
              {t("brand")}
            </p>
            <p className="mt-2 text-sm text-on-surface-variant">
              {t("tagline")}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">{t("links")}</p>
            <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/providers" className="hover:text-primary">
                  {t("providers")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  {t("about")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">{t("contact")}</p>
            <p className="mt-3 text-sm text-on-surface-variant">
              {t("email")}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-outline-variant/50 pt-6 text-center text-xs text-on-surface-variant">
          {t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
