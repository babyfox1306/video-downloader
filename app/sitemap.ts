import type { MetadataRoute } from "next";
import { PAGE_SEO, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return Object.entries(PAGE_SEO).map(([path, seo]) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency:
      (seo.changeFrequency as MetadataRoute.Sitemap[0]["changeFrequency"]) ??
      (path.split("/").length <= 2 ? "weekly" : "monthly"),
    priority: seo.priority ?? (path === "/" ? 1 : path.split("/").length <= 2 ? 0.85 : 0.7),
  }));
}
