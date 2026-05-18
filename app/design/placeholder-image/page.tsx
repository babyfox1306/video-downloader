"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function PlaceholderImagePage() {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [bgCol, setBgCol] = useState("#cccccc");
  const [textCol, setTextCol] = useState("#555555");
  const [text, setText] = useState("");
  const [format, setFormat] = useState<"png" | "jpeg">("png");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    drawPlaceholder();
  }, [width, height, bgCol, textCol, text]);

  const drawPlaceholder = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, width, height);

    // Draw text
    ctx.fillStyle = textCol;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Dynamic font size based on height
    const fontSize = Math.max(14, Math.floor(Math.min(width, height) / 10));
    ctx.font = `bold ${fontSize}px sans-serif`;

    const displayText = text.trim() ? text.trim() : `${width} x ${height}`;
    ctx.fillText(displayText, width / 2, height / 2);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mime = format === "png" ? "image/png" : "image/jpeg";
    const dataUrl = canvas.toDataURL(mime);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `placeholder-${width}x${height}.${format}`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/design"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Thiết kế
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-455 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Xử lý offline 100% - Không gửi dữ liệu hình ảnh lên server
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🖼️ Tạo ảnh mẫu Placeholder
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tạo ảnh giữ chỗ tạm thời với kích thước, màu sắc và dòng chữ tự chọn để phục vụ thiết kế web hoặc thuyết trình.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Settings panel (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 space-y-5 shadow-md">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Thông số hình ảnh
            </h3>

            {/* Width & Height */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase">Chiều rộng (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500 text-gray-850 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase">Chiều cao (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500 text-gray-850 dark:text-white"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase">Màu nền</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={bgCol}
                    onChange={(e) => setBgCol(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgCol}
                    onChange={(e) => setBgCol(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-lg px-2 py-1.5 text-[10px] font-bold focus:outline-none text-gray-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase">Màu chữ</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={textCol}
                    onChange={(e) => setTextCol(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textCol}
                    onChange={(e) => setTextCol(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-lg px-2 py-1.5 text-[10px] font-bold focus:outline-none text-gray-800 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Overlay Text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">Dòng chữ hiển thị</label>
              <input
                type="text"
                placeholder="Mặc định: Kích thước hình ảnh"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-500 text-gray-855 dark:text-white"
              />
            </div>

            {/* Format choice */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Định dạng tải về</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFormat("png")}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    format === "png"
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/10"
                      : "bg-gray-50 dark:bg-gray-900 border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Định dạng PNG
                </button>
                <button
                  onClick={() => setFormat("jpeg")}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    format === "jpeg"
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/10"
                      : "bg-gray-50 dark:bg-gray-900 border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Định dạng JPEG
                </button>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm"
            >
              📥 Tải ảnh mẫu về máy
            </button>
          </div>

          {/* Preview panel (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="w-full font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2 mb-4">
              Xem trước hình ảnh
            </h3>
            
            <div className="w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950 rounded-2xl p-4 overflow-auto max-h-[360px]">
              <canvas
                ref={canvasRef}
                className="max-w-full rounded-lg shadow-md border border-gray-200 dark:border-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
