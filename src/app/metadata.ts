import type { Metadata } from "next";

export const metadataBase = new URL("https://zaffa.app");

export const siteMetadata: Metadata = {
  title: {
    default: "Zaffa | Wedding planning platform",
    template: "%s | Zaffa",
  },
  description: "Plan your wedding with curated providers, smart planning tools, and a premium assistant experience.",
  keywords: ["wedding planning", "wedding vendors", "event planning", "Saudi weddings"],
  openGraph: {
    title: "Zaffa",
    description: "Plan your wedding with curated providers, smart planning tools, and a premium assistant experience.",
    type: "website",
    siteName: "Zaffa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaffa",
    description: "Plan your wedding with curated providers, smart planning tools, and a premium assistant experience.",
  },
};
