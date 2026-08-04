import { setRequestLocale } from "next-intl/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { getDashboardData } from "@/lib/supabase/service";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dashboardData = await getDashboardData();

  return <AdminShell initialData={dashboardData} />;
}
