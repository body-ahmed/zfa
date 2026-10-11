"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Camera, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { AuthSession } from "@/lib/auth/mock-auth";
import type { Listing } from "@/lib/listings/types";

export function AccountStudio({
  session,
  listing,
  isVendor,
}: {
  session: AuthSession;
  listing: Listing | null;
  isVendor: boolean;
}) {
  const locale = useLocale();
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState(listing?.name ?? session.name);
  const [specialty, setSpecialty] = useState(listing?.specialty ?? "");
  const [location, setLocation] = useState(listing?.location ?? "Egypt");
  const [bio, setBio] = useState(listing?.bio ?? "");
  const [photos, setPhotos] = useState(listing?.photos ?? []);
  const [prices, setPrices] = useState(listing?.prices ?? []);
  const [slots, setSlots] = useState(listing?.slots ?? []);
  const [priceTitle, setPriceTitle] = useState("");
  const [priceAmount, setPriceAmount] = useState("0");
  const [slotDate, setSlotDate] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [vendorId, setVendorId] = useState(listing?.id ?? "");

  async function ensureVendor() {
    if (vendorId) {
      return vendorId;
    }
    await supabase.rpc("ensure_my_profile");
    const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", (await supabase.auth.getUser()).data.user?.id).maybeSingle();
    if (!profile?.id) {
      throw new Error("Profile could not be created.");
    }
    const { data: existing } = await supabase.from("vendors").select("id").eq("owner_profile_id", profile.id).maybeSingle();
    if (existing?.id) {
      setVendorId(String(existing.id));
      return String(existing.id);
    }
    const { data: created, error } = await supabase
      .from("vendors")
      .insert({
        name,
        specialty: specialty || "Wedding services",
        location: location || "Egypt",
        bio,
        status: "approved",
        owner_profile_id: profile.id,
      })
      .select("id")
      .single();
    if (error || !created) {
      throw new Error(error?.message ?? "Could not open a listing.");
    }
    setVendorId(String(created.id));
    return String(created.id);
  }

  async function saveProfile() {
    setBusy(true);
    setMessage("");
    try {
      const id = await ensureVendor();
      const { error } = await supabase
        .from("vendors")
        .update({ name, specialty, location, bio, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) {
        throw error;
      }
      await supabase.from("profiles").update({ full_name: name, city: location, bio }).eq("id", session.id);
      setMessage("تم حفظ البروفايل.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    }
    setBusy(false);
  }

  async function uploadPhoto(file: File) {
    setBusy(true);
    setMessage("");
    try {
      const id = await ensureVendor();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Sign in again.");
      }
      const path = `${user.id}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage.from("listing-photos").upload(path, file, { upsert: false });
      if (uploadError) {
        throw uploadError;
      }
      const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
      const { data: row, error } = await supabase.from("vendor_photos").insert({ vendor_id: id, url: data.publicUrl, sort_order: photos.length }).select("id, url").single();
      if (error || !row) {
        throw error ?? new Error("Photo save failed.");
      }
      setPhotos((current) => [...current, { id: String(row.id), url: String(row.url) }]);
      if (!listing?.coverUrl) {
        await supabase.from("vendors").update({ cover_url: data.publicUrl }).eq("id", id);
      }
      setMessage("اترفعِت الصورة.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
    setBusy(false);
  }

  async function addPrice() {
    if (!priceTitle.trim()) {
      return;
    }
    setBusy(true);
    try {
      const id = await ensureVendor();
      const { data, error } = await supabase
        .from("vendor_prices")
        .insert({ vendor_id: id, title: priceTitle.trim(), price: Number(priceAmount) || 0, unit: "EGP" })
        .select("id, title, price, unit")
        .single();
      if (error || !data) {
        throw error ?? new Error("Could not add price.");
      }
      setPrices((current) => [...current, { id: String(data.id), title: String(data.title), price: Number(data.price), unit: String(data.unit) }]);
      setPriceTitle("");
      setPriceAmount("0");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Price failed.");
    }
    setBusy(false);
  }

  async function removePrice(id: string) {
    await supabase.from("vendor_prices").delete().eq("id", id);
    setPrices((current) => current.filter((item) => item.id !== id));
  }

  async function addSlot() {
    if (!slotDate) {
      return;
    }
    setBusy(true);
    try {
      const id = await ensureVendor();
      const { data, error } = await supabase
        .from("availability_slots")
        .insert({ vendor_id: id, slot_date: slotDate, is_booked: false })
        .select("id, slot_date, is_booked")
        .single();
      if (error || !data) {
        throw error ?? new Error("Date already exists.");
      }
      setSlots((current) => [...current, { id: String(data.id), date: String(data.slot_date), booked: Boolean(data.is_booked) }].sort((a, b) => a.date.localeCompare(b.date)));
      setSlotDate("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Slot failed.");
    }
    setBusy(false);
  }

  async function toggleSlot(id: string, booked: boolean) {
    if (booked) {
      return;
    }
    await supabase.from("availability_slots").update({ is_booked: true }).eq("id", id);
    setSlots((current) => current.map((slot) => (slot.id === id ? { ...slot, booked: true } : slot)));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-margin-mobile py-10 md:px-margin-desktop">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">حسابك</p>
        <h1 className="mt-2 font-display text-headline-md font-bold">بروفايل {session.name}</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          {isVendor ? "ارفع صور، حط أسعارك، وحدد الأيام المتاحة أو المحجوزة." : "ده حسابك. لو هتقدّم خدمة، كمّل بيانات العرض تحت."}
        </p>
      </div>

      <section className="rounded-[1.75rem] border border-outline-variant/60 bg-background/80 p-5">
        <h2 className="font-display text-title-lg font-semibold">البيانات</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} placeholder="الاسم" />
          <input className="rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2" value={specialty} onChange={(event) => setSpecialty(event.target.value)} placeholder="التخصص / الخدمة" />
          <input className="rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2 md:col-span-2" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="المدينة" />
          <textarea className="min-h-24 rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2 md:col-span-2" value={bio} onChange={(event) => setBio(event.target.value)} placeholder="نبذة" />
        </div>
        <Button className="mt-4" onClick={saveProfile} disabled={busy}>
          حفظ البروفايل
        </Button>
      </section>

      <section className="rounded-[1.75rem] border border-outline-variant/60 bg-background/80 p-5">
        <h2 className="font-display text-title-lg font-semibold">الصور</h2>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-on-primary">
          <Camera className="h-4 w-4" />
          رفع صورة
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void uploadPhoto(file);
              }
            }}
          />
        </label>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <img key={photo.id} src={photo.url} alt="" className="h-36 w-full rounded-2xl object-cover" />
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-outline-variant/60 bg-background/80 p-5">
        <h2 className="font-display text-title-lg font-semibold">الأسعار (جنيه)</h2>
        <div className="mt-4 flex flex-col gap-2 md:flex-row">
          <input className="flex-1 rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2" placeholder="اسم الباقة" value={priceTitle} onChange={(event) => setPriceTitle(event.target.value)} />
          <input className="w-32 rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2" type="number" value={priceAmount} onChange={(event) => setPriceAmount(event.target.value)} />
          <Button onClick={addPrice} disabled={busy}>
            <Plus className="h-4 w-4" /> إضافة
          </Button>
        </div>
        <ul className="mt-4 space-y-2">
          {prices.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded-xl border border-outline-variant/60 px-4 py-3 text-sm">
              <span>{item.title}</span>
              <span className="flex items-center gap-3">
                {item.price.toLocaleString()} {item.unit}
                <button type="button" onClick={() => void removePrice(item.id)} aria-label="delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[1.75rem] border border-outline-variant/60 bg-background/80 p-5">
        <h2 className="font-display text-title-lg font-semibold">جدول المواعيد</h2>
        <div className="mt-4 flex flex-col gap-2 md:flex-row">
          <input className="rounded-xl border border-outline-variant/60 bg-surface-container-low px-3 py-2" type="date" value={slotDate} onChange={(event) => setSlotDate(event.target.value)} />
          <Button onClick={addSlot} disabled={busy}>
            إضافة يوم متاح
          </Button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => void toggleSlot(slot.id, slot.booked)}
              className={`rounded-xl border px-3 py-3 text-sm ${slot.booked ? "border-outline-variant/40 bg-surface-container-high text-on-surface-variant" : "border-primary/40 bg-primary/10"}`}
            >
              <p>{slot.date}</p>
              <p className="mt-1 text-xs">{slot.booked ? "محجوز" : "متاح"}</p>
            </button>
          ))}
        </div>
      </section>

      <p className="text-sm text-on-surface-variant">المحفظة متأسسة على الحساب وجاهزة للربط لاحقاً. الدفع الحقيقي لسه مش مفعّل.</p>
      {message ? <p className="text-sm text-primary">{message}</p> : null}
      {vendorId ? (
        <a className="text-sm text-primary underline" href={`/${locale}/providers/${vendorId}`}>
          عرض الصفحة العامة
        </a>
      ) : null}
    </div>
  );
}
