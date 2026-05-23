import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("/image/heic-to-jpg");

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
