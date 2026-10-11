import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getListing } from "@/lib/listings/queries";
import { ListingPublic } from "@/components/providers/listing-public";

export const dynamic = "force-dynamic";

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const listing = await getListing(id);
  if (!listing) {
    notFound();
  }
  return <ListingPublic listing={listing} />;
}
