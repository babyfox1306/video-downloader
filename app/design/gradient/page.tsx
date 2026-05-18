"use client";

import Link from "next/link";
import { useState } from "react";

interface Preset {
  name: string;
  colorA: string;
  colorB: string;
  angle: number;
}

export default function GradientPage() {
  const [colorA, setColorA] = useState("#ff416c");
  const [colorB, setColorB] = useState("#ff4b2b");
  const [angle, setAngle] = useState(90);
  const [copied, setCopied] = useState(false);

  const presets: Preset[] = [
    { name: "Ánh hồng hoàng hôn", colorA: "#ff416c", colorB: "#ff4b2b", angle: 90 },
    { name: "Đại dương xanh mát", colorA: "#2193b0", colorB: "#6dd5ed", angle: 90 },
    { name: "Cây cỏ thiên nhiên", colorA: "#11998e", colorB: "#38ef7d", angle: 90 },
    { name: "Bóng tối huyền bí", colorA: "#0f2027", colorB: "#203a43", angle: 90 },
    { name: "Tình yêu vĩnh cửu", colorA: "#ee0979", colorB: "#ff6a00", angle: 90 },
    { name: "Tinh hoa công nghệ", colorA: "#00c6ff", colorB: "#0072ff", angle: 90 }
  ];

  const getCss = () => {
    return `background: linear-gradient(${angle}deg, ${colorA}, ${colorB});`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCss());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (p: Preset) => {
    setColorA(p.colorA);
    setColorB(p.colorB);
    setAngle(p.angle);
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
            🔒 Xử lý offline - Thiết kế và copy trực tiếp tại trình duyệt
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🎨 Tạo màu Gradient CSS
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tự tay phối màu gradient linear cực đẹp, xem thử trực quan thời gian thực và copy nhanh mã CSS để dán vào code dự án.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 space-y-5 shadow-md">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Thông số Gradient
            </h3>

            {/* Colors picker */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase">Màu bắt đầu</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={colorA}
                    onChange={(e) => setColorA(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorA}
                    onChange={(e) => setColorA(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-lg px-2 py-1 text-[10px] font-bold focus:outline-none text-gray-800 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase">Màu kết thúc</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={colorB}
                    onChange={(e) => setColorB(e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorB}
                    onChange={(e) => setColorB(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-lg px-2 py-1 text-[10px] font-bold focus:outline-none text-gray-800 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Angle slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>Góc xoay (Độ):</span>
                <span className="text-emerald-600 dark:text-emerald-450 font-bold">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
              />
            </div>

            {/* CSS code view */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">Mã CSS Gradient</label>
              <div className="relative bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-850 font-mono text-[10px] text-gray-800 dark:text-gray-200 break-all select-all">
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

          {/* Preview & Presets (col: 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Realtime box */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-4">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                Xem trước Gradient
              </h3>
              
              <div
                style={{ background: `linear-gradient(${angle}deg, ${colorA}, ${colorB})` }}
                className="w-full h-44 rounded-2xl shadow-inner border border-gray-100 dark:border-gray-900"
              />
            </div>

            {/* Predefined presets list */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-4">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                Các mẫu gradient đẹp tuyển chọn
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadPreset(p)}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left cursor-pointer"
                  >
                    <div
                      style={{ background: `linear-gradient(${p.angle}deg, ${p.colorA}, ${p.colorB})` }}
                      className="w-8 h-8 rounded-lg shrink-0"
                    />
                    <div>
                      <p className="text-[10px] font-bold text-gray-800 dark:text-white truncate max-w-[120px]">{p.name}</p>
                      <p className="text-[8px] text-gray-400 font-mono truncate max-w-[120px]">
                        {p.colorA} → {p.colorB}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
