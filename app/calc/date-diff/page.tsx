"use client";

import Link from "next/link";
import { useState } from "react";

export default function DateDiffPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateDifference = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffMs = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    const weeks = (totalDays / 7).toFixed(1);
    const months = (totalDays / 30.437).toFixed(1); // average days in a month
    const years = (totalDays / 365.25).toFixed(2); // including leap years

    setResult({
      totalDays,
      weeks,
      months,
      years
    });
  };

  const handleSetToday = (target: "start" | "end") => {
    const today = new Date().toISOString().split("T")[0];
    if (target === "start") setStartDate(today);
    else setEndDate(today);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/calc"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tính toán
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Xử lý ngoại tuyến 100% - Bảo mật dữ liệu lịch trình của bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            📅 Khoảng cách giữa hai ngày
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tính toán chính xác số ngày, tuần, tháng hoặc năm giữa hai mốc thời gian. Hữu ích cho việc tính thời hạn hợp đồng, thời hạn visa hay deadline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Inputs (col: 5) */}
          <div className="md:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 shadow-md space-y-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-755 pb-2">
              Chọn hai mốc ngày
            </h3>

            {/* Date A */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-400 uppercase">
                  Từ ngày (Mốc A)
                </label>
                <button
                  onClick={() => handleSetToday("start")}
                  className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 hover:underline cursor-pointer"
                >
                  Chọn Hôm nay
                </button>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
              />
            </div>

            {/* Date B */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-400 uppercase">
                  Đến ngày (Mốc B)
                </label>
                <button
                  onClick={() => handleSetToday("end")}
                  className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 hover:underline cursor-pointer"
                >
                  Chọn Hôm nay
                </button>
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
              />
            </div>

            <button
              onClick={calculateDifference}
              disabled={!startDate || !endDate}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm disabled:opacity-50"
            >
              📅 Bắt đầu tính toán
            </button>
          </div>

          {/* Results (col: 7) */}
          <div className="md:col-span-7">
            {!result ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-8 text-center shadow-md min-h-[300px] flex flex-col justify-center items-center space-y-3">
                <span className="text-5xl">📅</span>
                <p className="text-gray-750 dark:text-gray-300 font-bold">Xem khoảng cách thời gian</p>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Thiết lập hai mốc ngày cụ thể ở bên trái và bấm nút để xem ngay khoảng cách thời gian chính xác nhất.
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 shadow-md space-y-6">
                <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                  Kết quả phân tích thời gian
                </h3>

                {/* Main large display */}
                <div className="text-center py-6 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-850 space-y-1">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tổng khoảng cách theo ngày</p>
                  <p className="text-5xl font-black text-emerald-600 dark:text-emerald-450 font-mono">
                    {new Intl.NumberFormat("vi-VN").format(result.totalDays)}
                  </p>
                  <span className="text-xs font-bold text-gray-500">ngày</span>
                </div>

                {/* Sub-breakdowns */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl border border-gray-150 dark:border-gray-850">
                    <p className="text-base font-extrabold text-gray-900 dark:text-white font-mono">{result.weeks}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Số tuần</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl border border-gray-150 dark:border-gray-850">
                    <p className="text-base font-extrabold text-gray-900 dark:text-white font-mono">{result.months}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Số tháng</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-950 p-3.5 rounded-xl border border-gray-150 dark:border-gray-850">
                    <p className="text-base font-extrabold text-gray-900 dark:text-white font-mono">{result.years}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Số năm</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
