import { adminMockData } from "@/lib/admin/mock-data";
import type { BookingRecord, VendorRecord } from "@/lib/admin/types";
import type { AuthSession } from "@/lib/auth/mock-auth";
import { createClient } from "@/lib/supabase/server";
import { mapBooking, mapVendor } from "@/lib/supabase/map-rows";
import type { WalletSummary, WalletTransaction } from "@/lib/wallet/types";

const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.includes(".supabase.co") &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder-anon-key",
);

export async function getUserDashboardData(session?: AuthSession | null): Promise<{
  vendors: VendorRecord[];
  bookings: BookingRecord[];
  wallet: WalletSummary | null;
  transactions: WalletTransaction[];
  source: "supabase" | "mock";
}> {
  const emptyWallet = {
    vendors: adminMockData.vendors,
    bookings: adminMockData.bookings,
    wallet: null,
    transactions: [] as WalletTransaction[],
    source: "mock" as const,
  };

  if (!isConfigured) {
    return emptyWallet;
  }

  try {
    const supabase = await createClient();
    const [{ data: vendors }, { data: bookings }] = await Promise.all([
      supabase.from("vendors").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").order("booking_date", { ascending: true }),
    ]);

    let wallet: WalletSummary | null = null;
    let transactions: WalletTransaction[] = [];

    if (session?.id) {
      const { data: walletRow } = await supabase.from("wallets").select("id, balance, currency").eq("profile_id", session.id).maybeSingle();
      if (walletRow) {
        wallet = {
          id: String(walletRow.id),
          balance: Number(walletRow.balance ?? 0),
          currency: String(walletRow.currency ?? "SAR"),
        };
        const { data: txRows } = await supabase
          .from("wallet_transactions")
          .select("id, amount, kind, note, created_at")
          .eq("wallet_id", wallet.id)
          .order("created_at", { ascending: false })
          .limit(20);
        transactions = (txRows ?? []).map((row) => ({
          id: String(row.id),
          amount: Number(row.amount ?? 0),
          kind: row.kind as WalletTransaction["kind"],
          note: String(row.note ?? ""),
          createdAt: String(row.created_at),
        }));
      }
    }

    return {
      vendors: (vendors ?? []).map((row) => mapVendor(row as Record<string, unknown>)),
      bookings: (bookings ?? []).map((row) => mapBooking(row as Record<string, unknown>)),
      wallet,
      transactions,
      source: "supabase",
    };
  } catch {
    return emptyWallet;
  }
}
