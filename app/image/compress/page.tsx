"use client";

import Link from "next/link";
import { useState } from "react";
import imageCompression from "browser-image-compression";

interface CompressedFile {
  id: string;
  name: string;
  originalSize: number;
  originalSizeStr: string;
  compressedSize?: number;
  compressedSizeStr?: string;
  reductionPercent?: number;
  status: "pending" | "processing" | "success" | "error";
  dataUrl?: string;
}

export default function ImageCompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<CompressedFile[]>([]);
  const [targetQuality, setTargetQuality] = useState(70); // percentage 10-100
  const [maxSizeKb, setMaxSizeKb] = useState(500); // 500 KB default target
  const [mode, setMode] = useState<"quality" | "size">("quality");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      const newFiles = Array.from(selected);
      setFiles((prev) => [...prev, ...newFiles]);

      const newItems = newFiles.map((file, i) => ({
        id: `compress-${Date.now()}-${i}`,
        name: file.name,
        originalSize: file.size,
        originalSizeStr: (file.size / 1024).toFixed(1) + " KB",
        status: "pending" as const
      }));
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const compressSingle = async (file: File, item: CompressedFile): Promise<CompressedFile> => {
    try {
      const options = {
        maxSizeMB: mode === "size" ? maxSizeKb / 1024 : 2, // limit by max size or 2MB baseline
        maxWidthOrHeight: 2048,
        useWebWorker: true,
        initialQuality: targetQuality / 100
      };

      const compressedFile = await imageCompression(file, options);
      const url = URL.createObjectURL(compressedFile);
      const cSize = compressedFile.size;
      const reduction = ((item.originalSize - cSize) / item.originalSize) * 100;

      return {
        ...item,
        status: "success",
        compressedSize: cSize,
        compressedSizeStr: (cSize / 1024).toFixed(1) + " KB",
        reductionPercent: reduction > 0 ? Math.round(reduction) : 0,
        dataUrl: url
      };
    } catch (err) {
      console.error(err);
      return { ...item, status: "error" };
    }
  };

  const handleStartCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const updatedItems = [...items];
    for (let i = 0; i < files.length; i++) {
      if (updatedItems[i].status === "success") continue;

      updatedItems[i].status = "processing";
      setItems([...updatedItems]);

      const result = await compressSingle(files[i], updatedItems[i]);
      updatedItems[i] = result;
      setItems([...updatedItems]);
    }

    setIsProcessing(false);
  };

  const triggerDownload = (item: CompressedFile) => {
    if (!item.dataUrl) return;
    const link = document.createElement("a");
    link.href = item.dataUrl;
    link.download = `compressed-${item.name}`;
    link.click();
  };

  const clearAll = () => {
    setFiles([]);
    setItems([]);
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
            🔒 Bảo mật 100% - Ảnh không rời khỏi trình duyệt của bạn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>📉</span> Trình Nén Ảnh Tối Ưu
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Nén giảm dung lượng hàng loạt ảnh JPG, PNG, WEBP tức thì mà không làm mờ hay vỡ nét hình ảnh.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Options Panel (col: 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-5">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
              Chế độ nén dung lượng
            </h3>

            {/* Mode toggles */}
            <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setMode("quality")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === "quality" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-850 dark:hover:text-white"
                }`}
              >
                Theo Chất Lượng
              </button>
              <button
                onClick={() => setMode("size")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === "size" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-850 dark:hover:text-white"
                }`}
              >
                Giới Hạn Size (KB)
              </button>
            </div>

            {/* Parameter sliders */}
            {mode === "quality" ? (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Chất lượng mục tiêu</span>
                  <span className="font-mono text-blue-500 font-bold">{targetQuality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={targetQuality}
                  onChange={(e) => setTargetQuality(parseInt(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-gray-400 mt-1">Mức nén đề xuất: 65% - 80% để giữ độ nét tốt nhất.</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Dung lượng tối đa (KB)</span>
                  <span className="font-mono text-blue-500 font-bold">{maxSizeKb} KB</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={maxSizeKb}
                  onChange={(e) => setMaxSizeKb(parseInt(e.target.value))}
                  className="w-full accent-blue-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {/* Start Button */}
            <div className="pt-2">
              <button
                onClick={handleStartCompress}
                disabled={files.length === 0 || isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? "Đang xử lý..." : "📉 Bắt Đầu Nén Ảnh"}
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

          {/* Files List & Dropzone (col: 8) */}
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
                Kéo thả các hình ảnh vào đây hoặc click để chọn ảnh
              </p>
              <p className="text-xs text-gray-400 mt-1">Hỗ trợ nén cùng lúc nhiều ảnh dung lượng lớn</p>
            </div>

            {/* Compressed Items Status */}
            {items.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-4 space-y-3">
                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Danh sách hình ảnh</h3>

                <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[350px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-450 mt-0.5">
                          Size gốc: {item.originalSizeStr}
                          {item.compressedSizeStr && ` ➔ Sau nén: ${item.compressedSizeStr}`}
                          {item.reductionPercent !== undefined && item.reductionPercent > 0 && (
                            <span className="text-emerald-500 font-bold ml-1.5">(-{item.reductionPercent}%)</span>
                          )}
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
                          <span className="text-xs text-rose-500 font-bold">Lỗi xử lý</span>
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
