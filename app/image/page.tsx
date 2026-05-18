"use client";

import Link from "next/link";
import { useState } from "react";

const IMAGE_TOOLS = [
  {
    id: "compress",
    name: "Nén ảnh",
    description: "Giảm dung lượng hình ảnh JPG, PNG, WEBP mà vẫn giữ nguyên độ nét, hỗ trợ nén nhiều ảnh cùng lúc.",
    emoji: "📉",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "convert",
    name: "Đổi đuôi ảnh",
    description: "Chuyển đổi linh hoạt qua lại giữa các đuôi PNG, JPG, WEBP, BMP, GIF, ICO cực kỳ nhanh chóng.",
    emoji: "🔄",
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: "resize",
    name: "Đổi kích thước ảnh",
    description: "Thay đổi kích thước ảnh theo pixel hoặc theo các khung mẫu sẵn như CCCD, ảnh Facebook, Instagram.",
    emoji: "📐",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "remove-bg",
    name: "Xóa nền ảnh",
    description: "Tách người hoặc vật thể ra khỏi ảnh, tạo phông nền trong suốt tự động bằng AI chạy ngay trên máy.",
    emoji: "✨",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "watermark",
    name: "Thêm watermark",
    description: "Chèn logo hoặc chữ bản quyền lên ảnh để bảo vệ hình ảnh cá nhân, tránh bị người khác copy.",
    emoji: "🛡️",
    color: "from-orange-500 to-amber-500"
  },
  {
    id: "crop",
    name: "Cắt ảnh",
    description: "Cắt bớt các phần thừa của ảnh tự do hoặc cắt theo tỉ lệ cố định 1:1, 16:9, 4:3 siêu dễ.",
    emoji: "✂️",
    color: "from-violet-500 to-fuchsia-500"
  },
  {
    id: "rotate-flip",
    name: "Xoay & lật ảnh",
    description: "Xoay ảnh các góc 90/180/270 độ hoặc lật ngược ảnh theo chiều ngang, chiều dọc tùy ý.",
    emoji: "🔁",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "heic-to-jpg",
    name: "Chuyển ảnh iPhone (HEIC) sang JPG",
    description: "Đổi định dạng ảnh HEIC từ điện thoại iPhone, iPad sang đuôi JPG để xem được trên mọi máy tính.",
    emoji: "🍏",
    color: "from-red-500 to-pink-500"
  },
  {
    id: "svg-to-png",
    name: "Chuyển SVG sang ảnh PNG",
    description: "Chuyển đổi các file đồ họa vector SVG thành hình ảnh PNG sắc nét để dễ chia sẻ lên mạng.",
    emoji: "🎨",
    color: "from-teal-500 to-emerald-500"
  },
  {
    id: "add-border",
    name: "Thêm viền ảnh",
    description: "Thêm một khung viền màu sắc bắt mắt xung quanh ảnh với độ dày viền tùy chỉnh cực đẹp.",
    emoji: "🖼️",
    color: "from-blue-600 to-indigo-600"
  }
];

export default function ImageToolsHubPage() {
  const [search, setSearch] = useState("");

  const filteredTools = IMAGE_TOOLS.filter(
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
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900 dark:text-white">
          🖼️ Chỉnh sửa ảnh online
        </h1>
        <p className="text-gray-650 dark:text-gray-400 mb-8 max-w-3xl text-sm md:text-base leading-relaxed">
          Nén ảnh, đổi đuôi, xóa nền, cắt, resize — miễn phí, không cần cài đặt, ảnh không rời máy bạn.
        </p>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-750 p-4 mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ cần dùng (ví dụ: Nén ảnh, xóa nền, CCCD, xoay ảnh...)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 dark:text-white transition-colors"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/image/${tool.id}`}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-750 flex flex-col justify-between group transform hover:-translate-y-1"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition-transform`}
                >
                  {tool.emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1.5 transition-transform mt-auto pt-2">
                Mở công cụ <span>➔</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-750">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Không tìm thấy công cụ chỉnh sửa ảnh nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
