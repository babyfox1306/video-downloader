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
  title: "ZavClip - All-in-one Viral Clip Toolbox | 5 Tools in 1",
  description: "ZavClip: Download viral clips, create face swaps, use soundboards, generate TTS clips, and make memes. All-in-one viral clip toolbox.",
};

const navItems = [
  { name: "Downloader", href: "/downloader" },
  { name: "Face Swap", href: "/face-swap" },
  { name: "Soundboard", href: "/soundboard" },
  { name: "TTS Clip Maker", href: "/tts" },
  { name: "Meme Generator", href: "/meme" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Top Navigation Bar (Desktop) */}
        <nav className="hidden md:flex justify-center items-center gap-6 bg-gray-900 text-white py-4 px-6 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-grow pb-20 md:pb-0">{children}</main>

        {/* Bottom Navigation Bar (Mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-3 px-2 flex justify-around items-center shadow-lg z-50">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors text-xs"
            >
              <span className="text-center">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer with Ko-fi Button */}
        <footer className="bg-gray-900 text-white py-6 px-4 text-center mt-auto">
          <a
            href="https://ko-fi.com/kkamedia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
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
