"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function BorderAdderPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const [borderColor, setBorderColor] = useState("#ffffff");
  const [borderThickness, setBorderThickness] = useState(15); // in pixels

  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const applyBorder = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const baseW = img.naturalWidth;
        const baseH = img.naturalHeight;

        // Increase canvas size to fit borders on all four sides
        const finalW = baseW + 2 * borderThickness;
        const finalH = baseH + 2 * borderThickness;

        canvas.width = finalW;
        canvas.height = finalH;

        // 1. Draw solid border background color
        ctx.fillStyle = borderColor;
        ctx.fillRect(0, 0, finalW, finalH);

        // 2. Draw centered image
        ctx.drawImage(img, borderThickness, borderThickness, baseW, baseH);

        canvas.toBlob((blob) => {
          if (blob) {
            setProcessedUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        }, "image/png");
      }
    };
    img.src = imageSrc;
  };

  useEffect(() => {
    if (imageSrc) {
      applyBorder();
    }
  }, [imageSrc, borderColor, borderThickness]);

  const handleDownload = () => {
    if (!processedUrl) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = `bordered-${cleanName}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/image"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Ảnh
          </Link>
          <span className="text-xs bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-medium">
            🔒 Bảo mật 100% - Ảnh ghép viền cục bộ trên trình duyệt
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🖼️</span> Thêm Viền Màu Ảnh
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Tạo khung viền màu sắc bắt mắt bao quanh hình ảnh để đăng ảnh lên Instagram không bị cắt xén, hoặc tạo phong cách riêng.
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
            <span className="text-5xl mb-4">🖼️</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả hình ảnh của bạn vào đây hoặc click để chọn ảnh
            </p>
            <p className="text-xs text-gray-400 mt-2">Hỗ trợ JPG, PNG, WEBP, BMP...</p>
          </div>
        ) : (
          /* Workspace Splitting Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls Panel (col: 4) */}
            <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                Tùy chỉnh khung viền
              </h3>

              {/* Border Color */}
              <div>
                <label className="block text-xs text-gray-550 mb-2 font-bold uppercase">Màu viền khung</label>
                <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-10 h-10 rounded bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold">{borderColor.toUpperCase()}</span>
                </div>
              </div>

              {/* Thickness Slider */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Độ dày viền (Pixel)</span>
                  <span className="font-mono text-blue-500 font-bold">{borderThickness}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="80"
                  value={borderThickness}
                  onChange={(e) => setBorderThickness(parseInt(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Quick colors shortcuts */}
              <div>
                <label className="block text-xs text-gray-400 font-bold uppercase mb-2">Chọn nhanh màu nền</label>
                <div className="flex flex-wrap gap-2">
                  {["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setBorderColor(c)}
                      className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 transition-transform hover:scale-110 shadow-sm"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Choose another image */}
              <button
                onClick={() => setImageSrc(null)}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                🔄 Chọn hình ảnh khác
              </button>
            </div>

            {/* Right Preview Panel (col: 8) */}
            <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Bản xem hình ảnh đóng khung
              </h3>

              {/* Canvas Preview Container */}
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 w-full aspect-video flex items-center justify-center shadow-inner overflow-hidden relative min-h-[300px]">
                {processedUrl ? (
                  <img
                    src={processedUrl}
                    alt="Bordered preview"
                    className="max-w-full max-h-[340px] object-contain rounded border shadow-md"
                  />
                ) : (
                  <span className="text-xs text-gray-400 italic">Đang dựng khung viền...</span>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                    Đang dựng khung viền...
                  </div>
                )}
              </div>

              {/* Download actions */}
              <button
                onClick={handleDownload}
                disabled={!processedUrl || isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>💾</span> Tải Về Ảnh Đã Viền
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
