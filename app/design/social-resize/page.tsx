"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface PresetTemplate {
  id: string;
  name: string;
  w: number;
  h: number;
}

export default function SocialResizePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState("fb_avatar");
  
  // Crop adjustments
  const [scale, setScale] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const templates: PresetTemplate[] = [
    { id: "fb_avatar", name: "Avatar Facebook (1:1)", w: 360, h: 360 },
    { id: "fb_cover", name: "Ảnh bìa Facebook (820x312)", w: 820, h: 312 },
    { id: "zalo_cover", name: "Ảnh bìa Zalo (640x360)", w: 640, h: 360 },
    { id: "tiktok_avatar", name: "Avatar TikTok (1:1)", w: 200, h: 200 },
    { id: "id_3x4", name: "Ảnh thẻ 3x4 cm (300x400)", w: 300, h: 400 },
    { id: "id_4x6", name: "Ảnh thẻ 4x6 cm (400x600)", w: 400, h: 600 }
  ];

  const activeTemplate = templates.find((t) => t.id === templateId) || templates[0];

  useEffect(() => {
    drawCropPreview();
  }, [imagePreview, templateId, scale, posX, posY]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset crop sliders
    setScale(1);
    setPosX(0);
    setPosY(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const drawCropPreview = () => {
    if (!imagePreview) return;
    const img = imgRef.current;
    if (!img) {
      // Lazy load image in background
      const newImg = new Image();
      newImg.src = imagePreview;
      newImg.onload = () => {
        imgRef.current = newImg;
        drawCropPreview();
      };
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetW = activeTemplate.w;
    const targetH = activeTemplate.h;

    canvas.width = targetW;
    canvas.height = targetH;

    // Draw centering
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);

    // Calculate source and target coordinates based on scale and translation
    const srcAspect = img.width / img.height;
    const destAspect = targetW / targetH;

    let drawW = targetW;
    let drawH = targetH;

    if (srcAspect > destAspect) {
      drawW = targetH * srcAspect;
    } else {
      drawH = targetW / srcAspect;
    }

    // Apply scale multiplier
    drawW *= scale;
    drawH *= scale;

    // Center point coordinates plus offsets
    const dx = (targetW - drawW) / 2 + posX;
    const dy = (targetH - drawH) / 2 + posY;

    ctx.drawImage(img, dx, dy, drawW, drawH);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `zavclip-cropped-${activeTemplate.id}.png`;
    link.click();
  };

  const handleClear = () => {
    setImagePreview(null);
    imgRef.current = null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/design"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Thiết kế
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-455 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Bảo mật 100% - Hình ảnh được xử lý cục bộ trên trình duyệt
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            ✂️ Cắt ảnh chuẩn kích thước mạng xã hội & Ảnh thẻ
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Cắt ảnh đúng kích thước chuẩn cho Facebook, Zalo, Tiktok, hoặc tạo ảnh thẻ 3x4, 4x6 làm hồ sơ/visa một cách nhanh chóng.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel (col: 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-5">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Cài đặt cắt ảnh
            </h3>

            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">Kích thước mẫu</label>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500 text-gray-850 dark:text-white cursor-pointer"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id} className="dark:bg-gray-900">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {imagePreview && (
              <>
                {/* Scale Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>Phóng to / Thu nhỏ:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-455">
                      {Math.round(scale * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.05"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
                  />
                </div>

                {/* Translate X Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>Lệch ngang (X):</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-455">{posX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-400"
                    max="400"
                    value={posX}
                    onChange={(e) => setPosX(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
                  />
                </div>

                {/* Translate Y Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>Lệch dọc (Y):</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-455">{posY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-400"
                    max="400"
                    value={posY}
                    onChange={(e) => setPosY(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={handleClear}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    🔄 Chọn ảnh khác
                  </button>
                  <button
                    onClick={handleDownload}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center shadow-md shadow-emerald-500/10"
                  >
                    📥 Tải ảnh đã cắt
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Visual Workspace Preview (col: 8) */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 flex flex-col items-center justify-center min-h-[350px]">
            <h3 className="w-full font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2 mb-4">
              Khung xem trước ảnh cắt
            </h3>

            {!imagePreview ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-2xl w-full hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors relative cursor-pointer min-h-[260px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-5xl mb-4">✂️</span>
                <p className="font-bold text-gray-750 dark:text-gray-300 text-sm">
                  Tải bức ảnh của bạn lên đây
                </p>
                <p className="text-xs text-gray-400 mt-2">Dễ dàng căn góc kéo thả điều chỉnh ngay sau đó</p>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-950 rounded-2xl p-6 border border-gray-150 dark:border-gray-900 min-h-[300px]">
                <div className="relative border-4 border-dashed border-emerald-500 shadow-xl overflow-hidden rounded">
                  <canvas ref={canvasRef} className="block max-w-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
