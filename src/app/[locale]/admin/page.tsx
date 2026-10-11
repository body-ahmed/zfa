import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { isAdminSession } from "@/lib/auth/admin";
import { getServerSession } from "@/lib/auth/session-server";
import { getDashboardData } from "@/lib/supabase/service";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getServerSession();
  if (!isAdminSession(session)) {
    redirect(`/${locale}/auth`);
  }
  const dashboardData = await getDashboardData();

  return <AdminShell initialData={dashboardData} />;
}
