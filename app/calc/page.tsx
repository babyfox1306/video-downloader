"use client";

import Link from "next/link";
import { useState } from "react";

const CALC_TOOLS = [
  {
    id: "loan",
    name: "Tính lãi vay ngân hàng",
    description: "Tính toán lịch trả nợ ngân hàng chi tiết hàng tháng theo dư nợ giảm dần hoặc gốc đều.",
    emoji: "💵",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "bmi",
    name: "Tính chỉ số BMI",
    description: "Kiểm tra chỉ số khối cơ thể (BMI) theo tiêu chuẩn WHO dành cho người châu Á.",
    emoji: "⚖️",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "unit-convert",
    name: "Đổi đơn vị đo lường",
    description: "Đổi nhanh đơn vị độ dài, khối lượng, diện tích chuẩn Việt Nam (sào, mẫu) và thế giới.",
    emoji: "📏",
    color: "from-orange-500 to-amber-500"
  },
  {
    id: "age",
    name: "Tính tuổi chính xác",
    description: "Xem chi tiết bạn đã sống bao nhiêu ngày, bao nhiêu giờ và đếm ngược tới sinh nhật kế tiếp.",
    emoji: "🎂",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "date-diff",
    name: "Khoảng cách 2 ngày",
    description: "Tính chính xác số ngày, số tuần hoặc số tháng giữa 2 mốc thời gian bất kỳ.",
    emoji: "📅",
    color: "from-violet-500 to-purple-500"
  }
];

export default function CalcHubPage() {
  const [search, setSearch] = useState("");

  const filteredTools = CALC_TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>🏠</span> Trang chủ
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900 dark:text-white">
          🧮 Tính toán & Tra cứu
        </h1>
        <p className="text-gray-650 dark:text-gray-400 mb-8 max-w-3xl text-sm md:text-base leading-relaxed">
          Tính lãi vay ngân hàng, kiểm tra chỉ số BMI, đổi đơn vị đo lường hoặc đếm ngày — các công cụ hỗ trợ công việc và cuộc sống hàng ngày.
        </p>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-750 p-4 mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ tính toán cần dùng (ví dụ: lãi vay, BMI, đổi đơn vị...)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 dark:text-white transition-colors"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/calc/${tool.id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-750 flex flex-col justify-between group transform hover:-translate-y-1"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition-transform`}
                >
                  {tool.emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-450 group-hover:translate-x-1.5 transition-transform mt-auto pt-2">
                Mở công cụ <span>➔</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-755">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Không tìm thấy công cụ tính toán nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
