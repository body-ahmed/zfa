export type Role = "super_admin" | "admin" | "manager" | "viewer";
export type UserStatus = "active" | "pending" | "suspended";
export type VendorStatus = "approved" | "review" | "suspended";
export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  lastActive: string;
  department: string;
}

export interface VendorRecord {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  priceLevel: "budget" | "mid" | "premium";
  status: VendorStatus;
  featured: boolean;
  bio: string;
}

export interface BookingRecord {
  id: string;
  clientName: string;
  vendorName: string;
  service: string;
  status: BookingStatus;
  date: string;
  amount: number;
  location: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
}

export interface ServiceRecord {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  duration: string;
  featured: boolean;
}

export interface ContentBlockRecord {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
}

export interface AdminSettings {
  brandName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  currency: string;
  locale: string;
}

export interface RolePermission {
  role: Role;
  description: string;
  scope: string[];
}

export interface AdminStore {
  users: UserRecord[];
  vendors: VendorRecord[];
  bookings: BookingRecord[];
  categories: CategoryRecord[];
  services: ServiceRecord[];
  contentBlocks: ContentBlockRecord[];
  settings: AdminSettings;
  rolePermissions: RolePermission[];
}
