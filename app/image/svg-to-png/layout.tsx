import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("/image/svg-to-png");

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
