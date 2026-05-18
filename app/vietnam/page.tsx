"use client";

import Link from "next/link";
import { useState } from "react";

const VIETNAM_TOOLS = [
  {
    id: "lunar-calendar",
    name: "Âm Dương lịch Việt Nam",
    description: "Tra cứu ngày âm lịch, dương lịch, xem Can Chi, ngày hoàng đạo hắc đạo hoàn toàn offline.",
    emoji: "🏮",
    color: "from-red-500 to-rose-600"
  },
  {
    id: "cccd-check",
    name: "Kiểm tra số CCCD",
    description: "Giải mã thông tin tỉnh thành sinh, giới tính, năm sinh trực tiếp từ số căn cước công dân 12 số.",
    emoji: "🪪",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "fake-name",
    name: "Tạo họ tên VN ngẫu nhiên",
    description: "Tạo danh sách họ tên, email, số điện thoại, địa chỉ Việt Nam ngẫu nhiên để phục vụ kiểm thử phần mềm.",
    emoji: "🎲",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "qr-reader",
    name: "Quét mã QR từ hình ảnh",
    description: "Tải ảnh chụp chứa mã QR từ thư viện ảnh của bạn lên để đọc nhanh nội dung văn bản hoặc liên kết ẩn.",
    emoji: "📷",
    color: "from-purple-500 to-fuchsia-600"
  },
  {
    id: "invoice",
    name: "Tạo biên lai bán hàng nhanh",
    description: "Tạo nhanh hóa đơn biên lai bán hàng chuyên nghiệp, tự động đổi số thành chữ và in ấn tiện lợi.",
    emoji: "🧾",
    color: "from-amber-500 to-orange-600"
  }
];

export default function VietnamToolsHubPage() {
  const [search, setSearch] = useState("");

  const filteredTools = VIETNAM_TOOLS.filter(
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
            className="text-sm font-semibold text-rose-600 dark:text-rose-455 hover:underline flex items-center gap-1.5"
          >
            <span>🏠</span> Trang chủ
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900 dark:text-white">
          🇻🇳 Tiện ích Việt Nam
        </h1>
        <p className="text-gray-655 dark:text-gray-400 mb-8 max-w-3xl text-sm md:text-base leading-relaxed">
          Âm lịch, tra cứu thẻ căn cước công dân, quét mã QR từ ảnh hoặc thiết kế hóa đơn bán lẻ nhanh gọn — các công cụ thiết kế riêng cho người Việt.
        </p>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-750 p-4 mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh tiện ích Việt Nam cần dùng (ví dụ: âm lịch, CCCD, quét QR...)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 dark:text-white transition-colors"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/vietnam/${tool.id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-750 flex flex-col justify-between group transform hover:-translate-y-1"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition-transform`}
                >
                  {tool.emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-rose-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-455 group-hover:translate-x-1.5 transition-transform mt-auto pt-2">
                Mở công cụ <span>➔</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-755">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Không tìm thấy tiện ích Việt Nam nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
