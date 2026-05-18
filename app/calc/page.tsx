"use client";

import Link from "next/link";
import { useState } from "react";

const CALC_TOOLS = [
  {
    id: "loan",
    name: "Tính lãi vay ngân hàng",
    description: "Tính toán lịch trả nợ ngân hàng chi tiết hàng tháng theo dư nợ giảm dần hoặc gốc đều.",
    emoji: "💵"
  },
  {
    id: "bmi",
    name: "Tính chỉ số BMI",
    description: "Kiểm tra chỉ số khối cơ thể (BMI) theo tiêu chuẩn WHO dành cho người châu Á.",
    emoji: "⚖️"
  },
  {
    id: "unit-convert",
    name: "Đổi đơn vị đo lường",
    description: "Đổi nhanh đơn vị độ dài, khối lượng, diện tích chuẩn Việt Nam (sào, mẫu) và thế giới.",
    emoji: "📏"
  },
  {
    id: "age",
    name: "Tính tuổi chính xác",
    description: "Xem chi tiết bạn đã sống bao nhiêu ngày, bao nhiêu giờ và đếm ngược tới sinh nhật kế tiếp.",
    emoji: "🎂"
  },
  {
    id: "date-diff",
    name: "Khoảng cách 2 ngày",
    description: "Tính chính xác số ngày, số tuần hoặc số tháng giữa 2 mốc thời gian bất kỳ.",
    emoji: "📅"
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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] py-12 px-4 transition-colors">
      <div className="container mx-auto max-w-5xl">
        {/* Minimalist Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-xs font-semibold text-[#4F46E5] dark:text-[#6366F1] hover:underline flex items-center gap-1"
          >
            <span>➔</span> Quay lại Trang chủ
          </Link>
        </div>

        {/* Clean Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-[#111827] dark:text-[#F1F5F9] flex items-center gap-2">
            <span>🧮</span> Tính toán & Tra cứu
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
            Tính lãi vay ngân hàng, đổi đơn vị đo sào mẫu đất đai, tính chỉ số BMI, đếm số ngày cực nhanh.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ tính toán..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#4F46E5] dark:focus:border-[#6366F1] dark:text-white transition-colors shadow-sm"
          />
        </div>

        {/* Cruip Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/calc/${tool.id}`}
              className="group block bg-white dark:bg-[#1E293B] rounded-xl p-5 border border-[#E5E7EB] dark:border-[#334155] shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#4F46E5] dark:hover:border-[#6366F1] transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg leading-none">{tool.emoji}</span>
                <h3 className="text-sm font-bold text-[#111827] dark:text-[#F1F5F9] group-hover:text-[#4F46E5] dark:group-hover:text-[#6366F1] transition-colors">
                  {tool.name}
                </h3>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] shadow-sm">
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
              Không tìm thấy công cụ tính toán nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
