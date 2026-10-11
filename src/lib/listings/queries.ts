import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/lib/listings/types";

function mapListing(
  vendor: Record<string, unknown>,
  photos: Record<string, unknown>[],
  prices: Record<string, unknown>[],
  slots: Record<string, unknown>[],
): Listing {
  return {
    id: String(vendor.id),
    name: String(vendor.name),
    specialty: String(vendor.specialty ?? ""),
    location: String(vendor.location ?? ""),
    bio: String(vendor.bio ?? ""),
    rating: Number(vendor.rating ?? 0),
    coverUrl: String(vendor.cover_url ?? ""),
    ownerProfileId: vendor.owner_profile_id ? String(vendor.owner_profile_id) : null,
    photos: photos.map((row) => ({ id: String(row.id), url: String(row.url) })),
    prices: prices.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      price: Number(row.price ?? 0),
      unit: String(row.unit ?? "EGP"),
    })),
    slots: slots.map((row) => ({
      id: String(row.id),
      date: String(row.slot_date),
      booked: Boolean(row.is_booked),
    })),
  };
}

export async function getListings(): Promise<Listing[]> {
  const supabase = await createClient();
  const { data: vendors } = await supabase.from("vendors").select("*").eq("status", "approved").order("created_at", { ascending: false });
  if (!vendors?.length) {
    return [];
  }

  const ids = vendors.map((row) => row.id as string);
  const [{ data: photos }, { data: prices }, { data: slots }] = await Promise.all([
    supabase.from("vendor_photos").select("*").in("vendor_id", ids).order("sort_order"),
    supabase.from("vendor_prices").select("*").in("vendor_id", ids).order("created_at"),
    supabase.from("availability_slots").select("*").in("vendor_id", ids).order("slot_date"),
  ]);

  return vendors.map((vendor) =>
    mapListing(
      vendor as Record<string, unknown>,
      (photos ?? []).filter((row) => row.vendor_id === vendor.id) as Record<string, unknown>[],
      (prices ?? []).filter((row) => row.vendor_id === vendor.id) as Record<string, unknown>[],
      (slots ?? []).filter((row) => row.vendor_id === vendor.id) as Record<string, unknown>[],
    ),
  );
}

export async function getListing(id: string): Promise<Listing | null> {
  const supabase = await createClient();
  const { data: vendor } = await supabase.from("vendors").select("*").eq("id", id).maybeSingle();
  if (!vendor) {
    return null;
  }
  const [{ data: photos }, { data: prices }, { data: slots }] = await Promise.all([
    supabase.from("vendor_photos").select("*").eq("vendor_id", id).order("sort_order"),
    supabase.from("vendor_prices").select("*").eq("vendor_id", id).order("created_at"),
    supabase.from("availability_slots").select("*").eq("vendor_id", id).order("slot_date"),
  ]);
  return mapListing(
    vendor as Record<string, unknown>,
    (photos ?? []) as Record<string, unknown>[],
    (prices ?? []) as Record<string, unknown>[],
    (slots ?? []) as Record<string, unknown>[],
  );
}

export async function getOwnedListing(profileId: string): Promise<Listing | null> {
  const supabase = await createClient();
  const { data: vendor } = await supabase.from("vendors").select("*").eq("owner_profile_id", profileId).maybeSingle();
  if (!vendor) {
    return null;
  }
  return getListing(String(vendor.id));
}
