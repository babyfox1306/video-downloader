"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function ConvertAudioPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState("mp3");
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

    if (file.size > 100 * 1024 * 1024) {
      alert("Tệp tin âm thanh quá lớn! Vui lòng chọn tệp tin dưới 100MB.");
      return;
    }

    setAudioFile(file);
  };

  const handleConvert = async () => {
    if (!ffmpegRef.current || !audioFile) return;
    setIsProcessing(true);

    const ffmpeg = ffmpegRef.current;
    const { fetchFile } = await import("@ffmpeg/util");

    try {
      const inputName = "input" + audioFile.name.substring(audioFile.name.lastIndexOf("."));
      const outputName = `output.${targetFormat}`;
      
      await ffmpeg.writeFile(inputName, await fetchFile(audioFile));

      // Exec command: ffmpeg -i input.ext output.format
      await ffmpeg.exec(["-i", inputName, outputName]);

      const data = await ffmpeg.readFile(outputName);
      let mime = "audio/mp3";
      if (targetFormat === "wav") mime = "audio/wav";
      else if (targetFormat === "aac") mime = "audio/aac";
      else if (targetFormat === "m4a") mime = "audio/mp4";

      const blob = new Blob([data], { type: mime });
      const url = URL.createObjectURL(blob);

      const baseName = audioFile.name.substring(0, audioFile.name.lastIndexOf(".")) || "converted";
      const link = document.createElement("a");
      link.href = url;
      link.download = `${baseName}.${targetFormat}`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi trong quá trình chuyển đổi tệp tin âm thanh.");
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
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Video
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-455 px-3 py-1 rounded-full border border-rose-500/20 font-medium">
            🔒 Thiết lập offline - Nhạc được đổi đuôi hoàn toàn trên máy tính của bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            📻 Đổi đuôi tệp tin âm thanh
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Chuyển đổi định dạng qua lại giữa các tệp MP3, WAV, AAC, M4A, OGG hoàn toàn offline và cực nhanh bằng nhân FFmpeg chuyên nghiệp.
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
              Tùy chọn định dạng đầu ra
            </h3>

            {!audioFile ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-2xl w-full hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors relative cursor-pointer min-h-[220px]">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-5xl mb-4">📻</span>
                <p className="font-bold text-gray-750 dark:text-gray-300 text-sm">Tải tệp âm thanh lên</p>
                <p className="text-xs text-gray-400 mt-2">Dưới 100MB để tối ưu bộ nhớ</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-1 text-xs">
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-455 font-bold uppercase tracking-wider">Nhạc đang nạp</p>
                  <p className="font-bold text-gray-800 dark:text-white truncate">{audioFile.name}</p>
                  <p className="text-gray-400 font-mono">{(audioFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>

                {/* Target Format select */}
                <div className="space-y-1.5 text-xs">
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">Định dạng đầu ra</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["mp3", "wav", "aac", "m4a"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setTargetFormat(f)}
                        className={`py-2 px-1 rounded-xl border text-center font-bold transition-all cursor-pointer uppercase ${
                          targetFormat === f
                            ? "bg-emerald-600 border-emerald-600 text-white shadow"
                            : "bg-gray-50 dark:bg-gray-900 border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => setAudioFile(null)}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    🔄 Đổi tệp tin
                  </button>
                  <button
                    onClick={handleConvert}
                    disabled={!ffmpegLoaded || isProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center shadow-md shadow-emerald-500/10 disabled:opacity-50"
                  >
                    {isProcessing ? "Đang chuyển đổi..." : "📥 Đổi đuôi & Tải"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-4">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Các định dạng âm thanh hỗ trợ
            </h3>

            <div className="space-y-4 text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              <p>
                Trình đổi đuôi của chúng tôi nhận diện được hầu như mọi loại tệp nhạc phổ thông như: <strong>MP3</strong>, <strong>WAV</strong>, <strong>AAC</strong>, <strong>M4A (Apple Lossless/AAC)</strong>, <strong>OGG</strong>, <strong>FLAC</strong>, và <strong>WMA</strong>.
              </p>
              <p>
                Mọi tác vụ giải mã và nén lại thành định dạng mục tiêu được thực hiện ngay trên trình duyệt CPU máy tính của bạn. Dữ liệu chạy hoàn toàn cô lập, mang lại sự bảo mật dữ liệu tuyệt đối 100%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
