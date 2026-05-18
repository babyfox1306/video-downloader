"use client";

import Link from "next/link";
import { useState } from "react";
import jsQR from "jsqr";

export default function QRReaderPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setQrResult(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setImagePreview(dataUrl);
        
        // Process image to decode QR code
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              setErrorMsg("Không khởi tạo được Canvas Context để phân tích ảnh.");
              setIsProcessing(false);
              return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert"
            });

            if (code) {
              setQrResult(code.data);
            } else {
              setErrorMsg("Không tìm thấy mã QR nào hợp lệ trong bức ảnh này. Vui lòng thử ảnh chụp cận cảnh và rõ nét hơn.");
            }
          } catch (err) {
            console.error(err);
            setErrorMsg("Đã xảy ra lỗi khi giải mã hình ảnh.");
          } finally {
            setIsProcessing(false);
          }
        };
        img.onerror = () => {
          setErrorMsg("Không thể load hình ảnh đã tải lên.");
          setIsProcessing(false);
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return text.startsWith("http://") || text.startsWith("https://");
    } catch (_) {
      return false;
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setQrResult(null);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/vietnam"
            className="text-sm font-semibold text-rose-600 dark:text-rose-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích Việt Nam
          </Link>
          <span className="text-xs bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-455 px-3 py-1 rounded-full border border-rose-500/20 font-medium">
            🔒 Bảo mật 100% - Giải mã mã QR ngay trên máy tính của bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            📷 Đọc mã QR từ ảnh
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tải ảnh chụp, ảnh chụp màn hình chứa mã QR lên để trích xuất nhanh liên kết hoặc thông tin chữ ẩn giấu hoàn toàn offline.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Area (col: 6) */}
          <div className="lg:col-span-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 flex flex-col items-center justify-center min-h-[340px] relative">
            {!imagePreview ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-2xl w-full hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors relative cursor-pointer min-h-[280px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-5xl mb-4">📷</span>
                <p className="font-bold text-gray-750 dark:text-gray-300 text-sm">
                  Kéo thả ảnh chứa mã QR vào đây
                </p>
                <p className="text-xs text-gray-400 mt-2">Hoặc click để chọn tệp từ thiết bị</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-2 max-h-[300px]">
                  <img
                    src={imagePreview}
                    alt="QR Preview"
                    className="max-h-[260px] rounded-xl object-contain shadow"
                  />
                </div>
                <button
                  onClick={handleClear}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  🔄 Chọn bức ảnh khác
                </button>
              </div>
            )}
          </div>

          {/* Results panel (col: 6) */}
          <div className="lg:col-span-6 space-y-6">
            {errorMsg && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-650 dark:text-rose-400 rounded-2xl text-xs font-bold shadow-sm">
                ⚠️ {errorMsg}
              </div>
            )}

            {isProcessing && (
              <div className="w-full p-8 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 rounded-3xl text-center text-xs space-y-3 shadow-inner">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-bold animate-pulse">Đang phân tích hình ảnh...</p>
              </div>
            )}

            {!qrResult && !errorMsg && !isProcessing && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-8 text-center shadow-md min-h-[220px] flex flex-col justify-center items-center space-y-3">
                <span className="text-4xl">🔍</span>
                <p className="text-gray-750 dark:text-gray-300 font-bold">Chờ quét mã QR</p>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Tải một bức ảnh chụp mã QR lên bên trái và hệ thống sẽ tự động quét, hiển thị kết quả phân tích tại đây.
                </p>
              </div>
            )}

            {qrResult && !isProcessing && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 shadow-md space-y-5">
                <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                  Nội dung quét được từ QR
                </h3>

                <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-850">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-all whitespace-pre-wrap font-sans">
                    {qrResult}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(qrResult);
                      alert("Đã sao chép nội dung mã QR vào clipboard!");
                    }}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    📋 Sao chép nội dung
                  </button>
                  {isUrl(qrResult) && (
                    <a
                      href={qrResult}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1 shadow-md shadow-emerald-500/10"
                    >
                      🌐 Mở liên kết <span>➔</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
