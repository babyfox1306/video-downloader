import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZavClip Soundboard - 500+ Sounds",
  description: "ZavClip Soundboard - Access 500+ viral sounds and audio clips for your content creation needs.",
};

export default function SoundboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Soundboard
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            500+ sounds loading...
          </p>
        </div>
      </div>
    </div>
  );
}

