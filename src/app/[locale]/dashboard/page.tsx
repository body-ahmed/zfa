import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getServerSession } from "@/lib/auth/session-server";
import { isAdminSession } from "@/lib/auth/admin";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession();
  if (isAdminSession(session)) {
    redirect(`/${locale}/admin`);
  }
  redirect(`/${locale}/profile`);
}
