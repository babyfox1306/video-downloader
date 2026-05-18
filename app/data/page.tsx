"use client";

import Link from "next/link";
import { useState } from "react";

const DATA_TOOLS = [
  {
    id: "csv-to-excel",
    name: "Chuyển CSV sang Excel",
    description: "Nhập hoặc tải file CSV (.csv) lên để tự động định dạng và chuyển thành file Excel (.xlsx) tải về.",
    emoji: "📊"
  },
  {
    id: "excel-to-csv",
    name: "Chuyển Excel sang CSV",
    description: "Trích xuất nhanh toàn bộ dữ liệu từ bảng tính Excel (.xlsx, .xls) thành tệp tin CSV gọn nhẹ.",
    emoji: "📝"
  },
  {
    id: "json-to-csv",
    name: "Chuyển JSON sang CSV / Excel",
    description: "Chuyển đổi hai chiều giữa định dạng cấu trúc JSON và dạng bảng CSV/Excel cực nhanh.",
    emoji: "🔀"
  },
  {
    id: "view-excel",
    name: "Xem nhanh file Excel",
    description: "Mở nhanh file Excel (.xlsx) để xem dạng bảng HTML, hỗ trợ chuyển đổi giữa nhiều sheet không cần cài Office.",
    emoji: "👁️"
  },
  {
    id: "remove-duplicates",
    name: "Xóa dòng trùng lặp",
    description: "Tải file CSV/Excel lên để lọc sạch sẽ tất cả những bản ghi trùng lặp và xuất tệp tin sạch về máy.",
    emoji: "🧹"
  }
];

export default function DataToolsHubPage() {
  const [search, setSearch] = useState("");

  const filteredTools = DATA_TOOLS.filter(
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
            <span>📊</span> Bảng tính & Dữ liệu
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
            Đổi đuôi file Excel, CSV, JSON, xem trước nội dung bảng trực tiếp offline hoàn toàn an toàn bảo mật.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ bảng tính..."
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
              href={`/data/${tool.id}`}
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
              Không tìm thấy công cụ dữ liệu nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
