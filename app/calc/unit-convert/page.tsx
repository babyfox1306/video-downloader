"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Category = "length" | "mass" | "temperature" | "area" | "currency";

export default function UnitConverterPage() {
  const [activeTab, setActiveTab] = useState<Category>("length");
  const [valFrom, setValFrom] = useState<number>(1);
  const [unitFrom, setUnitFrom] = useState<string>("");
  const [unitTo, setUnitTo] = useState<string>("");
  const [valTo, setValTo] = useState<number>(0);

  // Define conversion options for each category
  const unitsMap = {
    length: [
      { id: "m", name: "Mét (m)", factor: 1 },
      { id: "km", name: "Kilômét (km)", factor: 1000 },
      { id: "cm", name: "Centimét (cm)", factor: 0.01 },
      { id: "mm", name: "Milimét (mm)", factor: 0.001 },
      { id: "mile", name: "Dặm (mile)", factor: 1609.344 },
      { id: "yard", name: "Yard (yd)", factor: 0.9144 },
      { id: "foot", name: "Foot (ft)", factor: 0.3048 },
      { id: "inch", name: "Inch (in)", factor: 0.0254 }
    ],
    mass: [
      { id: "kg", name: "Kilôgam (kg)", factor: 1 },
      { id: "g", name: "Gam (g)", factor: 0.001 },
      { id: "mg", name: "Miligam (mg)", factor: 0.000001 },
      { id: "lb", name: "Pound (lb)", factor: 0.45359237 },
      { id: "oz", name: "Ounce (oz)", factor: 0.028349523 },
      { id: "yen", name: "Yến (VN)", factor: 10 },
      { id: "ta", name: "Tạ (VN)", factor: 100 },
      { id: "tan", name: "Tấn (VN/Metric)", factor: 1000 }
    ],
    temperature: [
      { id: "C", name: "Độ C (°C)" },
      { id: "F", name: "Độ F (°F)" },
      { id: "K", name: "Độ K (K)" }
    ],
    area: [
      { id: "m2", name: "Mét vuông (m²)", factor: 1 },
      { id: "km2", name: "Kilômét vuông (km²)", factor: 1000000 },
      { id: "ha", name: "Hecta (ha)", factor: 10000 },
      { id: "sao_bac", name: "Sào Bắc Bộ (360m²)", factor: 360 },
      { id: "sao_trung", name: "Sào Trung Bộ (500m²)", factor: 500 },
      { id: "sao_nam", name: "Sào Nam Bộ / Công (1000m²)", factor: 1000 },
      { id: "mau_bac", name: "Mẫu Bắc Bộ (3600m²)", factor: 3600 },
      { id: "mau_trung", name: "Mẫu Trung Bộ (5000m²)", factor: 5000 },
      { id: "mau_nam", name: "Mẫu Nam Bộ (10000m²)", factor: 10000 }
    ],
    currency: [
      { id: "VND", name: "Việt Nam Đồng (VND)", factor: 1 },
      { id: "USD", name: "Đô la Mỹ (USD)", factor: 25400 },
      { id: "EUR", name: "Euro (EUR)", factor: 27500 },
      { id: "JPY", name: "Yên Nhật (JPY)", factor: 163 },
      { id: "CNY", name: "Nhân dân tệ (CNY)", factor: 3500 },
      { id: "THB", name: "Bạt Thái Lan (THB)", factor: 695 }
    ]
  };

  // Set default units when tab changes
  useEffect(() => {
    const list = unitsMap[activeTab];
    if (list && list.length >= 2) {
      setUnitFrom(list[0].id);
      setUnitTo(list[1].id);
    }
  }, [activeTab]);

  // Convert function
  useEffect(() => {
    if (activeTab === "temperature") {
      let tempC = 0;
      // Convert to C
      if (unitFrom === "C") tempC = valFrom;
      else if (unitFrom === "F") tempC = ((valFrom - 32) * 5) / 9;
      else if (unitFrom === "K") tempC = valFrom - 273.15;

      // Convert from C to target
      let targetVal = 0;
      if (unitTo === "C") targetVal = tempC;
      else if (unitTo === "F") targetVal = (tempC * 9) / 5 + 32;
      else if (unitTo === "K") targetVal = tempC + 273.15;

      setValTo(Math.round(targetVal * 10000) / 10000);
      return;
    }

    const list = unitsMap[activeTab];
    if (!list) return;

    const fromObj = list.find((u) => u.id === unitFrom);
    const toObj = list.find((u) => u.id === unitTo);

    if (fromObj && toObj && "factor" in fromObj && "factor" in toObj) {
      const baseValue = valFrom * fromObj.factor;
      const targetValue = baseValue / toObj.factor;
      setValTo(Math.round(targetValue * 10000) / 10000);
    }
  }, [valFrom, unitFrom, unitTo, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/calc"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tính toán
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-455 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Bảo mật tuyệt đối - Mọi tính toán diễn ra ngay tại trình duyệt
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            📏 Đổi đơn vị đo lường
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Quy đổi qua lại giữa các đơn vị đo độ dài, cân nặng, diện tích (hỗ trợ cả sào, mẫu Bắc/Trung/Nam) và tỷ giá tiền tệ trực quan.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex overflow-x-auto gap-2 bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-755 shadow-sm mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab("length")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "length"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-650 dark:text-gray-450 hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            📏 Độ dài
          </button>
          <button
            onClick={() => setActiveTab("mass")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "mass"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-650 dark:text-gray-455 hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            ⚖️ Khối lượng
          </button>
          <button
            onClick={() => setActiveTab("temperature")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "temperature"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-650 dark:text-gray-455 hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            🌡️ Nhiệt độ
          </button>
          <button
            onClick={() => setActiveTab("area")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "area"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-650 dark:text-gray-455 hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            🗺️ Diện tích
          </button>
          <button
            onClick={() => setActiveTab("currency")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "currency"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-650 dark:text-gray-455 hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
          >
            💵 Tiền tệ
          </button>
        </div>

        {/* Converter Board */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Input from */}
            <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-850 space-y-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Giá trị gốc
              </label>
              
              <input
                type="number"
                value={valFrom}
                onChange={(e) => setValFrom(Number(e.target.value))}
                className="w-full bg-transparent border-b border-gray-200 dark:border-gray-750 pb-2 text-2xl font-black text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />

              <select
                value={unitFrom}
                onChange={(e) => setUnitFrom(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
              >
                {unitsMap[activeTab]?.map((u) => (
                  <option key={u.id} value={u.id} className="dark:bg-gray-900">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Input to */}
            <div className="bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl border border-gray-200 dark:border-gray-850 space-y-3">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Kết quả quy đổi
              </label>

              <input
                type="number"
                readOnly
                value={valTo}
                className="w-full bg-transparent border-b border-gray-200 dark:border-gray-750 pb-2 text-2xl font-black text-emerald-600 dark:text-emerald-450 focus:outline-none"
              />

              <select
                value={unitTo}
                onChange={(e) => setUnitTo(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
              >
                {unitsMap[activeTab]?.map((u) => (
                  <option key={u.id} value={u.id} className="dark:bg-gray-900">
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeTab === "currency" && (
            <p className="text-[10px] text-gray-400 text-center italic">
              * Tỷ giá tiền tệ chỉ mang tính chất tham khảo, được cập nhật thủ công định kỳ.
            </p>
          )}

          {activeTab === "area" && (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium space-y-1.5">
              <p className="font-bold text-emerald-700 dark:text-emerald-400">💡 Có thể bạn chưa biết (Hệ sào mẫu Việt Nam):</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li><strong>Bắc Bộ:</strong> 1 sào = 360 m², 1 mẫu = 10 sào = 3.600 m².</li>
                <li><strong>Trung Bộ:</strong> 1 sào = 500 m², 1 mẫu = 10 sào = 5.000 m².</li>
                <li><strong>Nam Bộ (Công):</strong> 1 sào (công) = 1.000 m², 1 mẫu = 10 sào = 10.000 m².</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
