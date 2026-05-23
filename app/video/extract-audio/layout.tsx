import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("/video/extract-audio");

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
