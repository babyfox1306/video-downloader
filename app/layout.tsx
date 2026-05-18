import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZavClip - Công cụ văn phòng online miễn phí",
  description: "Bộ công cụ PDF, ảnh, tính toán, tiện ích Việt Nam - miễn phí, không cần cài đặt, file không rời máy bạn",
};

const navItems = [
  { name: "PDF", emoji: "📄", href: "/pdf" },
  { name: "Ảnh", emoji: "🖼️", href: "/image" },
  { name: "Tiện ích", emoji: "📝", href: "/text" },
  { name: "Tính toán", emoji: "🧮", href: "/calc" },
  { name: "Việt Nam", emoji: "🇻🇳", href: "/vietnam" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}
      >
        {/* Top Navigation Bar (Desktop) */}
        <nav className="hidden md:flex justify-center items-center gap-6 bg-gray-900 text-white py-4 px-6 shadow-lg z-50">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold flex items-center gap-1.5 text-sm"
            >
              <span>{item.emoji}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-grow pb-20 md:pb-0">{children}</main>

        {/* Bottom Navigation Bar (Mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-3 px-1 flex justify-around items-center shadow-2xl z-50 border-t border-gray-800">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg hover:bg-gray-800 transition-colors text-[10px] font-bold flex-1"
            >
              <span className="text-lg leading-none">{item.emoji}</span>
              <span className="text-center truncate w-full">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer with Ko-fi Button */}
        <footer className="bg-gray-900 text-white py-6 px-4 text-center mt-auto border-t border-gray-800">
          <a
            href="https://ko-fi.com/kkamedia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:scale-105 transition-transform"
          >
            <img
              height="36"
              style={{ border: 0, height: "36px" }}
              src="https://storage.ko-fi.com/cdn/kofi2.png?v=3"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </a>
        </footer>
      </body>
    </html>
  );
}
