import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AccountStudio } from "@/components/profile/account-studio";
import { getServerSession } from "@/lib/auth/session-server";
import { createClient } from "@/lib/supabase/server";
import { getOwnedListing } from "@/lib/listings/queries";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const existing = await getServerSession();
  if (!existing) {
    redirect(`/${locale}/auth`);
  }

  const supabase = await createClient();
  await supabase.rpc("ensure_my_profile");
  const session = (await getServerSession()) ?? existing;
  const listing = await getOwnedListing(session.id);

  return <AccountStudio session={session} listing={listing} isVendor={session.role === "vendor"} />;
}
