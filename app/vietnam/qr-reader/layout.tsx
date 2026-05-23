import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("/vietnam/qr-reader");

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
