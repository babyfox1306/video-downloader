"use client";

import Link from "next/link";
import { useState } from "react";

export default function ShadowGeneratorPage() {
  const [hOffset, setHOffset] = useState(10);
  const [vOffset, setVOffset] = useState(10);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(0.2);
  const [cardColor, setCardColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  // Convert hex to rgb
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  const getCss = () => {
    return `box-shadow: ${hOffset}px ${vOffset}px ${blur}px ${spread}px rgba(${hexToRgb(color)}, ${opacity});`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCss());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            🔒 Xử lý offline - Tạo bóng và copy mã CSS trực quan tại trình duyệt
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            👥 Tạo bóng Box Shadow CSS
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tự do tùy chỉnh bóng đổ cho khối phần tử (độ nhòe, góc lệch, màu sắc, độ đậm nhạt) và copy nhanh mã CSS tương ứng.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 space-y-5 shadow-md">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Cấu hình Box Shadow
            </h3>

            {/* Horizontal offset */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>Lệch ngang (X):</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-455">{hOffset}px</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={hOffset}
                onChange={(e) => setHOffset(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
              />
            </div>

            {/* Vertical offset */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>Lệch dọc (Y):</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-455">{vOffset}px</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={vOffset}
                onChange={(e) => setVOffset(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
              />
            </div>

            {/* Blur radius */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>Độ nhòe (Blur):</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-455">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
              />
            </div>

            {/* Spread radius */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>Độ rộng bóng (Spread):</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-455">{spread}px</span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                value={spread}
                onChange={(e) => setSpread(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
              />
            </div>

            {/* Colors & Opacity */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase">Màu bóng</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-8 rounded border-0 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase">Màu khối thẻ</label>
                <input
                  type="color"
                  value={cardColor}
                  onChange={(e) => setCardColor(e.target.value)}
                  className="w-full h-8 rounded border-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Opacity slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>Độ mờ đục (Opacity):</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-455">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
              />
            </div>

            {/* Output code */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">Mã CSS Box Shadow</label>
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-850 font-mono text-[10px] text-gray-800 dark:text-gray-200 break-all select-all">
                {getCss()}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm"
            >
              {copied ? "✓ Đã copy mã CSS" : "📋 Sao chép mã CSS"}
            </button>
          </div>

          {/* Preview Panel (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 flex flex-col items-center justify-center min-h-[350px]">
            <h3 className="w-full font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2 mb-8">
              Bản xem trước trực quan
            </h3>

            <div className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-950 rounded-2xl p-16 border border-gray-150 dark:border-gray-900 min-h-[260px]">
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  backgroundColor: cardColor,
                  borderRadius: "24px",
                  boxShadow: `${hOffset}px ${vOffset}px ${blur}px ${spread}px rgba(${hexToRgb(color)}, ${opacity})`
                }}
                className="flex items-center justify-center text-xs font-bold text-gray-400 select-none text-center p-4 border border-gray-100/50"
              >
                Căn thử bóng đổ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
