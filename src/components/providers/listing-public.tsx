"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Listing } from "@/lib/listings/types";

export function ListingPublic({ listing }: { listing: Listing }) {
  const [slots, setSlots] = useState(listing.slots);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function book(id: string) {
    setBusy(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.rpc("book_availability_slot", { p_slot_id: id });
    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }
    setSlots((current) => current.map((slot) => (slot.id === id ? { ...slot, booked: true } : slot)));
    setMessage("تم حجز اليوم.");
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-margin-mobile py-12 md:px-margin-desktop">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-primary">{listing.specialty}</p>
        <h1 className="mt-2 font-display text-headline-md font-bold">{listing.name}</h1>
        <p className="mt-2 text-on-surface-variant">{listing.location}</p>
        <p className="mt-4 max-w-2xl text-sm text-on-surface-variant">{listing.bio}</p>
      </div>

      {listing.photos.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {listing.photos.map((photo) => (
            <img key={photo.id} src={photo.url} alt="" className="h-48 w-full rounded-2xl object-cover" />
          ))}
        </div>
      ) : null}

      <section>
        <h2 className="font-display text-title-lg font-semibold">الأسعار</h2>
        <ul className="mt-3 space-y-2">
          {listing.prices.map((price) => (
            <li key={price.id} className="flex justify-between rounded-xl border border-outline-variant/60 px-4 py-3 text-sm">
              <span>{price.title}</span>
              <span>
                {price.price.toLocaleString()} {price.unit}
              </span>
            </li>
          ))}
          {listing.prices.length === 0 ? <li className="text-sm text-on-surface-variant">لسه مفيش أسعار.</li> : null}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-title-lg font-semibold">المواعيد</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              disabled={slot.booked || busy}
              onClick={() => void book(slot.id)}
              className={`rounded-xl border px-3 py-3 text-sm ${slot.booked ? "bg-surface-container-high text-on-surface-variant" : "border-primary/40 bg-primary/10"}`}
            >
              <p>{slot.date}</p>
              <p className="mt-1 text-xs">{slot.booked ? "محجوز" : "متاح — احجز"}</p>
            </button>
          ))}
        </div>
        {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}
      </section>
    </div>
  );
}
