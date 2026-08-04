import { createClient } from "@/lib/supabase/server";
import { adminMockData } from "@/lib/admin/mock-data";

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
    const [{ data: users }, { data: vendors }, { data: bookings }, { data: categories }, { data: services }, { data: contentBlocks }] = await Promise.all([
      supabase.from("users").select("*").order("id"),
      supabase.from("vendors").select("*").order("id"),
      supabase.from("bookings").select("*").order("id"),
      supabase.from("categories").select("*").order("id"),
      supabase.from("services").select("*").order("id"),
      supabase.from("content_blocks").select("*").order("id"),
    ]);

    return {
      data: {
        ...adminMockData,
        users: users ?? [],
        vendors: vendors ?? [],
        bookings: bookings ?? [],
        categories: categories ?? [],
        services: services ?? [],
        contentBlocks: contentBlocks ?? [],
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
