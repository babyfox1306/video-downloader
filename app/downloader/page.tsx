"use client";

import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Force dynamic rendering (no SSR for FFmpeg.wasm)
export const dynamic = 'force-dynamic';

// CORS Proxy - dùng public CORS proxy
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

export default function DownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [converting, setConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  useEffect(() => {
    // Initialize FFmpeg only on client
    if (typeof window !== 'undefined') {
      ffmpegRef.current = new FFmpeg();
    }
  }, []);

  const loadFFmpeg = async () => {
    if (ffmpegLoaded || !ffmpegRef.current) return;
    
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
        setError("Không thể tải video. Vui lòng kiểm tra lại URL hoặc thử lại sau!");
      }
    } catch (err: any) {
      console.error("Download error:", err);
      setError(err.message || "Lỗi khi xử lý video. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const downloadTikTok = async (url: string) => {
    // Dùng CORS proxy cho tất cả APIs
    const apis = [
      {
        url: `https://tikwm.com/api?url=${encodeURIComponent(url)}`,
        useProxy: true,
        parser: (data: any) => ({
          downloadUrl: data.data?.play || data.data?.wmplay || data.data?.hdplay,
          thumbnail: data.data?.cover || data.data?.origin_cover,
          title: data.data?.title || data.title || "TikTok Video",
          author: data.data?.author?.nickname || data.data?.author?.unique_id || data.author || "Unknown",
          noWatermark: true,
        }),
      },
      {
        url: `https://www.tikwm.com/api?url=${encodeURIComponent(url)}`,
        useProxy: true,
        parser: (data: any) => ({
          downloadUrl: data.data?.play || data.data?.wmplay || data.data?.hdplay,
          thumbnail: data.data?.cover || data.data?.origin_cover,
          title: data.data?.title || data.title || "TikTok Video",
          author: data.data?.author?.nickname || data.data?.author?.unique_id || data.author || "Unknown",
          noWatermark: true,
        }),
      },
      {
        url: `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
        useProxy: true,
        parser: (data: any) => ({
          downloadUrl: data.video?.noWatermark || data.video?.watermark || data.video?.play,
          thumbnail: data.cover || data.video?.cover,
          title: data.title || data.video?.title || "TikTok Video",
          author: data.author || data.video?.author || "Unknown",
          noWatermark: !!data.video?.noWatermark,
        }),
      },
    ];

    for (const api of apis) {
      try {
        const fetchUrl = api.useProxy ? `${CORS_PROXY}${encodeURIComponent(api.url)}` : api.url;
        
        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json",
          },
          mode: "cors",
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = api.parser(data);
          
          if (parsed.downloadUrl) {
            return parsed;
          }
        }
      } catch (e) {
        console.log(`API ${api.url} failed:`, e);
        continue;
      }
    }
    
    throw new Error("Không thể tải video TikTok. Các API có thể đang bị rate limit hoặc URL không hợp lệ. Vui lòng thử lại sau vài phút.");
  };

  const extractTikTokId = (url: string): string | null => {
    const regex = /\/video\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const downloadInstagram = async (url: string) => {
    const apis = [
      {
        url: `https://api.saveig.app/api/ajaxSearch`,
        method: "POST" as const,
        body: `q=${encodeURIComponent(url)}`,
        useProxy: false,
        parser: (data: any) => {
          const video = data.medias?.find((m: any) => m.type === "Video");
          return {
            downloadUrl: video?.url,
            thumbnail: video?.thumb || data.thumbnail,
            title: data.title || "Instagram Reel",
            author: data.author || "Unknown",
            noWatermark: true,
          };
        },
      },
      {
        url: `https://api.downloadgram.org/api/video?url=${encodeURIComponent(url)}`,
        method: "GET" as const,
        useProxy: true,
        parser: (data: any) => ({
          downloadUrl: data.video || data.download,
          thumbnail: data.thumbnail || data.thumb,
          title: data.title || "Instagram Reel",
          author: data.author || "Unknown",
          noWatermark: true,
        }),
      },
    ];

    for (const api of apis) {
      try {
        let fetchUrl = api.url;
        if (api.useProxy && api.method === "GET") {
          fetchUrl = `${CORS_PROXY}${encodeURIComponent(api.url)}`;
        }

        const response = await fetch(fetchUrl, {
          method: api.method,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0",
          },
          body: api.body,
          mode: "cors",
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = api.parser(data);
          
          if (parsed.downloadUrl) {
            return parsed;
          }
        }
      } catch (e) {
        console.log(`Instagram API ${api.url} failed:`, e);
        continue;
      }
    }
    
    throw new Error("Không thể tải video Instagram. Vui lòng thử lại sau.");
  };

  const downloadYouTube = async (url: string) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) throw new Error("URL YouTube không hợp lệ");

    const apis = [
      {
        url: `https://api.vevioz.com/api/convert/mp4/${videoId}`,
        useProxy: false,
        parser: (data: any) => ({
          downloadUrl: data.download || data.link || data.url,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          title: data.title || "YouTube Video",
          author: data.channel || data.author || "Unknown",
          noWatermark: false,
        }),
      },
      {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        useProxy: false,
        parser: (data: any) => {
          // Fallback: dùng embed URL
          return {
            downloadUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            title: "YouTube Video",
            author: "Unknown",
            noWatermark: false,
          };
        },
      },
    ];

    for (const api of apis) {
      try {
        const fetchUrl = api.useProxy ? `${CORS_PROXY}${encodeURIComponent(api.url)}` : api.url;
        
        const response = await fetch(fetchUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
          mode: "cors",
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = api.parser(data);
          
          if (parsed.downloadUrl) {
            return parsed;
          }
        }
      } catch (e) {
        console.log(`YouTube API ${api.url} failed:`, e);
        continue;
      }
    }
    
    throw new Error("Không thể tải video YouTube. Vui lòng thử lại sau.");
  };

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const convertToMP3 = async (videoUrl: string) => {
    if (!ffmpegLoaded || !ffmpegRef.current) {
      setConverting(true);
      await loadFFmpeg();
    }

    if (!ffmpegRef.current) {
      setError("FFmpeg chưa sẵn sàng. Vui lòng thử lại!");
      return;
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
      const mp3Blob = new Blob([mp3Data as BlobPart], { type: "audio/mpeg" });
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
              placeholder="https://tiktok.com/... hoặc https://instagram.com/reel/... hoặc https://youtube.com/..."
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Đang tìm video... Vui lòng đợi
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-400">{error}</p>
              {error.includes("rate limit") && (
                <p className="text-sm text-red-600 dark:text-red-500 mt-2">
                  💡 Tip: Đợi 1-2 phút rồi thử lại, hoặc thử link khác
                </p>
              )}
            </div>
          )}

          {videoInfo && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {videoInfo.thumbnail && (
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-full rounded-lg mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
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
                      target="_blank"
                      rel="noopener noreferrer"
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
            <p className="text-xs mt-2 text-gray-500">
              Lưu ý: Nếu không tải được, có thể do API bị rate limit hoặc CORS. Vui lòng thử lại sau vài phút.
            </p>
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
