"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface SizePreset {
  name: string;
  w: number;
  h: number;
  description: string;
}

const PRESETS: SizePreset[] = [
  { name: "Full HD (1080p)", w: 1920, h: 1080, description: "Tỷ lệ 16:9 chuẩn màn hình" },
  { name: "Instagram Vuông", w: 1080, h: 1080, description: "Tỷ lệ 1:1 đăng bài viết" },
  { name: "Facebook Bìa (Cover)", w: 820, h: 312, description: "Kích thước ảnh bìa Fanpage" },
  { name: "Zalo Đại Diện (Avatar)", w: 200, h: 200, description: "Ảnh đại diện tròn nhỏ" },
  { name: "Ảnh Thẻ CCCD/Passport", w: 300, h: 400, description: "Chuẩn ảnh thẻ 3x4 (pixel)" }
];

export default function ImageResizePage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [lockRatio, setLockRatio] = useState(true);

  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Set initial dimensions when image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setWidth(w);
    setHeight(h);
    setAspectRatio(w / h);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const applyPreset = (preset: SizePreset) => {
    setWidth(preset.w);
    setHeight(preset.h);
    setAspectRatio(preset.w / preset.h);
    setLockRatio(false); // disable lock to let presets apply exactly
  };

  const resizeImage = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setResizedUrl(url);
            setResizedSize((blob.size / 1024).toFixed(1) + " KB");
          }
          setIsProcessing(false);
        }, "image/png");
      }
    };
    img.src = imageSrc;
  };

  useEffect(() => {
    if (imageSrc) {
      resizeImage();
    }
  }, [width, height, imageSrc]);

  const handleDownload = () => {
    if (!resizedUrl) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const link = document.createElement("a");
    link.href = resizedUrl;
    link.download = `resized-${cleanName}.png`;
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
            🔒 Bảo mật 100% - Ảnh không rời khỏi trình duyệt của bạn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>📐</span> Thay Đổi Kích Thước Ảnh (Resize)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Đổi số đo pixel hình ảnh theo ý muốn hoặc chọn các kích thước mẫu chuẩn làm ảnh bìa mạng xã hội, ảnh thẻ CCCD.
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
            <span className="text-5xl mb-4">📐</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả hình ảnh của bạn vào đây hoặc click để chọn ảnh
            </p>
            <p className="text-xs text-gray-400 mt-2">Hỗ trợ JPG, PNG, WEBP, BMP...</p>
          </div>
        ) : (
          /* Editor Split View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls & Presets (col: 5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Dimensions Box */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-4">
                <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                  Đo kích thước (Pixel)
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Chiều rộng (W)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Chiều cao (H)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500 dark:text-white"
                    />
                  </div>
                </div>

                {/* Lock ratio check */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-750">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Khóa tỷ lệ khung hình</h4>
                    <p className="text-[10px] text-gray-500">Giữ ảnh không bị méo lệch khi đổi cỡ</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={lockRatio}
                    onChange={(e) => {
                      setLockRatio(e.target.checked);
                      if (e.target.checked) setAspectRatio(width / height);
                    }}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Presets Box */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-4">
                <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                  Kích thước khuyên dùng nhanh
                </h3>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="w-full text-left bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-950 border border-gray-150 dark:border-gray-850 px-4 py-3 rounded-xl flex justify-between items-center transition-all group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                          {preset.name}
                        </h4>
                        <p className="text-[9px] text-gray-450 mt-0.5">{preset.description}</p>
                      </div>
                      <span className="font-mono text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                        {preset.w} x {preset.h}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload different image */}
              <button
                onClick={() => setImageSrc(null)}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                🔄 Chọn hình ảnh khác
              </button>
            </div>

            {/* Right Preview Panel (col: 7) */}
            <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center flex justify-between items-center">
                <span>Bản xem ảnh mới</span>
                {resizedSize && (
                  <span className="text-xs font-mono bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 px-2 py-0.5 rounded">
                    Size: {resizedSize}
                  </span>
                )}
              </h3>

              {/* Hidden original image element to calculate initial ratios */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Source helper"
                onLoad={handleImageLoad}
                className="hidden"
              />

              {/* Canvas Preview Container */}
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 w-full aspect-video flex items-center justify-center shadow-inner overflow-hidden relative">
                {resizedUrl ? (
                  <img
                    src={resizedUrl}
                    alt="Resized preview"
                    className="max-w-full max-h-full object-contain rounded border shadow-md"
                  />
                ) : (
                  <span className="text-xs text-gray-500 animate-pulse">Đang nén ảnh kích thước mới...</span>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                    Đang xử lý kích thước mới...
                  </div>
                )}
              </div>

              {/* Download actions */}
              <button
                onClick={handleDownload}
                disabled={!resizedUrl || isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>💾</span> Tải Về Ảnh Mới
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
