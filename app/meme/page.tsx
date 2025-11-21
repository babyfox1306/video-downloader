import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZavClip Meme Generator - Coming Soon",
  description: "ZavClip Meme Generator - Create viral memes in seconds. Coming soon!",
};

export default function MemePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Meme Generator
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Template Preview */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Template Preview
            </label>
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400">Meme Template Preview</p>
            </div>
          </div>
          
          {/* Text Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="top-text" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                Top Text
              </label>
              <input
                type="text"
                id="top-text"
                placeholder="Top text..."
                disabled
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white opacity-60 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label htmlFor="bottom-text" className="block text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                Bottom Text
              </label>
              <input
                type="text"
                id="bottom-text"
                placeholder="Bottom text..."
                disabled
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none dark:bg-gray-700 dark:text-white opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
          
          <p className="text-center text-gray-500 dark:text-gray-400 italic">
            Coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

