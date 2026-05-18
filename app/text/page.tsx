"use client";

import Link from "next/link";
import { useState } from "react";

const TEXT_TOOLS = [
  {
    id: "word-count",
    name: "Đếm từ & ký tự",
    description: "Đếm nhanh số từ, số chữ, số dòng, xem mất bao lâu để đọc xong một bài viết.",
    emoji: "📝",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "qr-generator",
    name: "Tạo mã QR",
    description: "Tạo nhanh mã QR từ link trang web, chữ viết thường, mật khẩu WiFi, số điện thoại.",
    emoji: "📱",
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: "barcode-generator",
    name: "Tạo mã vạch",
    description: "Tạo mã vạch chuẩn để quản lý hàng hóa hoặc dán nhãn sản phẩm nhanh chóng.",
    emoji: "🏷️",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "base64",
    name: "Mã hóa Base64",
    description: "Chuyển chữ hoặc ảnh sang chuỗi Base64 và ngược lại hoàn toàn trên trình duyệt.",
    emoji: "🔐",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "json-formatter",
    name: "Định dạng JSON",
    description: "Làm đẹp, căn lề và kiểm tra lỗi chính tả trong chuỗi dữ liệu JSON cho dễ đọc.",
    emoji: "💻",
    color: "from-orange-500 to-amber-500"
  },
  {
    id: "password-generator",
    name: "Tạo mật khẩu",
    description: "Tạo ngẫu nhiên mật khẩu siêu mạnh và an toàn để chống hack tài khoản của bạn.",
    emoji: "🔑",
    color: "from-violet-500 to-fuchsia-500"
  },
  {
    id: "lorem-ipsum",
    name: "Tạo văn bản giả",
    description: "Tạo nhanh các đoạn chữ mẫu dài ngắn tùy ý để chèn vào bản thiết kế cho đẹp.",
    emoji: "🖨️",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "color-picker",
    name: "Bảng màu",
    description: "Chọn màu sắc, xem nhanh mã màu HEX, RGB và lưu lại các tông màu phối hợp ăn ý.",
    emoji: "🎨",
    color: "from-red-500 to-pink-500"
  }
];

export default function TextToolsHubPage() {
  const [search, setSearch] = useState("");

  const filteredTools = TEXT_TOOLS.filter(
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
          📝 Công cụ tiện ích
        </h1>
        <p className="text-gray-650 dark:text-gray-400 mb-8 max-w-3xl text-sm md:text-base leading-relaxed">
          Tạo QR code, đếm từ, tạo mật khẩu, format JSON — những thứ nhỏ nhưng cần mỗi ngày.
        </p>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-750 p-4 mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ cần dùng (ví dụ: QR, đếm từ, mật khẩu...)..."
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
              href={`/text/${tool.id}`}
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
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-750">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Không tìm thấy công cụ tiện ích nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
