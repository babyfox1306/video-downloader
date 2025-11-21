"use client";

import type { Metadata } from "next";
import { useState } from "react";

export default function DownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);

  const handleDownload = async () => {
    if (!url.trim()) {
      setError("Please enter a video URL");
      return;
    }

    setLoading(true);
    setError("");
    setDownloadLinks([]);

    try {
      // Call Netlify Function to get actual download links
      const response = await fetch("/.netlify/functions/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch download links");
      }

      const data = await response.json();

      if (data.success && data.downloadLinks && data.downloadLinks.length > 0) {
        setDownloadLinks(data.downloadLinks);
      } else {
        setError("Unable to extract download links. Please check the URL and try again.");
      }
    } catch (err: any) {
      console.error("Download error:", err);
      setError(err.message || "Failed to process video. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };


  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleDirectDownload = (downloadUrl: string, filename: string) => {
    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "video.mp4";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === "Enter" && handleDownload()}
            />
          </div>
          
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Download Video"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {downloadLinks.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Download Options:
              </h3>
              {downloadLinks.map((link, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {link.quality || "HD"} - {link.format || "mp4"}
                    </p>
                    {link.size && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Size: {link.size}
                      </p>
                    )}
                  </div>
                  <a
                    href={link.url}
                    download
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Download Now
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <p>Supports: TikTok, Instagram, YouTube, Twitter, and more</p>
            <p className="text-sm mt-2">Note: Some platforms may require backend service</p>
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

