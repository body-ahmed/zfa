import type { BookingRecord, CategoryRecord, ContentBlockRecord, ServiceRecord, UserRecord, VendorRecord } from "@/lib/admin/types";

export function mapProfile(row: Record<string, unknown>): UserRecord {
  return {
    id: String(row.id),
    name: String(row.full_name ?? row.name ?? "User"),
    email: String(row.email ?? ""),
    role: (row.role as UserRecord["role"]) ?? "viewer",
    status: (row.status as UserRecord["status"]) ?? "active",
    lastActive: String(row.updated_at ?? row.created_at ?? new Date().toISOString()),
    department: String(row.department ?? "General"),
  };
}

export function mapVendor(row: Record<string, unknown>): VendorRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    specialty: String(row.specialty),
    location: String(row.location),
    rating: Number(row.rating ?? 0),
    priceLevel: (row.price_level as VendorRecord["priceLevel"]) ?? "mid",
    status: (row.status as VendorRecord["status"]) ?? "review",
    featured: Boolean(row.featured),
    bio: String(row.bio ?? ""),
  };
}

export function mapBooking(row: Record<string, unknown>): BookingRecord {
  return {
    id: String(row.id),
    clientName: String(row.client_name),
    vendorName: String(row.vendor_name),
    service: String(row.service),
    status: (row.status as BookingRecord["status"]) ?? "pending",
    date: String(row.booking_date ?? row.date ?? ""),
    amount: Number(row.amount ?? 0),
    location: String(row.location),
  };
}

export function mapCategory(row: Record<string, unknown>): CategoryRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    active: Boolean(row.active ?? true),
  };
}

export function mapService(row: Record<string, unknown>): ServiceRecord {
  return {
    id: String(row.id),
    categoryId: String(row.category_id ?? ""),
    name: String(row.name),
    price: Number(row.price ?? 0),
    duration: String(row.duration ?? ""),
    featured: Boolean(row.featured),
  };
}

export function mapContentBlock(row: Record<string, unknown>): ContentBlockRecord {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    status: (row.status as ContentBlockRecord["status"]) ?? "draft",
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}
