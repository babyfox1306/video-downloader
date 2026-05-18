"use client";

import Link from "next/link";
import { useState } from "react";

interface ConvertedFile {
  id: string;
  name: string;
  originalSize: string;
  convertedSize?: string;
  status: "pending" | "processing" | "success" | "error";
  dataUrl?: string;
}

export default function ImageConvertPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<"image/jpeg" | "image/png" | "image/webp" | "image/bmp" | "image/x-icon">("image/png");
  const [quality, setQuality] = useState(0.85);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      const newFiles = Array.from(selected);
      setFiles((prev) => [...prev, ...newFiles]);
      
      const newConverted = newFiles.map((file, i) => ({
        id: `file-${Date.now()}-${i}`,
        name: file.name,
        originalSize: (file.size / 1024).toFixed(1) + " KB",
        status: "pending" as const
      }));
      setConvertedFiles((prev) => [...prev, ...newConverted]);
    }
  };

  const getFormatExtension = (format: string) => {
    switch (format) {
      case "image/jpeg": return "jpg";
      case "image/png": return "png";
      case "image/webp": return "webp";
      case "image/bmp": return "bmp";
      case "image/x-icon": return "ico";
      default: return "png";
    }
  };

  const convertImage = (file: File, item: ConvertedFile): Promise<ConvertedFile> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve({ ...item, status: "error" });
            return;
          }

          let w = img.naturalWidth;
          let h = img.naturalHeight;

          // If ICO format, scale down to premium standard 32x32 size
          if (targetFormat === "image/x-icon") {
            w = 32;
            h = 32;
          }

          canvas.width = w;
          canvas.height = h;
          
          // Background fill if converting to jpeg or bmp (prevent black alpha channel)
          if (targetFormat === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);
          }

          ctx.drawImage(img, 0, 0, w, h);

          const mime = targetFormat === "image/x-icon" ? "image/png" : targetFormat;
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // If it's x-icon, we output a standard PNG stream renamed to .ico
                const convertedBlob = targetFormat === "image/x-icon" 
                  ? new Blob([blob], { type: "image/x-icon" }) 
                  : blob;

                const url = URL.createObjectURL(convertedBlob);
                const sizeStr = (convertedBlob.size / 1024).toFixed(1) + " KB";
                resolve({
                  ...item,
                  status: "success",
                  dataUrl: url,
                  convertedSize: sizeStr
                });
              } else {
                resolve({ ...item, status: "error" });
              }
            },
            mime,
            targetFormat === "image/jpeg" || targetFormat === "image/webp" ? quality : undefined
          );
        };
        img.onerror = () => resolve({ ...item, status: "error" });
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve({ ...item, status: "error" });
      reader.readAsDataURL(file);
    });
  };

  const handleStartConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const updatedItems = [...convertedFiles];
    for (let i = 0; i < files.length; i++) {
      if (updatedItems[i].status === "success") continue;
      
      updatedItems[i].status = "processing";
      setConvertedFiles([...updatedItems]);

      const result = await convertImage(files[i], updatedItems[i]);
      updatedItems[i] = result;
      setConvertedFiles([...updatedItems]);
    }
    
    setIsProcessing(false);
  };

  const triggerDownload = (item: ConvertedFile) => {
    if (!item.dataUrl) return;
    const cleanName = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
    const ext = getFormatExtension(targetFormat);
    
    const link = document.createElement("a");
    link.href = item.dataUrl;
    link.download = `${cleanName}.${ext}`;
    link.click();
  };

  const clearAll = () => {
    setFiles([]);
    setConvertedFiles([]);
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
            🔒 File không bao giờ rời khỏi thiết bị của bạn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🔄</span> Bộ Chuyển Đổi Định Dạng Ảnh
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Chuyển đổi tức thì mọi định dạng ảnh PNG, JPG, WEBP, BMP hoặc làm icon (.ico) hoàn toàn offline trên trình duyệt.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Options Panel (col: 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-5">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
              Cài đặt đầu ra
            </h3>

            {/* Target format dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Định dạng muốn đổi</label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as any)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
              >
                <option value="image/png">PNG (Không nén, trong suốt)</option>
                <option value="image/jpeg">JPG (Nén tốt, phổ biến)</option>
                <option value="image/webp">WEBP (Định dạng web tối ưu)</option>
                <option value="image/bmp">BMP (Ảnh thô chất lượng cao)</option>
                <option value="image/x-icon">ICO (Icon làm Web/App 32x32)</option>
              </select>
            </div>

            {/* Quality Slider (for JPG/WEBP) */}
            {(targetFormat === "image/jpeg" || targetFormat === "image/webp") && (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Chất lượng ảnh</span>
                  <span className="font-mono text-blue-500 font-bold">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Start button */}
            <div className="pt-2">
              <button
                onClick={handleStartConvert}
                disabled={files.length === 0 || isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? "Đang xử lý..." : "🔄 Bắt Đầu Chuyển Đổi"}
              </button>

              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  className="w-full mt-3 text-center text-xs text-rose-500 font-bold hover:underline"
                >
                  🗑 Xóa danh sách
                </button>
              )}
            </div>
          </div>

          {/* Files Upload & Status Panel (col: 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Drag Drop Area */}
            <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-sm">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-4xl mb-3">🖼️</span>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                Kéo thả nhiều ảnh vào đây hoặc click để chọn ảnh
              </p>
              <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG, WEBP, GIF, BMP...</p>
            </div>

            {/* Files List status */}
            {convertedFiles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-4 space-y-3">
                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Danh sách hình ảnh</h3>
                
                <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[350px] overflow-y-auto pr-1">
                  {convertedFiles.map((item, idx) => (
                    <div key={item.id} className="flex justify-between items-center py-3">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-450 mt-0.5">
                          Kích thước gốc: {item.originalSize}
                          {item.convertedSize && ` ➔ Đã đổi: ${item.convertedSize}`}
                        </p>
                      </div>

                      <div>
                        {item.status === "pending" && (
                          <span className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 px-3 py-1 rounded-full font-medium">Chờ xử lý</span>
                        )}
                        {item.status === "processing" && (
                          <span className="text-xs text-blue-500 font-bold animate-pulse">Đang nén...</span>
                        )}
                        {item.status === "error" && (
                          <span className="text-xs text-rose-500 font-bold">Lỗi đọc ảnh</span>
                        )}
                        {item.status === "success" && (
                          <button
                            onClick={() => triggerDownload(item)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                          >
                            📥 Tải Về
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
