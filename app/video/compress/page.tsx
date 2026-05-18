"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function VideoCompressPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [compressLevel, setCompressLevel] = useState<"high" | "medium" | "low">("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  const ffmpegRef = useRef<any>(null);

  useEffect(() => {
    loadFFmpeg();
  }, []);

  const loadFFmpeg = async () => {
    setLoadingMsg("Đang tải công cụ (~30MB lần đầu)...");
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
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
  };

  const handleCompress = async () => {
    if (!ffmpegRef.current || !videoFile) return;
    setIsProcessing(true);

    const ffmpeg = ffmpegRef.current;
    const { fetchFile } = await import("@ffmpeg/util");

    try {
      const inputName = "input.mp4";
      const outputName = "output.mp4";
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

      // Bitrate settings
      let targetBitrate = "1000k"; // Medium
      if (compressLevel === "high") {
        targetBitrate = "500k"; // Extreme small size
      } else if (compressLevel === "low") {
        targetBitrate = "2000k"; // High quality, lower compression
      }

      // Exec compression: ffmpeg -i input.mp4 -b:v target -c:a copy output.mp4
      await ffmpeg.exec([
        "-i",
        inputName,
        "-b:v",
        targetBitrate,
        "-c:a",
        "copy",
        outputName
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);

      const baseName = videoFile.name.substring(0, videoFile.name.lastIndexOf(".")) || "compressed";
      const link = document.createElement("a");
      link.href = url;
      link.download = `${baseName}-compressed.mp4`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi nén video.");
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
            🔒 Xử lý offline - Video không bao giờ rời khỏi thiết bị của bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            📦 Nén giảm dung lượng video
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Nén nhẹ tệp tin video siêu lớn để dễ dàng gửi qua Zalo, Messenger, email mà không làm giảm quá nhiều chất lượng hình ảnh.
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
              Tùy chọn mức nén
            </h3>

            {!videoFile ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-2xl w-full hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors relative cursor-pointer min-h-[220px]">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-5xl mb-4">📦</span>
                <p className="font-bold text-gray-750 dark:text-gray-300 text-sm">Tải video clip lên</p>
                <p className="text-xs text-gray-400 mt-2">Dưới 500MB để tối ưu bộ nhớ</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-1 text-xs">
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-455 font-bold uppercase tracking-wider">Video đang nạp</p>
                  <p className="font-bold text-gray-800 dark:text-white truncate">{videoFile.name}</p>
                  <p className="text-gray-400 font-mono">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>

                {/* Compression Level Toggles */}
                <div className="space-y-1.5 text-xs">
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">Mức nén mong muốn</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setCompressLevel("high")}
                      className={`py-2 px-1 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        compressLevel === "high"
                          ? "bg-emerald-600 border-emerald-600 text-white shadow"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Nén sâu (Nhỏ nhất)
                    </button>
                    <button
                      onClick={() => setCompressLevel("medium")}
                      className={`py-2 px-1 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        compressLevel === "medium"
                          ? "bg-emerald-600 border-emerald-600 text-white shadow"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Nén vừa (Khuyên dùng)
                    </button>
                    <button
                      onClick={() => setCompressLevel("low")}
                      className={`py-2 px-1 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        compressLevel === "low"
                          ? "bg-emerald-600 border-emerald-600 text-white shadow"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Nén nhẹ (Nét nhất)
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => setVideoFile(null)}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    🔄 Đổi video
                  </button>
                  <button
                    onClick={handleCompress}
                    disabled={!ffmpegLoaded || isProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center shadow-md shadow-emerald-500/10 disabled:opacity-50"
                  >
                    {isProcessing ? "Đang nén video..." : "📥 Nén & Tải video"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-4">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Vì sao nên nén video offline?
            </h3>

            <div className="space-y-4 text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              <p>
                Khi nén video bằng các dịch vụ trực tuyến thông thường, tệp tin video cá nhân của bạn sẽ bị tải lên máy chủ của họ. Điều này dẫn tới nguy cơ lộ lọt hình ảnh nhạy cảm hoặc clip gia đình riêng tư.
              </p>
              <p>
                Với công nghệ <strong>FFmpeg WebAssembly</strong>, zavclip.com đưa toàn bộ nhân đồ họa nén mạnh mẽ chạy trực tiếp ngay trên chính CPU máy tính của bạn. Dữ liệu chạy hoàn toàn cô lập, mang lại sự bảo mật dữ liệu tuyệt đối 100%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
