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

export default function HEICToJPGPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<ConvertedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      const newFiles = Array.from(selected);
      setFiles((prev) => [...prev, ...newFiles]);

      const newItems = newFiles.map((file, i) => ({
        id: `heic-${Date.now()}-${i}`,
        name: file.name,
        originalSize: (file.size / 1024 / 1024).toFixed(1) + " MB",
        status: "pending" as const
      }));
      setItems((prev) => [...prev, ...newItems]);
    }
  };

  const convertHeic = async (file: File, item: ConvertedFile): Promise<ConvertedFile> => {
    try {
      // Dynamic import of heic2any to safely avoid any SSR compile-time errors!
      const heic2any = (await import("heic2any")).default;
      
      const resultBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.85
      });

      const singleBlob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;
      const url = URL.createObjectURL(singleBlob);
      const sizeStr = (singleBlob.size / 1024).toFixed(1) + " KB";

      return {
        ...item,
        status: "success",
        dataUrl: url,
        convertedSize: sizeStr
      };
    } catch (err) {
      console.error(err);
      return { ...item, status: "error" };
    }
  };

  const handleStartConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const updatedItems = [...items];
    for (let i = 0; i < files.length; i++) {
      if (updatedItems[i].status === "success") continue;

      updatedItems[i].status = "processing";
      setItems([...updatedItems]);

      const result = await convertHeic(files[i], updatedItems[i]);
      updatedItems[i] = result;
      setItems([...updatedItems]);
    }

    setIsProcessing(false);
  };

  const triggerDownload = (item: ConvertedFile) => {
    if (!item.dataUrl) return;
    const cleanName = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
    
    const link = document.createElement("a");
    link.href = item.dataUrl;
    link.download = `${cleanName}.jpg`;
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
            🔒 Bảo mật 100% - Ảnh HEIC được đổi đuôi trực tiếp tại máy bạn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🍏</span> Chuyển Đổi Ảnh HEIC iPhone sang JPG
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Đổi hàng loạt file ảnh đuôi `.heic` chụp từ điện thoại iPhone/iPad thành file `.jpg` thông dụng để dễ dàng xem trên máy tính Windows.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Options side panel (col: 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
              Chuyển đổi HEIC
            </h3>

            <p className="text-xs text-gray-500 leading-relaxed">
              Điện thoại iPhone mặc định lưu ảnh dưới định dạng HEIC để tiết kiệm dung lượng, nhưng máy tính Windows cũ thường không mở được. Công cụ này sẽ đổi sang định dạng JPG chuẩn quốc tế cho bạn.
            </p>

            {/* Start Button */}
            <div className="pt-2">
              <button
                onClick={handleStartConvert}
                disabled={files.length === 0 || isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? "Đang xử lý đổi đuôi..." : "🍏 Bắt Đầu Đổi Sang JPG"}
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

          {/* Files List & Status (col: 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Drag drop zone */}
            <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-sm">
              <input
                type="file"
                multiple
                accept=".heic,.HEIC"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-4xl mb-3">🍏</span>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                Kéo thả các file ảnh .heic vào đây hoặc click để chọn
              </p>
              <p className="text-xs text-gray-400 mt-1">Hỗ trợ tải lên nhiều file cùng lúc từ iPhone</p>
            </div>

            {/* Files items status */}
            {items.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-4 space-y-3">
                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Danh sách hình ảnh</h3>

                <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[350px] overflow-y-auto pr-1">
                  {items.map((item) => (
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
                          <span className="text-xs text-blue-500 font-bold animate-pulse">Đang chuyển đổi...</span>
                        )}
                        {item.status === "error" && (
                          <span className="text-xs text-rose-500 font-bold">Lỗi đọc file</span>
                        )}
                        {item.status === "success" && (
                          <button
                            onClick={() => triggerDownload(item)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                          >
                            📥 Tải JPG
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
