"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function ImageRotateFlipPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setProcessedUrl(null);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotate = (dir: "left" | "right") => {
    setRotation((prev) => {
      let next = prev + (dir === "right" ? 90 : -90);
      if (next < 0) next = 270;
      if (next >= 360) next = 0;
      return next;
    });
  };

  const applyTransforms = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        const isSwapped = rotation === 90 || rotation === 270;
        const w = isSwapped ? img.naturalHeight : img.naturalWidth;
        const h = isSwapped ? img.naturalWidth : img.naturalHeight;

        canvas.width = w;
        canvas.height = h;

        // Move context to the center to perform rotations & scales
        ctx.translate(w / 2, h / 2);
        
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

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
      applyTransforms();
    }
  }, [imageSrc, rotation, flipH, flipV]);

  const handleDownload = () => {
    if (!processedUrl) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = `transformed-${cleanName}.png`;
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
            🔒 File không gửi lên máy chủ - Bảo mật tuyệt đối
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🔁</span> Xoay & Lật Ảnh
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Xoay ảnh các góc 90/180/270 độ hoặc lật đối xứng hình ảnh (lật gương) theo chiều ngang/dọc siêu nhanh.
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
            <span className="text-5xl mb-4">🔁</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả hình ảnh của bạn vào đây hoặc click để chọn ảnh
            </p>
            <p className="text-xs text-gray-400 mt-2">Hỗ trợ JPG, PNG, WEBP, BMP...</p>
          </div>
        ) : (
          /* Workspace Split View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls (col: 4) */}
            <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                Công cụ xoay & lật
              </h3>

              {/* Rotation buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase">Xoay chiều</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleRotate("left")}
                    className="py-2.5 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold hover:border-gray-300 dark:text-white flex items-center justify-center gap-1 cursor-pointer"
                  >
                    🔄 Trái 90°
                  </button>
                  <button
                    onClick={() => handleRotate("right")}
                    className="py-2.5 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold hover:border-gray-300 dark:text-white flex items-center justify-center gap-1 cursor-pointer"
                  >
                    🔄 Phải 90°
                  </button>
                </div>
              </div>

              {/* Flip toggles */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-750 space-y-3">
                <label className="block text-xs font-bold text-gray-500 uppercase">Lật đối xứng (Gương)</label>
                
                <div className="flex items-center justify-between py-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Lật ngang (Horizontal)</h4>
                    <p className="text-[9px] text-gray-500">Đối xứng gương theo chiều ngang</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={flipH}
                    onChange={(e) => setFlipH(e.target.checked)}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-1.5 border-t border-gray-50 dark:border-gray-750/30">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Lật dọc (Vertical)</h4>
                    <p className="text-[9px] text-gray-500">Đối xứng gương theo chiều dọc</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={flipV}
                    onChange={(e) => setFlipV(e.target.checked)}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Quick status summary info */}
              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-500/20 rounded-xl text-[10px] text-blue-800 dark:text-blue-400 space-y-1">
                <p><strong>Xoay hiện tại:</strong> {rotation}°</p>
                <p><strong>Lật ngang:</strong> {flipH ? "Bật 🟩" : "Tắt 🟥"}</p>
                <p><strong>Lật dọc:</strong> {flipV ? "Bật 🟩" : "Tắt 🟥"}</p>
              </div>

              {/* Upload different image */}
              <button
                onClick={() => setImageSrc(null)}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                🔄 Chọn hình ảnh khác
              </button>
            </div>

            {/* Right Preview Panel (col: 8) */}
            <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Bản xem kết quả
              </h3>

              {/* Canvas Preview Container */}
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 w-full aspect-video flex items-center justify-center shadow-inner overflow-hidden relative min-h-[300px]">
                {processedUrl ? (
                  <img
                    src={processedUrl}
                    alt="Processed transformation"
                    className="max-w-full max-h-[340px] object-contain rounded border shadow-md transition-transform"
                  />
                ) : (
                  <span className="text-xs text-gray-400 italic">Đang cập nhật hình ảnh...</span>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                    Đang xử lý hình ảnh...
                  </div>
                )}
              </div>

              {/* Download actions */}
              <button
                onClick={handleDownload}
                disabled={!processedUrl || isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>💾</span> Tải Về Hình Ảnh Mới
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
