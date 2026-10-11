import { adminMockData } from "@/lib/admin/mock-data";
import type { BookingRecord, VendorRecord } from "@/lib/admin/types";
import { createClient } from "@/lib/supabase/server";
import { mapBooking, mapVendor } from "@/lib/supabase/map-rows";

const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.includes(".supabase.co") &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder-anon-key",
);

export async function getUserDashboardData(): Promise<{
  vendors: VendorRecord[];
  bookings: BookingRecord[];
  source: "supabase" | "mock";
}> {
  if (!isConfigured) {
    return {
      vendors: adminMockData.vendors,
      bookings: adminMockData.bookings,
      source: "mock",
    };
  }

  try {
    const supabase = await createClient();
    const [{ data: vendors }, { data: bookings }] = await Promise.all([
      supabase.from("vendors").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").order("booking_date", { ascending: true }),
    ]);

    return {
      vendors: (vendors ?? []).map((row) => mapVendor(row as Record<string, unknown>)),
      bookings: (bookings ?? []).map((row) => mapBooking(row as Record<string, unknown>)),
      source: "supabase",
    };
  } catch {
    return {
      vendors: adminMockData.vendors,
      bookings: adminMockData.bookings,
      source: "mock",
    };
  }
}
