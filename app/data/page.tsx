"use client";

import Link from "next/link";
import { useState } from "react";

const DATA_TOOLS = [
  {
    id: "csv-to-excel",
    name: "Chuyển CSV sang Excel",
    description: "Nhập hoặc tải file CSV (.csv) lên để tự động định dạng và chuyển thành file Excel (.xlsx) tải về.",
    emoji: "📊",
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: "excel-to-csv",
    name: "Chuyển Excel sang CSV",
    description: "Trích xuất nhanh toàn bộ dữ liệu từ bảng tính Excel (.xlsx, .xls) thành tệp tin CSV gọn nhẹ.",
    emoji: "📝",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "json-to-csv",
    name: "Chuyển JSON sang CSV / Excel",
    description: "Chuyển đổi hai chiều giữa định dạng cấu trúc JSON và dạng bảng CSV/Excel cực nhanh.",
    emoji: "🔀",
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "view-excel",
    name: "Xem nhanh file Excel",
    description: "Mở nhanh file Excel (.xlsx) để xem dạng bảng HTML, hỗ trợ chuyển đổi giữa nhiều sheet không cần cài Office.",
    emoji: "👁️",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "remove-duplicates",
    name: "Xóa dòng trùng lặp",
    description: "Tải file CSV/Excel lên để lọc sạch sẽ tất cả những bản ghi trùng lặp và xuất tệp tin sạch về máy.",
    emoji: "🧹",
    color: "from-pink-500 to-rose-600"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-455 hover:underline flex items-center gap-1.5"
          >
            <span>🏠</span> Trang chủ
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900 dark:text-white">
          📊 Bảng tính & Dữ liệu
        </h1>
        <p className="text-gray-655 dark:text-gray-400 mb-8 max-w-3xl text-sm md:text-base leading-relaxed">
          Đổi đuôi file Excel, CSV, JSON, xem trước nội dung bảng tính cực nhanh hoặc lọc trùng dòng dữ liệu — 100% offline và an toàn bảo mật tuyệt đối cho mọi dữ liệu của bạn.
        </p>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-750 p-4 mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ bảng tính cần dùng (ví dụ: chuyển Excel, CSV, xóa dòng trùng...)..."
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
              href={`/data/${tool.id}`}
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
              Không tìm thấy công cụ dữ liệu nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
