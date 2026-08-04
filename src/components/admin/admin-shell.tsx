"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Building2, LayoutGrid, ShieldCheck, Settings, Users, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdminStore } from "@/lib/admin/types";

const tabs = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "users", label: "Users", icon: Users },
  { key: "vendors", label: "Vendors", icon: Building2 },
  { key: "bookings", label: "Bookings", icon: BookOpen },
  { key: "content", label: "Content", icon: WandSparkles },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

export function AdminShell({ initialData }: { initialData?: { data: AdminStore; source: string; configured: boolean } }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("overview");
  const data = useMemo(() => {
    return (
      initialData?.data ?? {
        users: [],
        vendors: [],
        bookings: [],
        categories: [],
        services: [],
        contentBlocks: [],
        settings: { brandName: "Zaffa", supportEmail: "support@zaffa.com", maintenanceMode: false, currency: "SAR", locale: "en" },
        rolePermissions: [],
      }
    );
  }, [initialData]);

  const stats = useMemo(
    () => [
      { label: "Active users", value: data.users.length.toString() },
      { label: "Vendors", value: data.vendors.length.toString() },
      { label: "Bookings", value: data.bookings.length.toString() },
      { label: "Revenue", value: "SAR 142k" },
    ],
    [data],
  );

  return (
    <div className="mx-auto max-w-7xl px-margin-mobile py-10 md:px-margin-desktop">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-outline-variant/60 bg-surface-container-low/70 p-6 shadow-sm backdrop-blur"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Admin dashboard</p>
            <h1 className="mt-2 font-display text-headline-md font-bold text-on-background">Command center for wedding operations</h1>
            <p className="mt-3 max-w-2xl text-sm text-on-surface-variant">Manage users, vendors, bookings, content, and platform settings from one premium workspace.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-outline-variant bg-background/70 px-4 py-2 text-sm text-on-surface-variant">
            <ShieldCheck className="h-4 w-4 text-primary" />
            RBAC enabled
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <Button
                key={tab.key}
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.key)}
                className={cn("rounded-full", active && "shadow-sm")}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-2xl border border-outline-variant/60 bg-background/70 p-4"
            >
              <p className="text-sm text-on-surface-variant">{stat.label}</p>
              <p className="mt-2 font-display text-title-lg font-semibold text-on-background">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-6 rounded-3xl border border-outline-variant/60 bg-background/70 p-4"
          >
            {activeTab === "overview" && <OverviewPanel data={data} />}
            {activeTab === "users" && <UsersPanel data={data} />}
            {activeTab === "vendors" && <VendorsPanel data={data} />}
            {activeTab === "bookings" && <BookingsPanel data={data} />}
            {activeTab === "content" && <ContentPanel data={data} />}
            {activeTab === "settings" && <SettingsPanel data={data} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function OverviewPanel({ data }: { data: AdminStore }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-title-lg font-semibold">Performance snapshot</h2>
          <div className="rounded-full bg-primary-container px-3 py-1 text-sm text-on-primary-container">+18% this month</div>
        </div>
        <div className="mt-4 h-36 rounded-2xl bg-gradient-to-r from-primary/20 via-primary-container/40 to-secondary-container p-4">
          <div className="flex h-full items-end gap-3">
            {[48, 66, 54, 78, 72, 92].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-xl bg-primary/70" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-5">
        <h2 className="font-display text-title-lg font-semibold">Recent activity</h2>
        <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
          <li>New vendor review submitted for Elysian Events.</li>
          <li>Two bookings moved to confirmed status.</li>
          <li>Homepage content block scheduled for publication.</li>
        </ul>
      </div>
    </div>
  );
}

function UsersPanel({ data }: { data: AdminStore }) {
  return (
    <div className="space-y-3">
      {data.users.map((user) => (
        <div key={user.id} className="flex flex-col gap-3 rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-on-background">{user.name}</p>
            <p className="text-sm text-on-surface-variant">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-primary-container px-3 py-1 text-on-primary-container">{user.role}</span>
            <span className="rounded-full bg-surface-container-high px-3 py-1">{user.department}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function VendorsPanel({ data }: { data: AdminStore }) {
  return (
    <div className="space-y-3">
      {data.vendors.map((vendor) => (
        <div key={vendor.id} className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-on-background">{vendor.name}</p>
              <p className="text-sm text-on-surface-variant">{vendor.specialty} • {vendor.location}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-primary-container px-3 py-1 text-on-primary-container">★ {vendor.rating}</span>
              <span className="rounded-full bg-surface-container-high px-3 py-1">{vendor.status}</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-on-surface-variant">{vendor.bio}</p>
        </div>
      ))}
    </div>
  );
}

function BookingsPanel({ data }: { data: AdminStore }) {
  return (
    <div className="space-y-3">
      {data.bookings.map((booking) => (
        <div key={booking.id} className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-on-background">{booking.clientName}</p>
              <p className="text-sm text-on-surface-variant">{booking.service} • {booking.vendorName}</p>
            </div>
            <div className="text-sm text-on-surface-variant">{booking.date} • SAR {booking.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContentPanel({ data }: { data: AdminStore }) {
  return (
    <div className="space-y-3">
      {data.contentBlocks.map((block) => (
        <div key={block.id} className="flex flex-col gap-3 rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-on-background">{block.title}</p>
            <p className="text-sm text-on-surface-variant">/{block.slug}</p>
          </div>
          <div className="text-sm text-on-surface-variant">{block.status} • {block.updatedAt}</div>
        </div>
      ))}
    </div>
  );
}

function SettingsPanel({ data }: { data: AdminStore }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4">
        <h3 className="font-display text-title-lg font-semibold">Brand settings</h3>
        <div className="mt-3 space-y-2 text-sm text-on-surface-variant">
          <p>Brand: {data.settings.brandName}</p>
          <p>Support email: {data.settings.supportEmail}</p>
          <p>Currency: {data.settings.currency}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-4">
        <h3 className="font-display text-title-lg font-semibold">RBAC matrix</h3>
        <div className="mt-3 space-y-2 text-sm text-on-surface-variant">
          {data.rolePermissions.map((permission) => (
            <div key={permission.role} className="rounded-xl bg-background/70 p-3">
              <p className="font-medium text-on-background">{permission.role}</p>
              <p>{permission.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
