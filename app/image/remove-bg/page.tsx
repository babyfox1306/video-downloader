"use client";

import Link from "next/link";
import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

export default function ImageRemoveBgPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setErrorMsg("");
      setFileName(file.name);
      setProcessedUrl(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    setProgressMsg("Đang khởi tạo mô hình AI tách nền...");
    setErrorMsg("");

    try {
      // Run remove background entirely client side!
      const resultBlob = await removeBackground(imageSrc, {
        progress: (key, current, total) => {
          const percent = Math.round((current / total) * 100);
          if (key === "fetch") {
            setProgressMsg(`Đang tải mô hình tách nền (${percent}%) - chỉ tải 1 lần đầu...`);
          } else if (key === "compute") {
            setProgressMsg(`AI đang phân tích và tách nền ảnh (${percent}%)...`);
          }
        }
      });

      const url = URL.createObjectURL(resultBlob);
      setProcessedUrl(url);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Không thể tách nền hình ảnh. Vui lòng chọn ảnh khác rõ nét hơn.");
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
    link.download = `removed-bg-${cleanName}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/image"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Ảnh
          </Link>
          <span className="text-xs bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-medium">
            🔒 Mô hình AI chạy cục bộ - Ảnh không gửi lên máy chủ
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>✨</span> Tách Nền & Xóa Phông Ảnh (AI Remove BG)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Tách người hoặc vật thể ra khỏi ảnh nền, tạo hình ảnh có phông suốt dạng PNG chất lượng cao chỉ bằng 1 click.
        </p>

        {!imageSrc ? (
          /* File Upload Area */
          <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-3xl p-16 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-md max-w-2xl mx-auto">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-5xl mb-4">✨</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả hình ảnh của bạn vào đây hoặc click để chọn ảnh
            </p>
            <p className="text-xs text-gray-400 mt-2">Dùng ảnh chân dung, sản phẩm để có kết quả tốt nhất</p>
          </div>
        ) : (
          /* Processing Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Original preview and actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Ảnh gốc tải lên
              </h3>

              <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-xl border border-gray-200 dark:border-gray-700 w-full aspect-video flex items-center justify-center shadow-inner overflow-hidden">
                <img src={imageSrc} alt="Original source" className="max-w-full max-h-full object-contain rounded border shadow-sm" />
              </div>

              {/* Status & Action */}
              <div className="w-full space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 rounded-xl text-center text-xs">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {isProcessing ? (
                  <div className="w-full p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 rounded-xl text-center text-xs space-y-2">
                    <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-bold">{progressMsg}</p>
                  </div>
                ) : (
                  !processedUrl && (
                    <button
                      onClick={handleRemoveBackground}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      ✨ Bắt Đầu Tách Nền
                    </button>
                  )
                )}

                <button
                  onClick={() => {
                    setImageSrc(null);
                    setProcessedUrl(null);
                  }}
                  disabled={isProcessing}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center disabled:opacity-50"
                >
                  🔄 Chọn hình ảnh khác
                </button>
              </div>
            </div>

            {/* Right Transparent processed preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Kết quả tách nền AI
              </h3>

              {/* Checkered background wrapper representing transparent PNG */}
              <div 
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 w-full aspect-video flex items-center justify-center shadow-inner overflow-hidden"
                style={{ 
                  backgroundImage: "radial-gradient(#ccc 20%, transparent 20%), radial-gradient(#ccc 20%, transparent 20%)",
                  backgroundPosition: "0 0, 8px 8px",
                  backgroundSize: "16px 16px",
                  backgroundColor: "#f0f0f0"
                }}
              >
                {processedUrl ? (
                  <img src={processedUrl} alt="Processed transparency" className="max-w-full max-h-full object-contain drop-shadow-md animate-fade-in" />
                ) : (
                  <span className="text-xs text-gray-400 italic font-medium">Bấm &quot;Tách Nền&quot; ở bên trái để xem kết quả...</span>
                )}
              </div>

              {/* Action */}
              <button
                onClick={handleDownload}
                disabled={!processedUrl || isProcessing}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-emerald-500/10"
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
