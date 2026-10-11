import { createClient } from "@/lib/supabase/server";
import { adminMockData } from "@/lib/admin/mock-data";
import { mapBooking, mapCategory, mapContentBlock, mapProfile, mapService, mapVendor } from "@/lib/supabase/map-rows";

const hasSupabaseKey = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder-anon-key" &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-"),
);

const hasDatabaseUrl = Boolean(
  process.env.DATABASE_URL &&
    process.env.DATABASE_URL.includes("postgres") &&
    !process.env.DATABASE_URL.includes("[YOUR-PASSWORD]") &&
    !process.env.DATABASE_URL.includes("your-"),
);

const hasSupabaseUrl = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes(".supabase.co") &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder"),
);

const isConfigured = Boolean(hasSupabaseUrl && (hasSupabaseKey || hasDatabaseUrl));

export async function getDashboardData() {
  if (!isConfigured) {
    return {
      data: adminMockData,
      source: "mock" as const,
      configured: false,
    };
  }

  try {
    const supabase = await createClient();
    const [{ data: profiles }, { data: vendors }, { data: bookings }, { data: categories }, { data: services }, { data: contentBlocks }, { data: settingsRows }] =
      await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("vendors").select("*").order("created_at", { ascending: false }),
        supabase.from("bookings").select("*").order("booking_date", { ascending: true }),
        supabase.from("categories").select("*").order("name"),
        supabase.from("services").select("*").order("name"),
        supabase.from("content_blocks").select("*").order("updated_at", { ascending: false }),
        supabase.from("settings").select("*").limit(1),
      ]);

    const settingsRow = settingsRows?.[0] as Record<string, unknown> | undefined;

    return {
      data: {
        ...adminMockData,
        users: (profiles ?? []).map((row) => mapProfile(row as Record<string, unknown>)),
        vendors: (vendors ?? []).map((row) => mapVendor(row as Record<string, unknown>)),
        bookings: (bookings ?? []).map((row) => mapBooking(row as Record<string, unknown>)),
        categories: (categories ?? []).map((row) => mapCategory(row as Record<string, unknown>)),
        services: (services ?? []).map((row) => mapService(row as Record<string, unknown>)),
        contentBlocks: (contentBlocks ?? []).map((row) => mapContentBlock(row as Record<string, unknown>)),
        settings: settingsRow
          ? {
              brandName: String(settingsRow.brand_name ?? adminMockData.settings.brandName),
              supportEmail: String(settingsRow.support_email ?? adminMockData.settings.supportEmail),
              maintenanceMode: Boolean(settingsRow.maintenance_mode),
              currency: String(settingsRow.currency ?? adminMockData.settings.currency),
              locale: String(settingsRow.locale ?? adminMockData.settings.locale),
            }
          : adminMockData.settings,
      },
      source: "supabase" as const,
      configured: true,
    };
  } catch {
    return {
      data: adminMockData,
      source: "mock" as const,
      configured: false,
    };
  }
}
