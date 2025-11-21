"use client";

import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function DownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [converting, setConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const ffmpegRef = useRef(new FFmpeg());
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  const loadFFmpeg = async () => {
    if (ffmpegLoaded) return;
    
    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      const ffmpeg = ffmpegRef.current;
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      
      setFfmpegLoaded(true);
    } catch (err) {
      console.error("FFmpeg load error:", err);
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setError("Vui lòng nhập URL video");
      return;
    }

    setLoading(true);
    setError("");
    setDownloadLinks([]);
    setVideoInfo(null);

    try {
      let videoData: any = null;

      // TikTok
      if (url.includes("tiktok.com")) {
        videoData = await downloadTikTok(url);
      }
      // Instagram Reels
      else if (url.includes("instagram.com") && (url.includes("/reel/") || url.includes("/p/"))) {
        videoData = await downloadInstagram(url);
      }
      // YouTube
      else if (url.includes("youtube.com") || url.includes("youtu.be")) {
        videoData = await downloadYouTube(url);
      }
      else {
        setError("Chỉ hỗ trợ TikTok, Instagram Reels và YouTube. Vui lòng thử lại!");
        return;
      }

      if (videoData && videoData.downloadUrl) {
        setVideoInfo({
          thumbnail: videoData.thumbnail,
          title: videoData.title,
          author: videoData.author,
        });
        setDownloadLinks([
          {
            url: videoData.downloadUrl,
            quality: "HD",
            format: "mp4",
            noWatermark: videoData.noWatermark || false,
          },
        ]);
      } else {
        setError("Không thể tải video. Vui lòng kiểm tra lại URL!");
      }
    } catch (err: any) {
      console.error("Download error:", err);
      setError(err.message || "Lỗi khi xử lý video. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const downloadTikTok = async (url: string) => {
    // Try multiple TikTok APIs
    const apis = [
      `https://tikwm.com/api?url=${encodeURIComponent(url)}`,
      `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
    ];

    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.data?.play || data.video?.noWatermark) {
            return {
              downloadUrl: data.data?.play || data.video?.noWatermark,
              thumbnail: data.data?.cover || data.cover,
              title: data.data?.title || data.title || "TikTok Video",
              author: data.data?.author?.nickname || data.author || "Unknown",
              noWatermark: true,
            };
          }
        }
      } catch (e) {
        continue;
      }
    }
    throw new Error("Không thể tải video TikTok");
  };

  const downloadInstagram = async (url: string) => {
    try {
      // Use saveig.app API
      const response = await fetch(
        `https://api.saveig.app/api/ajaxSearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0",
          },
          body: `q=${encodeURIComponent(url)}`,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.medias && data.medias.length > 0) {
          const video = data.medias.find((m: any) => m.type === "Video");
          if (video) {
            return {
              downloadUrl: video.url,
              thumbnail: video.thumb,
              title: data.title || "Instagram Reel",
              author: data.author || "Unknown",
              noWatermark: true,
            };
          }
        }
      }
    } catch (e) {
      console.error("Instagram API error:", e);
    }
    throw new Error("Không thể tải video Instagram");
  };

  const downloadYouTube = async (url: string) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) throw new Error("URL YouTube không hợp lệ");

    try {
      // Use yt-dlp wrapper API
      const response = await fetch(
        `https://api.vevioz.com/api/convert/mp4/${videoId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.download) {
          return {
            downloadUrl: data.download,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            title: data.title || "YouTube Video",
            author: data.channel || "Unknown",
            noWatermark: false,
          };
        }
      }
    } catch (e) {
      console.error("YouTube API error:", e);
    }
    throw new Error("Không thể tải video YouTube");
  };

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const convertToMP3 = async (videoUrl: string) => {
    if (!ffmpegLoaded) {
      setConverting(true);
      await loadFFmpeg();
    }

    setConverting(true);
    setConvertProgress(0);

    try {
      const ffmpeg = ffmpegRef.current;
      
      ffmpeg.on("progress", ({ progress }) => {
        setConvertProgress(Math.round(progress * 100));
      });

      // Download video
      const videoData = await fetchFile(videoUrl);
      await ffmpeg.writeFile("input.mp4", videoData);

      // Convert to MP3
      await ffmpeg.exec(["-i", "input.mp4", "-q:a", "0", "-map", "a", "output.mp3"]);

      // Get MP3 file
      const mp3Data = await ffmpeg.readFile("output.mp3");
      const mp3Blob = new Blob([mp3Data], { type: "audio/mpeg" });
      const mp3Url = URL.createObjectURL(mp3Blob);

      // Download MP3
      const link = document.createElement("a");
      link.href = mp3Url;
      link.download = `${videoInfo?.title || "audio"}.mp3`;
      link.click();

      // Cleanup
      URL.revokeObjectURL(mp3Url);
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp3");
    } catch (err: any) {
      console.error("Convert error:", err);
      setError("Lỗi khi convert sang MP3: " + err.message);
    } finally {
      setConverting(false);
      setConvertProgress(0);
    }
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
              Nhập URL Video
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://tiktok.com/... hoặc https://instagram.com/reel/..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === "Enter" && !loading && handleDownload()}
            />
          </div>
          
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Tải Video"}
          </button>

          {loading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {videoInfo && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {videoInfo.thumbnail && (
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-full rounded-lg mb-4"
                />
              )}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {videoInfo.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {videoInfo.author}
              </p>
            </div>
          )}

          {downloadLinks.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tải về:
              </h3>
              {downloadLinks.map((link, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-between flex-wrap gap-3"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {link.quality} - {link.format.toUpperCase()}
                      {link.noWatermark && (
                        <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                          No Watermark
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={link.url}
                      download
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    >
                      Tải MP4
                    </a>
                    <button
                      onClick={() => convertToMP3(link.url)}
                      disabled={converting}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      {converting ? `Convert ${convertProgress}%` : "Convert MP3"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {converting && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${convertProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Đang convert sang MP3... {convertProgress}%
              </p>
            </div>
          )}

          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <p>Hỗ trợ: TikTok (no watermark), Instagram Reels, YouTube</p>
            <p className="text-sm mt-2">100% miễn phí, không cần đăng ký</p>
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
