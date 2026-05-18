"use client";

import Link from "next/link";
import { useState } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";

interface CompressedPhotoItem {
  id: string;
  file: File;
  name: string;
  originalSizeStr: string;
  compressedSizeStr?: string;
  reduction?: number;
  status: "pending" | "processing" | "success" | "error";
  dataUrl?: string;
}

export default function ImageCompressorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<CompressedPhotoItem[]>([]);
  
  const [quality, setQuality] = useState(75); // Slider from 50 to 95
  const [isProcessing, setIsProcessing] = useState(false);
  const [zipBlobUrl, setZipBlobUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      const newFiles = Array.from(selected);
      setFiles((prev) => [...prev, ...newFiles]);

      const newItems = newFiles.map((file, i) => ({
        id: `img-comp-${Date.now()}-${i}`,
        file,
        name: file.name,
        originalSizeStr: (file.size / 1024).toFixed(1) + " KB",
        status: "pending" as const
      }));
      setItems((prev) => [...prev, ...newItems]);
      setZipBlobUrl(null);
    }
  };

  const compressSingleFile = async (file: File, item: CompressedPhotoItem) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      initialQuality: quality / 100
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedBlob);
      const sizeStr = (compressedBlob.size / 1024).toFixed(1) + " KB";
      
      const diff = ((file.size - compressedBlob.size) / file.size) * 100;
      const reductionVal = diff > 0 ? Math.round(diff) : 0;

      return {
        ...item,
        status: "success" as const,
        dataUrl: url,
        compressedSizeStr: sizeStr,
        reduction: reductionVal
      };
    } catch (err) {
      console.error(err);
      return { ...item, status: "error" as const };
    }
  };

  const handleStartCompression = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setZipBlobUrl(null);

    const updatedItems = [...items];
    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      if (updatedItems[i].status === "success") continue;

      updatedItems[i].status = "processing";
      setItems([...updatedItems]);

      const result = await compressSingleFile(files[i], updatedItems[i]);
      updatedItems[i] = result;
      setItems([...updatedItems]);

      // If compressed successfully, gather for ZIP packaging
      if (result.status === "success" && result.dataUrl) {
        const response = await fetch(result.dataUrl);
        const blob = await response.blob();
        zip.file(`compressed-${result.name}`, blob);
      }
    }

    if (files.length > 1) {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setZipBlobUrl(URL.createObjectURL(zipBlob));
    }

    setIsProcessing(false);
  };

  const triggerDownload = (item: CompressedPhotoItem) => {
    if (!item.dataUrl) return;
    const link = document.createElement("a");
    link.href = item.dataUrl;
    link.download = `compressed-${item.name}`;
    link.click();
  };

  const downloadAllZip = () => {
    if (!zipBlobUrl) return;
    const link = document.createElement("a");
    link.href = zipBlobUrl;
    link.download = `compressed-photos-${Date.now()}.zip`;
    link.click();
  };

  const clearAll = () => {
    setFiles([]);
    setItems([]);
    setZipBlobUrl(null);
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
            🔒 Nén ảnh 100% offline - Bảo vệ an toàn quyền riêng tư
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🗜️</span> Nén Ảnh Hàng Loạt Offline
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Thu nhỏ dung lượng file ảnh (JPEG, PNG, WEBP) nhanh chóng để dễ dàng đăng ký thủ tục hành chính, gửi email hoặc upload hồ sơ.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel options (col: 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Cài đặt nén ảnh
            </h3>

            {/* Quality Slider */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Chất lượng ảnh xuất ra</span>
                <span className="font-mono text-indigo-500 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="35"
                max="95"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer accent-indigo-500"
              />
              <p className="text-[10px] text-gray-450 mt-1 leading-normal">
                Mức <strong>70% - 80%</strong> là lý tưởng nhất để giảm 60% dung lượng mà mắt thường hầu như không phát hiện thay đổi chất lượng ảnh.
              </p>
            </div>

            {/* Start Button */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-750">
              <button
                onClick={handleStartCompression}
                disabled={files.length === 0 || isProcessing}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs md:text-sm"
              >
                {isProcessing ? "Đang tiến hành nén..." : "🗜️ Bắt Đầu Nén Ảnh"}
              </button>

              {zipBlobUrl && (
                <button
                  onClick={downloadAllZip}
                  className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  📥 Tải Về File ZIP (.zip)
                </button>
              )}

              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  disabled={isProcessing}
                  className="w-full mt-3 text-center text-xs text-rose-500 font-bold hover:underline"
                >
                  🗑 Xóa danh sách
                </button>
              )}
            </div>

          </div>

          {/* Right files status grid (col: 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Drag drop zone */}
            <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-sm">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-4xl mb-3">📸</span>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                Kéo thả các file hình ảnh vào đây hoặc click để chọn
              </p>
              <p className="text-xs text-gray-400 mt-1">Chọn nén hàng loạt nhiều ảnh cùng lúc</p>
            </div>

            {/* List files queue */}
            {items.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-4 space-y-3">
                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Danh sách hình ảnh</h3>

                <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[350px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3.5">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-450 mt-0.5">
                          Dung lượng gốc: {item.originalSizeStr}
                          {item.compressedSizeStr && ` ➔ Đã nén: ${item.compressedSizeStr}`}
                        </p>
                        {item.reduction !== undefined && item.reduction > 0 && (
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded mt-1 inline-block">
                            Giảm được -{item.reduction}% dung lượng!
                          </span>
                        )}
                      </div>

                      <div>
                        {item.status === "pending" && (
                          <span className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 px-3 py-1 rounded-full font-medium">Chờ nén</span>
                        )}
                        {item.status === "processing" && (
                          <span className="text-xs text-indigo-500 font-bold animate-pulse">Đang nén ảnh...</span>
                        )}
                        {item.status === "error" && (
                          <span className="text-xs text-rose-500 font-bold">Lỗi xử lý</span>
                        )}
                        {item.status === "success" && (
                          <button
                            onClick={() => triggerDownload(item)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                          >
                            📥 Tải Ảnh
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
