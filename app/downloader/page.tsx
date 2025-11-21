import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZavClip Downloader - Download Viral Clips",
  description: "Use ZavClip Downloader to easily download viral clips from various platforms including TikTok, Instagram, YouTube, and more.",
};

export default function DownloaderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ZavClip Downloader
        </h1>
        
        {/* AdSense Slot */}
        <div className="max-w-4xl mx-auto mb-8 bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-center min-h-[100px] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">AdSense Banner Slot</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label htmlFor="url" className="block text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Enter Video URL
            </label>
            <input
              type="text"
              id="url"
              placeholder="https://..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity text-lg">
            Download Video
          </button>

          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <p>Supports: TikTok, Instagram, YouTube, Twitter, and more</p>
          </div>
        </div>

        {/* AdSense Slot */}
        <div className="max-w-4xl mx-auto mt-8 bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-center min-h-[100px] flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">AdSense Banner Slot</p>
        </div>
      </div>
    </div>
  );
}

