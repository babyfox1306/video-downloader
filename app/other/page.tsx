"use client";

import Link from "next/link";
import { useState } from "react";

const OTHER_TOOLS = [
  {
    id: "qrcode",
    name: "Tạo & quét mã QR",
    description: "Tạo mã QR từ link trang web hoặc chữ bất kỳ, đổi màu sắc và tải ảnh QR về điện thoại.",
    emoji: "📱",
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: "image-compressor",
    name: "Nén ảnh hàng loạt",
    description: "Nén dung lượng cùng lúc nhiều ảnh JPG/PNG để dễ gửi đi, giữ nguyên chất lượng rõ nét.",
    emoji: "🗜️",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "background-remover",
    name: "Xóa nền ảnh bằng AI",
    description: "Tự động tách người hoặc vật thể ra khỏi ảnh chỉ trong 3 giây nhờ AI chạy ngay tại trình duyệt.",
    emoji: "✨",
    color: "from-purple-500 to-rose-500"
  }
];

export default function OtherToolsHubPage() {
  const [search, setSearch] = useState("");

  const filteredTools = OTHER_TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
          >
            <span>🏠</span> Trang chủ
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900 dark:text-white">
          ⚙️ Công cụ khác
        </h1>
        <p className="text-gray-650 dark:text-gray-400 mb-8 max-w-3xl text-sm md:text-base leading-relaxed">
          Xóa nền ảnh bằng AI, nén ảnh hàng loạt, tạo QR — chạy thẳng trên máy bạn, không upload lên đâu cả.
        </p>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-750 p-4 mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ cần dùng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-755 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 dark:text-white"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/other/${tool.id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-750 flex flex-col justify-between group transform hover:-translate-y-1"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition-transform`}
                >
                  {tool.emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1.5 transition-transform mt-auto pt-2">
                Mở công cụ <span>➔</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-750">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Không tìm thấy công cụ nào phù hợp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
