"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

type WatermarkType = "text" | "logo";
type WatermarkPosition = "top-left" | "top-right" | "center" | "bottom-left" | "bottom-right";

export default function ImageWatermarkPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  const [type, setType] = useState<WatermarkType>("text");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [opacity, setOpacity] = useState(0.5); // 0.1 - 1.0

  // Text watermark settings
  const [wmText, setWmText] = useState("ZAVCLIP.COM");
  const [wmColor, setWmColor] = useState("#ffffff");
  const [wmSize, setWmSize] = useState(32); // font size

  // Logo watermark settings
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(20); // 5 - 100% of base image width

  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setWatermarkedUrl(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getPositionCoords = (
    pos: WatermarkPosition,
    canvasW: number,
    canvasH: number,
    itemW: number,
    itemH: number,
    padding = 20
  ) => {
    switch (pos) {
      case "top-left":
        return { x: padding, y: padding };
      case "top-right":
        return { x: canvasW - itemW - padding, y: padding };
      case "center":
        return { x: (canvasW - itemW) / 2, y: (canvasH - itemH) / 2 };
      case "bottom-left":
        return { x: padding, y: canvasH - itemH - padding };
      case "bottom-right":
      default:
        return { x: canvasW - itemW - padding, y: canvasH - itemH - padding };
    }
  };

  const applyWatermark = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const baseImg = new Image();
    baseImg.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = baseImg.naturalWidth;
      canvas.height = baseImg.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(baseImg, 0, 0);

        ctx.globalAlpha = opacity;

        if (type === "text" && wmText) {
          // Draw text watermark
          ctx.font = `bold ${wmSize}px sans-serif`;
          ctx.fillStyle = wmColor;
          ctx.textBaseline = "top";

          const metrics = ctx.measureText(wmText);
          const textW = metrics.width;
          const textH = wmSize;

          const coords = getPositionCoords(position, canvas.width, canvas.height, textW, textH);

          // Add a soft drop shadow background for white text visibility
          if (wmColor.toLowerCase() === "#ffffff") {
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
          }

          ctx.fillText(wmText, coords.x, coords.y);
        } else if (type === "logo" && logoSrc) {
          // Draw logo watermark
          const logoImg = new Image();
          logoImg.onload = () => {
            // Scale logo to a percentage of base image width
            const logoW = Math.round(canvas.width * (logoScale / 100));
            const logoH = Math.round((logoImg.naturalHeight / logoImg.naturalWidth) * logoW);

            const coords = getPositionCoords(position, canvas.width, canvas.height, logoW, logoH);
            ctx.drawImage(logoImg, coords.x, coords.y, logoW, logoH);

            canvas.toBlob((blob) => {
              if (blob) {
                setWatermarkedUrl(URL.createObjectURL(blob));
              }
              setIsProcessing(false);
            }, "image/png");
          };
          logoImg.src = logoSrc;
          return; // avoid early resolving
        }

        canvas.toBlob((blob) => {
          if (blob) {
            setWatermarkedUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        }, "image/png");
      }
    };
    baseImg.src = imageSrc;
  };

  useEffect(() => {
    if (imageSrc) {
      applyWatermark();
    }
  }, [imageSrc, type, position, opacity, wmText, wmColor, wmSize, logoSrc, logoScale]);

  const handleDownload = () => {
    if (!watermarkedUrl) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const link = document.createElement("a");
    link.href = watermarkedUrl;
    link.download = `watermarked-${cleanName}.png`;
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
            🔒 Bảo mật 100% - Ảnh xử lý offline hoàn toàn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🛡️</span> Trình Đóng Dấu Ảnh (Watermark)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Đóng dấu thương hiệu (bằng chữ viết hoặc logo hình ảnh riêng) lên ảnh để khẳng định bản quyền cá nhân.
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
            <span className="text-5xl mb-4">🛡️</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả hình ảnh của bạn vào đây hoặc click để chọn ảnh cần đóng dấu
            </p>
            <p className="text-xs text-gray-400 mt-2">Hỗ trợ JPG, PNG, WEBP, BMP...</p>
          </div>
        ) : (
          /* Workspace Editor Split */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left controls panel (col: 5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-4">
                <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                  Cài đặt đóng dấu
                </h3>

                {/* Watermark Type toggle */}
                <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setType("text")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      type === "text" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-850 dark:hover:text-white"
                    }`}
                  >
                    Đóng Dấu Chữ
                  </button>
                  <button
                    onClick={() => setType("logo")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      type === "logo" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-850 dark:hover:text-white"
                    }`}
                  >
                    Đóng Dấu Logo
                  </button>
                </div>

                {/* Position selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">Vị trí đóng dấu</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: "top-left", name: "↖ Trái Trên" },
                      { id: "top-right", name: "↗ Phải Trên" },
                      { id: "center", name: "↕ Ở Giữa" },
                      { id: "bottom-left", name: "↙ Trái Dưới" },
                      { id: "bottom-right", name: "↘ Phải Dưới" }
                    ] as const).map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => setPosition(pos.id)}
                        className={`py-2 border rounded-xl text-[10px] font-bold transition-all capitalize ${
                          position === pos.id
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {pos.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacity slider */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Độ mờ (Opacity)</span>
                    <span className="font-mono text-blue-500 font-bold">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Text specifics */}
                {type === "text" ? (
                  <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Nội dung chữ đóng dấu</label>
                      <input
                        type="text"
                        value={wmText}
                        onChange={(e) => setWmText(e.target.value)}
                        placeholder="Nhập chữ cần đóng dấu..."
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Cỡ chữ</label>
                        <input
                          type="number"
                          value={wmSize}
                          onChange={(e) => setWmSize(Math.max(10, parseInt(e.target.value) || 20))}
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Màu chữ</label>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                          <input
                            type="color"
                            value={wmColor}
                            onChange={(e) => setWmColor(e.target.value)}
                            className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer"
                          />
                          <span className="text-xs font-mono">{wmColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Logo specifics */
                  <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-750">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Chọn ảnh Logo của bạn</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="w-full text-xs text-gray-500 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2 cursor-pointer focus:outline-none"
                      />
                    </div>
                    {logoSrc && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Kích thước logo (so với ảnh nền)</span>
                          <span className="font-mono text-blue-500 font-bold">{logoScale}%</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="80"
                          value={logoScale}
                          onChange={(e) => setLogoScale(parseInt(e.target.value))}
                          className="w-full accent-blue-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Upload different base image */}
              <button
                onClick={() => setImageSrc(null)}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                🔄 Chọn ảnh đóng dấu khác
              </button>
            </div>

            {/* Right Preview Panel (col: 7) */}
            <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Bản xem hình ảnh đóng dấu
              </h3>

              {/* Canvas Preview Container */}
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 w-full aspect-video flex items-center justify-center shadow-inner overflow-hidden relative">
                {watermarkedUrl ? (
                  <img
                    src={watermarkedUrl}
                    alt="Watermarked preview"
                    className="max-w-full max-h-full object-contain rounded border shadow-md"
                  />
                ) : (
                  <span className="text-xs text-gray-500 animate-pulse">Đang ghép dấu đóng lên ảnh...</span>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                    Đang xử lý đóng dấu...
                  </div>
                )}
              </div>

              {/* Download actions */}
              <button
                onClick={handleDownload}
                disabled={!watermarkedUrl || isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>💾</span> Tải Về Ảnh Đã Đóng Dấu
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
