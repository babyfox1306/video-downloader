"use client";

import Link from "next/link";
import { useState } from "react";

const TEXT_TOOLS = [
  {
    id: "word-count",
    name: "Đếm Từ & Ký Tự",
    description: "Đếm số từ, ký tự, đoạn văn, ước tính thời gian đọc và thời gian nói cực kỳ chính xác.",
    emoji: "📝",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "qr-generator",
    name: "Tạo Mã QR Code",
    description: "Tạo mã QR nhanh chóng từ URL, văn bản, thông tin WiFi, email, số điện thoại hoặc vCard.",
    emoji: "📱",
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: "barcode-generator",
    name: "Tạo Mã Vạch Barcode",
    description: "Tạo mã vạch chất lượng cao (CODE128, EAN-13, UPC) để in ấn hoặc quản lý kho hàng.",
    emoji: "🏷️",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "base64",
    name: "Mã Hóa & Giải Mã Base64",
    description: "Chuyển đổi văn bản hoặc hình ảnh sang chuỗi mã hóa Base64 và ngược lại hoàn toàn offline.",
    emoji: "🔐",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "json-formatter",
    name: "Định Dạng JSON",
    description: "Làm đẹp (format), nén (minify) và kiểm tra tính hợp lệ của chuỗi dữ liệu JSON.",
    emoji: "💻",
    color: "from-orange-500 to-amber-500"
  },
  {
    id: "password-generator",
    name: "Tạo Mật Khẩu Mạnh",
    description: "Tạo mật khẩu an toàn, ngẫu nhiên với độ dài tùy chọn, chống bẻ khóa và bảo mật cao.",
    emoji: "🔑",
    color: "from-violet-500 to-fuchsia-500"
  },
  {
    id: "lorem-ipsum",
    name: "Tạo Văn Bản Giả (Lorem)",
    description: "Tạo nhanh các đoạn văn bản mẫu (bằng tiếng Anh hoặc tiếng Việt) để thiết kế giao diện web/in ấn.",
    emoji: "🖨️",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "color-picker",
    name: "Bộ Chọn Màu Sắc",
    description: "Chọn màu sắc, lấy mã màu HEX, RGB, HSL, CMYK và gợi ý các bảng màu phối hợp tuyệt đẹp.",
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
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
          >
            <span>🏠</span> Trang chủ
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900 dark:text-white bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          📝 Tiện Ích Văn Bản & Công Cụ
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl text-sm md:text-base">
          Trọn bộ công cụ xử lý văn bản, mã QR, bảo mật và tiện ích lập trình hoàn toàn bảo mật. 
          Không có bất kỳ dữ liệu nào rời khỏi trình duyệt của bạn!
        </p>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-750 p-4 mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh tiện ích văn bản cần dùng (ví dụ: QR, đếm từ, mật khẩu...)..."
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
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1.5 transition-transform mt-auto">
                Mở công cụ <span>➔</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-750">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Không tìm thấy công cụ văn bản nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
