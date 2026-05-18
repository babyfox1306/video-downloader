"use client";

import Link from "next/link";
import { useState } from "react";

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const now = new Date();

    if (birth > now) {
      alert("Ngày sinh không thể nằm ở tương lai!");
      return;
    }

    // Exact years, months, days calculation
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      // Get days in previous month
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days, hours, minutes lived
    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    // Next birthday calculation
    let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    const nextBdayDiff = nextBirthday.getTime() - now.getTime();
    const daysToNextBirthday = Math.ceil(nextBdayDiff / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      daysToNextBirthday
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/calc"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tính toán
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 An toàn tuyệt đối - Ngày sinh của bạn được xử lý offline
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🎂 Tính tuổi chính xác & Đếm ngày sinh nhật
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tính toán chi tiết tuổi của bạn (số năm, số tháng, số ngày) và xem các con số thống kê thú vị về hành trình cuộc đời của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* DOB Input (col: 5) */}
          <div className="md:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 shadow-md space-y-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Chọn ngày sinh của bạn
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Ngày, tháng, năm sinh
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
              />
            </div>

            <button
              onClick={calculateAge}
              disabled={!birthDate}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm disabled:opacity-50"
            >
              🎉 Bắt đầu tính tuổi
            </button>
          </div>

          {/* Results panel (col: 7) */}
          <div className="md:col-span-7">
            {!result ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-8 text-center shadow-md min-h-[300px] flex flex-col justify-center items-center space-y-3">
                <span className="text-5xl">🎂</span>
                <p className="text-gray-750 dark:text-gray-300 font-bold">Xem kết quả tuổi & đếm ngược</p>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Thiết lập ngày tháng năm sinh ở bên trái và bấm nút để xem ngay thống kê cuộc đời siêu thú vị.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Age detail card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 shadow-md space-y-4">
                  <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                    Tuổi hiện tại của bạn
                  </h3>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-150 dark:border-gray-850">
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-450">{result.years}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Tuổi (Năm)</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-150 dark:border-gray-850">
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-450">{result.months}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Tháng</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-150 dark:border-gray-850">
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-450">{result.days}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Ngày</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-3.5 rounded-xl text-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    🎂 Sinh nhật tiếp theo của bạn còn: {result.daysToNextBirthday} ngày!
                  </div>
                </div>

                {/* Life numbers card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 shadow-md space-y-4">
                  <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                    Các con số thú vị về bạn
                  </h3>

                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-750 pb-2">
                      <span className="text-gray-500 font-medium">Tổng số ngày đã sống:</span>
                      <strong className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                        {new Intl.NumberFormat("vi-VN").format(result.totalDays)} ngày
                      </strong>
                    </div>

                    <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-755 pb-2">
                      <span className="text-gray-500 font-medium">Tổng số giờ đã sống:</span>
                      <strong className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                        {new Intl.NumberFormat("vi-VN").format(result.totalHours)} giờ
                      </strong>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Tổng số phút đã sống:</span>
                      <strong className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                        {new Intl.NumberFormat("vi-VN").format(result.totalMinutes)} phút
                      </strong>
                    </div>
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
