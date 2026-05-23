import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// Parse paths from lib/seo.ts
const seoFile = fs.readFileSync(path.join(root, "lib", "seo.ts"), "utf8");
const paths = [...seoFile.matchAll(/^\s+"(\/[^"]+)":/gm)].map((m) => m[1]);

const SKIP_LAYOUT = new Set(["/"]); // home uses page.tsx metadata

const layoutTemplate = (routePath) => `import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/seo";

export const metadata: Metadata = getPageMetadata("${routePath}");

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
`;

let created = 0;
for (const routePath of paths) {
  if (SKIP_LAYOUT.has(routePath)) continue;

  const segments = routePath.split("/").filter(Boolean);
  const dir =
    segments.length === 0
      ? path.join(root, "app")
      : path.join(root, "app", ...segments);

  if (!fs.existsSync(dir)) {
    console.warn("Missing dir for route:", routePath, dir);
    continue;
  }

  const layoutPath = path.join(dir, "layout.tsx");
  fs.writeFileSync(layoutPath, layoutTemplate(routePath), "utf8");
  created++;
}

console.log(`Updated ${created} layout.tsx files for SEO.`);
