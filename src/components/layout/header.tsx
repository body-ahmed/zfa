"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", key: "home" as const },
  { href: "/providers", key: "providers" as const },
  { href: "/about", key: "about" as const },
  { href: "/agent", key: "agent" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        return;
      }
      setSignedIn(true);
      const { data: profile } = await supabase.from("profiles").select("account_role, email").eq("auth_user_id", data.user.id).maybeSingle();
      const emails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",").map((value) => value.trim().toLowerCase());
      setIsAdmin(profile?.account_role === "admin" || emails.includes((data.user.email ?? "").toLowerCase()));
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-outline-variant/50">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link href="/" className="font-display text-xl font-bold text-primary">
          {t("brand")}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              {t(link.key)}
            </Link>
          ))}
          {signedIn ? (
            <Link href="/profile" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary">
              حسابي
            </Link>
          ) : null}
          {isAdmin ? (
            <Link href="/admin" className="text-sm font-medium text-primary">
              إدارة
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href={signedIn ? "/profile" : "/auth"}>{signedIn ? "حسابي" : t("login")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-outline-variant/50 md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1 px-margin-mobile py-4">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-container-low"
              onClick={() => setMobileOpen(false)}
            >
              {t(link.key)}
            </Link>
          ))}
          {signedIn ? (
            <Link href="/profile" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-surface-container-low" onClick={() => setMobileOpen(false)}>
              حسابي
            </Link>
          ) : null}
          {isAdmin ? (
            <Link href="/admin" className="rounded-md px-3 py-2 text-sm font-medium text-primary" onClick={() => setMobileOpen(false)}>
              إدارة
            </Link>
          ) : null}
          <Button asChild size="sm" className="mt-2 w-full">
            <Link href={signedIn ? "/profile" : "/auth"}>{signedIn ? "حسابي" : t("login")}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
