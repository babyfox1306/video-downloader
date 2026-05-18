"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const CURATED_PALETTES = [
  {
    name: "Pastel Mộng Mơ",
    colors: ["#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"]
  },
  {
    name: "Đại Dương Hoàng Hôn",
    colors: ["#1A365D", "#2B6CB0", "#4299E1", "#F6AD55", "#ED8936"]
  },
  {
    name: "Cánh Rừng Mùa Thu",
    colors: ["#2F855A", "#48BB78", "#ECC94B", "#D69E2E", "#C05621"]
  },
  {
    name: "Neon Huyền Ảo",
    colors: ["#0D0B21", "#9F7AEA", "#ED64A6", "#4FD1C5", "#38B2AC"]
  },
  {
    name: "Doanh Nghiệp Hiện Đại",
    colors: ["#1A202C", "#2D3748", "#4A5568", "#EDF2F7", "#3182CE"]
  }
];

export default function ColorPickerPage() {
  const [color, setColor] = useState("#4f46e5"); // indigo-600
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Conversion helpers
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));

    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }

    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);

    return { c, m, y, k };
  };

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const formats = {
    HEX: color.toUpperCase(),
    RGB: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    HSL: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    CMYK: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
  };

  const triggerCopy = (formatName: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedFormat(formatName);
      setTimeout(() => setCopiedFormat(null), 1800);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/text"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện Ích
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Bảo mật 100% - Mọi xử lý chạy cục bộ
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🎨</span> Bộ Chọn Màu & Phối Màu Sắc
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Chọn màu sắc trực quan, tự động chuyển đổi sang mã màu HEX, RGB, HSL, CMYK và khám phá bảng màu phối hợp tuyệt đẹp.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left picker and codes (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 space-y-6">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
              1. Chọn màu trực quan
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Native color picker box */}
              <div className="relative group w-36 h-36 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl cursor-pointer">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 w-full h-full scale-125 cursor-pointer border-0 p-0"
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none group-hover:bg-transparent transition-all" />
              </div>

              {/* Color Details values block */}
              <div className="flex-grow space-y-3 w-full">
                {Object.entries(formats).map(([formatName, value]) => (
                  <div
                    key={formatName}
                    onClick={() => triggerCopy(formatName, value)}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 border border-gray-150 dark:border-gray-850 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold cursor-pointer group transition-all select-all"
                    title="Click để sao chép mã màu này"
                  >
                    <div>
                      <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mr-2">
                        {formatName}:
                      </span>
                      <span className="text-gray-700 dark:text-gray-200 font-bold">{value}</span>
                    </div>
                    <span className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedFormat === formatName ? "✅ Đã Copy" : "📋 Copy"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Palettes suggestions (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 space-y-6">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
              2. Gợi ý bảng màu thiết kế đẹp
            </h3>

            <div className="space-y-4">
              {CURATED_PALETTES.map((palette) => (
                <div key={palette.name} className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {palette.name}
                  </h4>
                  <div className="flex rounded-xl overflow-hidden shadow-sm h-12">
                    {palette.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className="flex-1 transition-transform hover:scale-110 relative group"
                        style={{ backgroundColor: c }}
                        title={`Chọn màu ${c}`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-white bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          {c}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
