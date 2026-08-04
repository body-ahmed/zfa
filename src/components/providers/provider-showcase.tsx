"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, MapPin, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

const providers = [
  {
    name: "Elysian Events",
    specialty: "Luxury wedding planning",
    location: "Riyadh",
    rating: 4.9,
    price: "Premium",
    blurb: "Immersive full-service planning for grand celebrations and refined guest experiences.",
  },
  {
    name: "Nour Studios",
    specialty: "Editorial photography",
    location: "Jeddah",
    rating: 4.8,
    price: "Mid",
    blurb: "Candid and cinematic storytelling with a focus on emotional detail.",
  },
  {
    name: "Velvet & Vine",
    specialty: "Floral design",
    location: "Dubai",
    rating: 4.7,
    price: "Premium",
    blurb: "Statement installations and romantic arrangements tailored to the venue.",
  },
];

export function ProviderShowcase() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-outline-variant/60 bg-surface-container-low/70 p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Verified providers</p>
          <h2 className="mt-2 font-display text-headline-sm font-semibold text-on-background">Discover the best wedding partners in the region</h2>
          <p className="mt-3 max-w-2xl text-sm text-on-surface-variant">Curated venues, photographers, planners, and service teams with transparent reviews and fast availability.</p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/admin">Open admin dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {providers.map((provider, index) => (
          <motion.article
            key={provider.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="rounded-[1.75rem] border border-outline-variant/60 bg-background/80 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-title-lg font-semibold text-on-background">{provider.name}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{provider.specialty}</p>
              </div>
              <div className="rounded-full bg-primary-container/70 p-2 text-on-primary-container">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-on-surface-variant">{provider.blurb}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1">
                <MapPin className="h-3.5 w-3.5" /> {provider.location}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1">
                <Star className="h-3.5 w-3.5" /> {provider.rating}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1">
                <Heart className="h-3.5 w-3.5" /> {provider.price}
              </span>
            </div>

            <Button className="mt-6 w-full" variant="outline" asChild>
              <Link href="/agent">
                Request quote <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
