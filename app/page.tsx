import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ZavClip - All-in-one Viral Clip Toolbox | 5 Tools in 1",
  description: "ZavClip: Download viral clips, create face swaps, use soundboards, generate TTS clips, and make memes. All-in-one viral clip toolbox.",
};

const tools = [
  { name: "Downloader", href: "/downloader", description: "Download viral clips from any platform" },
  { name: "Face Swap", href: "/face-swap", description: "Swap faces in videos instantly" },
  { name: "Soundboard", href: "/soundboard", description: "500+ viral sounds at your fingertips" },
  { name: "TTS Clip Maker", href: "/tts", description: "Generate clips with text-to-speech" },
  { name: "Meme Generator", href: "/meme", description: "Create viral memes in seconds" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Big Title */}
        <h1 className="text-6xl md:text-7xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ZavClip
        </h1>
        <p className="text-2xl md:text-3xl text-center mb-12 text-gray-700 dark:text-gray-300">
          All-in-one Viral Clip Toolbox
        </p>

        {/* AdSense Banner - Home Page */}
        <div className="max-w-4xl mx-auto mb-12 bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-center min-h-[100px] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">AdSense Banner Slot</p>
        </div>

        {/* 5 Big Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-8 border-2 border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                {tool.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
