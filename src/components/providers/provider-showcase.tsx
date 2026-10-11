"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import type { Listing } from "@/lib/listings/types";

export function ProviderShowcase({ listings }: { listings: Listing[] }) {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-outline-variant/60 bg-surface-container-low/70 p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">مزودو الخدمات</p>
        <h2 className="mt-2 font-display text-headline-sm font-semibold text-on-background">اختار شركاء يومك من بروفايلات حقيقية</h2>
      </div>

      {listings.length === 0 ? (
        <p className="rounded-2xl border border-outline-variant/60 bg-surface-container-low p-6 text-sm text-on-surface-variant">
          لسه مفيش عروض. أول ما حد يسجّل كمورد هيظهر هنا.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {listings.map((provider, index) => (
            <motion.article
              key={provider.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-[1.75rem] border border-outline-variant/60 bg-background/80 p-5 shadow-sm"
            >
              {provider.coverUrl || provider.photos[0] ? (
                <img src={provider.coverUrl || provider.photos[0]?.url} alt="" className="mb-4 h-36 w-full rounded-2xl object-cover" />
              ) : (
                <div className="mb-4 flex h-36 items-center justify-center rounded-2xl bg-primary-container/40">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              )}
              <p className="font-display text-title-lg font-semibold text-on-background">{provider.name}</p>
              <p className="mt-1 text-sm text-on-surface-variant">{provider.specialty}</p>
              <p className="mt-3 line-clamp-3 text-sm text-on-surface-variant">{provider.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-on-surface-variant">
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1">
                  <MapPin className="h-3.5 w-3.5" /> {provider.location}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1">
                  <Star className="h-3.5 w-3.5" /> {provider.rating}
                </span>
              </div>
              {provider.prices[0] ? (
                <p className="mt-3 text-sm font-medium">
                  من {provider.prices[0].price.toLocaleString()} {provider.prices[0].unit}
                </p>
              ) : null}
              <Button className="mt-6 w-full" asChild>
                <Link href={`/providers/${provider.id}`}>
                  عرض المواعيد والأسعار <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
