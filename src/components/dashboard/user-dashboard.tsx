"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarHeart, CheckCircle2, CircleDollarSign, ClipboardList, LogOut, Sparkles, Store } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthSession } from "@/lib/auth/mock-auth";
import { clearStoredSession } from "@/lib/auth/mock-auth";
import type { BookingRecord, VendorRecord } from "@/lib/admin/types";
import { createDefaultPlan, planStorageKey, type WeddingPlan } from "@/lib/dashboard/defaults";

const tabs = [
  { key: "overview", label: "Overview", icon: Sparkles },
  { key: "checklist", label: "Checklist", icon: ClipboardList },
  { key: "budget", label: "Budget", icon: CircleDollarSign },
  { key: "bookings", label: "Bookings", icon: CalendarHeart },
  { key: "vendors", label: "Vendors", icon: Store },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function UserDashboard({
  session,
  locale,
  vendors,
  bookings,
  dataSource,
}: {
  session: AuthSession;
  locale: string;
  vendors: VendorRecord[];
  bookings: BookingRecord[];
  dataSource: "supabase" | "mock";
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [plan, setPlan] = useState<WeddingPlan>(() => createDefaultPlan());
  const [savedVendorIds, setSavedVendorIds] = useState<string[]>([]);

  useEffect(() => {
    const rawPlan = window.localStorage.getItem(planStorageKey(session.id));
    if (rawPlan) {
      try {
        setPlan(JSON.parse(rawPlan) as WeddingPlan);
      } catch {
        setPlan(createDefaultPlan());
      }
    }

    const rawSaved = window.localStorage.getItem(`zaffa.saved.${session.id}`);
    if (rawSaved) {
      try {
        setSavedVendorIds(JSON.parse(rawSaved) as string[]);
      } catch {
        setSavedVendorIds([]);
      }
    }
  }, [session.id]);

  useEffect(() => {
    window.localStorage.setItem(planStorageKey(session.id), JSON.stringify(plan));
  }, [plan, session.id]);

  useEffect(() => {
    window.localStorage.setItem(`zaffa.saved.${session.id}`, JSON.stringify(savedVendorIds));
  }, [savedVendorIds, session.id]);

  const checklistProgress = useMemo(() => {
    if (plan.checklist.length === 0) {
      return 0;
    }
    const done = plan.checklist.filter((item) => item.done).length;
    return Math.round((done / plan.checklist.length) * 100);
  }, [plan.checklist]);

  const budgetSummary = useMemo(() => {
    const planned = plan.budget.reduce((sum, line) => sum + line.planned, 0);
    const spent = plan.budget.reduce((sum, line) => sum + line.spent, 0);
    return { planned, spent, remaining: plan.budgetTotal - spent };
  }, [plan.budget, plan.budgetTotal]);

  const savedVendors = vendors.filter((vendor) => savedVendorIds.includes(vendor.id));
  const myBookings = bookings.filter(
    (booking) => booking.clientName.toLowerCase() === session.name.toLowerCase() || booking.clientName.toLowerCase().includes(session.name.split(" ")[0]?.toLowerCase() ?? ""),
  );

  async function handleLogout() {
    clearStoredSession();
    await fetch("/api/auth/session", { method: "DELETE" });
    window.location.href = `/${locale}/auth`;
  }

  function toggleChecklist(id: string) {
    setPlan((current) => ({
      ...current,
      checklist: current.checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    }));
  }

  function updateBudgetLine(id: string, field: "planned" | "spent", value: number) {
    setPlan((current) => ({
      ...current,
      budget: current.budget.map((line) => (line.id === id ? { ...line, [field]: value } : line)),
    }));
  }

  function toggleSavedVendor(id: string) {
    setSavedVendorIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="mx-auto max-w-7xl px-margin-mobile py-10 md:px-margin-desktop">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Your wedding workspace</p>
          <h1 className="mt-2 font-display text-headline-md font-bold text-on-background">
            {session.name}, everything for your day in one place.
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Role: {session.role} · Data: {dataSource === "supabase" ? "Live Supabase" : "Demo data (connect Supabase for sync)"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/providers">Browse vendors</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/agent">Planning assistant</Link>
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Checklist progress", value: `${checklistProgress}%` },
          { label: "Budget spent", value: `SAR ${budgetSummary.spent.toLocaleString()}` },
          { label: "Bookings", value: String(myBookings.length || bookings.length) },
          { label: "Saved vendors", value: String(savedVendors.length) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-outline-variant/60 bg-surface-container-low/70 p-4">
            <p className="text-xs uppercase tracking-wide text-on-surface-variant">{stat.label}</p>
            <p className="mt-1 font-display text-title-lg font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
              activeTab === tab.key ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[2rem] border border-outline-variant/60 bg-background/70 p-6 shadow-sm">
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <h2 className="font-display text-title-lg font-semibold">Wedding details</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block text-on-surface-variant">Wedding date</span>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2"
                    value={plan.weddingDate}
                    onChange={(event) => setPlan((current) => ({ ...current, weddingDate: event.target.value }))}
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-on-surface-variant">Guest count</span>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2"
                    value={plan.guestCount}
                    onChange={(event) => setPlan((current) => ({ ...current, guestCount: Number(event.target.value) }))}
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  <span className="mb-1 block text-on-surface-variant">Venue</span>
                  <input
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2"
                    value={plan.venue}
                    onChange={(event) => setPlan((current) => ({ ...current, venue: event.target.value }))}
                    placeholder="Preferred venue or city"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block text-on-surface-variant">Planning notes</span>
                <textarea
                  className="min-h-28 w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2"
                  value={plan.notes}
                  onChange={(event) => setPlan((current) => ({ ...current, notes: event.target.value }))}
                />
              </label>
            </div>
            <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-5">
              <h3 className="font-display text-title-md font-semibold">Profile</h3>
              <dl className="mt-4 space-y-2 text-sm text-on-surface-variant">
                <div>
                  <dt className="font-semibold text-on-background">Email</dt>
                  <dd>{session.email}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-on-background">Phone</dt>
                  <dd>{session.phone}</dd>
                </div>
              </dl>
              <div className="mt-4 rounded-xl bg-primary-container/40 p-3 text-sm text-on-surface-variant">
                Your checklist and budget auto-save in this browser. Connect Supabase to sync across devices.
              </div>
            </div>
          </div>
        )}

        {activeTab === "checklist" && (
          <ul className="space-y-3">
            {plan.checklist.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggleChecklist(item.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-low px-4 py-3 text-left"
                >
                  <CheckCircle2 className={cn("h-5 w-5", item.done ? "text-primary" : "text-on-surface-variant")} />
                  <span className={cn("flex-1 text-sm", item.done && "line-through text-on-surface-variant")}>{item.label}</span>
                  <span className="rounded-full bg-background px-2 py-1 text-xs capitalize">{item.category}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {activeTab === "budget" && (
          <div className="space-y-4">
            <label className="block max-w-xs text-sm">
              <span className="mb-1 block text-on-surface-variant">Total budget (SAR)</span>
              <input
                type="number"
                className="w-full rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2"
                value={plan.budgetTotal}
                onChange={(event) => setPlan((current) => ({ ...current, budgetTotal: Number(event.target.value) }))}
              />
            </label>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-on-surface-variant">
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Planned</th>
                    <th className="py-2">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.budget.map((line) => (
                    <tr key={line.id} className="border-t border-outline-variant/40">
                      <td className="py-3 pr-4 font-medium">{line.category}</td>
                      <td className="py-3 pr-4">
                        <input
                          type="number"
                          className="w-28 rounded-lg border border-outline-variant/60 bg-surface-container-low px-2 py-1"
                          value={line.planned}
                          onChange={(event) => updateBudgetLine(line.id, "planned", Number(event.target.value))}
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          className="w-28 rounded-lg border border-outline-variant/60 bg-surface-container-low px-2 py-1"
                          value={line.spent}
                          onChange={(event) => updateBudgetLine(line.id, "spent", Number(event.target.value))}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-on-surface-variant">
              Remaining after spent: <span className="font-semibold text-on-background">SAR {budgetSummary.remaining.toLocaleString()}</span>
            </p>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-3">
            {(myBookings.length > 0 ? myBookings : bookings).map((booking) => (
              <div key={booking.id} className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{booking.vendorName}</p>
                  <span className="rounded-full bg-primary-container px-3 py-1 text-xs capitalize">{booking.status}</span>
                </div>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {booking.service} · {booking.date} · {booking.location}
                </p>
                <p className="mt-2 text-sm font-medium">SAR {booking.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "vendors" && (
          <div className="space-y-3">
            {vendors.slice(0, 12).map((vendor) => (
              <div key={vendor.id} className="flex flex-col gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-low p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{vendor.name}</p>
                  <p className="text-sm text-on-surface-variant">
                    {vendor.specialty} · {vendor.location} · ★ {vendor.rating}
                  </p>
                </div>
                <Button variant={savedVendorIds.includes(vendor.id) ? "default" : "outline"} onClick={() => toggleSavedVendor(vendor.id)}>
                  {savedVendorIds.includes(vendor.id) ? "Saved" : "Save vendor"}
                </Button>
              </div>
            ))}
            {savedVendors.length > 0 ? (
              <p className="text-sm text-on-surface-variant">You saved {savedVendors.length} vendor(s) for your shortlist.</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
