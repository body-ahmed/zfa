import type { Metadata } from "next";
import { siteMetadata } from "./metadata";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
