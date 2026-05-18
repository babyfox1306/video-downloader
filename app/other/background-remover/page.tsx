"use client";

import Link from "next/link";
import { useState } from "react";

export default function BackgroundRemoverPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setProcessedUrl(null);
      setErrorMsg("");
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleRemoveBackground = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg("");
    setProcessedUrl(null);
    setProgressMsg("Đang chuẩn bị mô hình AI (Lần đầu chạy có thể mất 1-2 phút tải thư viện 30MB)...");

    try {
      // Dynamic import of imgly background removal to safely avoid compile-time issues
      const { removeBackground } = await import("@imgly/background-removal");
      
      setProgressMsg("AI đang phân tích chân dung & bóc tách nền ảnh...");
      const resultBlob = await removeBackground(file, {
        progress: (key, current, total) => {
          if (key.includes("fetch")) {
            setProgressMsg(`Đang tải mô hình AI: ${Math.round((current / total) * 100)}%...`);
          } else if (key.includes("compute")) {
            setProgressMsg("AI đang bóc tách tách nền...");
          }
        }
      });

      const url = URL.createObjectURL(resultBlob);
      setProcessedUrl(url);

    } catch (err: any) {
      console.error(err);
      setErrorMsg("Không thể tách nền hình ảnh này. Trình duyệt của bạn có thể không đủ bộ nhớ WebAssembly (WASM).");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = `no-bg-${cleanName}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/other"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích
          </Link>
          <span className="text-xs bg-indigo-100 dark:bg-indigo-950/50 text-indigo-755 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 font-medium">
            ✨ Xử lý cục bộ bằng AI của trình duyệt - Ảnh không bao giờ rời máy bạn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>✨</span> Tách Nền Ảnh Chân Dung Bằng AI
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Tách nền người, vật thể hoặc logo ra khỏi hình ảnh trong 3 giây hoàn toàn tự động bằng trí tuệ nhân tạo (AI) chạy 100% offline.
        </p>

        {!imageSrc ? (
          /* File Upload Zone */
          <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-3xl p-16 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-md max-w-2xl mx-auto">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-5xl mb-4">✨</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả hình ảnh cần tách nền vào đây hoặc click để chọn ảnh
            </p>
            <p className="text-xs text-gray-400 mt-2">Hỗ trợ ảnh chân dung người, đồ vật, logo sản phẩm...</p>
          </div>
        ) : (
          /* Workspace Split View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Source & Action Controls (col: 4) */}
            <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                Tách nền AI
              </h3>

              {/* Source preview thumbnail */}
              <div className="space-y-1">
                <span className="block text-xs font-bold text-gray-400 uppercase">Ảnh gốc đã nạp</span>
                <img src={imageSrc} alt="Source" className="w-full h-32 object-cover rounded border" />
              </div>

              {/* Start remove background */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-750">
                <button
                  onClick={handleRemoveBackground}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs md:text-sm animate-pulse-slow"
                >
                  {isProcessing ? "AI Đang xử lý..." : "✨ Bắt Đầu Tách Nền"}
                </button>
              </div>

              {/* Choose another image */}
              <button
                onClick={() => {
                  setImageSrc(null);
                  setFile(null);
                  setProcessedUrl(null);
                }}
                disabled={isProcessing}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                🔄 Chọn hình ảnh khác
              </button>
            </div>

            {/* Right Result Visualizer (col: 8) */}
            <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Kết quả tách nền trong suốt
              </h3>

              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 rounded-xl text-center text-xs w-full">
                  ⚠️ {errorMsg}
                </div>
              )}

              {isProcessing && (
                <div className="w-full p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 rounded-2xl text-center text-xs space-y-3 shadow-inner">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-bold animate-pulse">{progressMsg}</p>
                </div>
              )}

              {/* Checkered background transparent preview container */}
              <div
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 w-full aspect-video flex items-center justify-center shadow-inner overflow-hidden min-h-[300px]"
                style={{
                  backgroundImage: "radial-gradient(#ccc 15%, transparent 15%), radial-gradient(#ccc 15%, transparent 15%)",
                  backgroundPosition: "0 0, 8px 8px",
                  backgroundSize: "16px 16px",
                  backgroundColor: "#e5e5e5"
                }}
              >
                {processedUrl ? (
                  <img src={processedUrl} alt="Background removed" className="max-w-full max-h-[280px] object-contain drop-shadow-lg animate-fade-in" />
                ) : (
                  <span className="text-xs text-gray-400 italic">Đang chờ lệnh bóc tách nền...</span>
                )}
              </div>

              {/* Download PNG button */}
              <button
                onClick={handleDownload}
                disabled={!processedUrl || isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-755 hover:to-indigo-755 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>💾</span> Tải Ảnh Không Nền (PNG)
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
