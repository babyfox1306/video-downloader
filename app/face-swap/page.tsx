import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZavClip Face Swap - Coming Soon",
  description: "ZavClip Face Swap - Swap faces in videos instantly. Coming in 24h!",
};

export default function FaceSwapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Face Swap
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 mb-8">
          <p className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Coming in 24h
          </p>
          
          <a
            href="https://ko-fi.com/kkamedia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              height="60"
              style={{ border: 0, height: "60px" }}
              src="https://storage.ko-fi.com/cdn/kofi2.png?v=3"
              alt="Buy Me a Coffee at ko-fi.com"
              className="mx-auto hover:opacity-90 transition-opacity"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

