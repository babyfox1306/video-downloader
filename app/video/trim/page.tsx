"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function VideoTrimPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const ffmpegRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR errors
    loadFFmpeg();
  }, []);

  const loadFFmpeg = async () => {
    setLoadingMsg("Đang tải công cụ (~30MB lần đầu)...");
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
      
      // Load ffmpeg-core with proper CDN URLs
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/octet-stream")
      });

      ffmpegRef.current = ffmpeg;
      setFfmpegLoaded(true);
      setLoadingMsg("");
    } catch (err) {
      console.error(err);
      setLoadingMsg("Không thể khởi tạo FFmpeg. Trình duyệt của bạn có thể thiếu cấu hình Cross-Origin Isolation.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024 * 1024) {
      alert("Tệp tin quá lớn! Vui lòng chọn tệp tin dưới 500MB.");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setStartTime(0);
    setEndTime(10);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setEndTime(Math.min(dur, 10));
    }
  };

  const handleTrim = async () => {
    if (!ffmpegRef.current || !videoFile) return;
    setIsProcessing(true);
    setProgress(0);

    const ffmpeg = ffmpegRef.current;
    const { fetchFile } = await import("@ffmpeg/util");

    try {
      // Write file to virtual memory
      const inputName = "input.mp4";
      const outputName = "output.mp4";
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

      // Build command: ffmpeg -ss [start] -to [end] -i input.mp4 -c copy output.mp4
      const durationToCut = endTime - startTime;
      await ffmpeg.exec([
        "-ss",
        startTime.toFixed(2),
        "-i",
        inputName,
        "-t",
        durationToCut.toFixed(2),
        "-c",
        "copy",
        outputName
      ]);

      // Read output
      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `zavclip-trimmed-${Date.now()}.mp4`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi trong quá trình cắt video.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/video"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Video
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-455 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Bảo mật 100% - Mọi dữ liệu xử lý cục bộ ngay trên máy của bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🎬 Cắt ghép video online
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Cắt lấy đoạn video cần dùng bằng công nghệ FFmpeg.wasm ngay trong trình duyệt mà không cần tải lên bất kỳ máy chủ nào.
          </p>
        </div>

        {loadingMsg && (
          <div className="mb-6 p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-bold text-center animate-pulse">
            ⚠️ {loadingMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 space-y-5 shadow-md">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Thiết lập đoạn cắt
            </h3>

            {!videoFile ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-2xl w-full hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors relative cursor-pointer min-h-[220px]">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-5xl mb-4">🎬</span>
                <p className="font-bold text-gray-750 dark:text-gray-300 text-sm">Chọn video của bạn</p>
                <p className="text-xs text-gray-400 mt-2">Dưới 500MB để tối ưu bộ nhớ</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-1 text-xs">
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-450 font-bold uppercase tracking-wider">Video đang nạp</p>
                  <p className="font-bold text-gray-800 dark:text-white truncate">{videoFile.name}</p>
                  <p className="text-gray-400 font-mono">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>

                {/* Start Time Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>Thời điểm bắt đầu:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-455">
                      {startTime.toFixed(1)} giây
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={startTime}
                    onChange={(e) => setStartTime(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
                  />
                </div>

                {/* End Time Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>Thời điểm kết thúc:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-455">
                      {endTime.toFixed(1)} giây
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={endTime}
                    onChange={(e) => setEndTime(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setVideoFile(null)}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    🔄 Đổi video
                  </button>
                  <button
                    onClick={handleTrim}
                    disabled={!ffmpegLoaded || isProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center shadow-md shadow-emerald-500/10 disabled:opacity-50"
                  >
                    {isProcessing ? "Đang xử lý..." : "📥 Tải video đã cắt"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="w-full font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2 mb-4">
              Khung xem trước video
            </h3>

            {videoPreview ? (
              <div className="w-full rounded-2xl overflow-hidden border border-gray-150 dark:border-gray-900 bg-black flex items-center justify-center p-1">
                <video
                  ref={videoRef}
                  src={videoPreview}
                  onLoadedMetadata={handleLoadedMetadata}
                  controls
                  className="max-h-[360px] w-full object-contain"
                />
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs italic">
                Chưa có tệp tin. Tải video của bạn lên ở bên trái để bắt đầu cắt.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
