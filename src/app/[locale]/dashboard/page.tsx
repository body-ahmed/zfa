import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { getServerSession } from "@/lib/auth/session-server";
import { getUserDashboardData } from "@/lib/supabase/public-data";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession();
  if (!session) {
    redirect(`/${locale}/auth`);
  }

  const { vendors, bookings, wallet, transactions, source } = await getUserDashboardData(session);

  return (
    <UserDashboard
      session={session}
      locale={locale}
      vendors={vendors}
      bookings={bookings}
      wallet={wallet}
      transactions={transactions}
      dataSource={source}
    />
  );
}
