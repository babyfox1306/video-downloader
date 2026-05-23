import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AdSenseScript } from "@/components/AdSense";
import { DEFAULT_METADATA } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = DEFAULT_METADATA;

const navItems = [
  { name: "Tải clip", emoji: "⬇️", href: "/downloader" },
  { name: "PDF", emoji: "📄", href: "/pdf" },
  { name: "Ảnh", emoji: "🖼️", href: "/image" },
  { name: "Video", emoji: "🎬", href: "/video" },
  { name: "Tiện ích", emoji: "📝", href: "/text" },
  { name: "Tính toán", emoji: "🧮", href: "/calc" },
  { name: "Việt Nam", emoji: "🇻🇳", href: "/vietnam" },
  { name: "Data", emoji: "📊", href: "/data" },
  { name: "Design", emoji: "🎨", href: "/design" },
  { name: "Meme", emoji: "😂", href: "/meme" },
  { name: "Sound", emoji: "🎵", href: "/soundboard" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] text-[#111827] dark:text-[#F1F5F9] font-sans`}
      >
        <AdSenseScript />

        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#334155] transition-colors">
          <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-[#111827] dark:text-[#F1F5F9] hover:text-[#4F46E5] dark:hover:text-[#6366F1] transition-colors shrink-0"
            >
              ZavClip
            </Link>

            <nav className="hidden lg:flex items-center gap-4 flex-wrap justify-end">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[#6B7280] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F1F5F9] transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-grow pb-20 lg:pb-0">{children}</main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0F172A] border-t border-[#E5E7EB] dark:border-[#334155] py-1.5 px-0.5 flex justify-start items-center z-50 shadow-lg overflow-x-auto gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[9px] font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#4F46E5] dark:hover:text-[#6366F1] transition-colors shrink-0 min-w-[52px]"
            >
              <span className="text-sm leading-none">{item.emoji}</span>
              <span className="text-center truncate max-w-[52px]">{item.name}</span>
            </Link>
          ))}
        </nav>

        <footer className="bg-white dark:bg-[#0F172A] py-8 border-t border-[#E5E7EB] dark:border-[#334155] text-center text-xs text-[#6B7280] dark:text-[#94A3B8] transition-colors">
          <div className="container mx-auto px-4 space-y-2">
            <p className="font-semibold text-[#111827] dark:text-[#F1F5F9]">
              ZavClip — Công cụ văn phòng 100% chạy cục bộ trên trình duyệt
            </p>
            <p>
              © {new Date().getFullYear()} ZavClip. Bảo mật dữ liệu tuyệt đối của bạn.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
