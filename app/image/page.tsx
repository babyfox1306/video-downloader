"use client";

import Link from "next/link";
import { useState } from "react";

const IMAGE_TOOLS = [
  {
    id: "compress",
    name: "Nén ảnh",
    description: "Giảm dung lượng hình ảnh JPG, PNG, WEBP mà vẫn giữ nguyên độ nét, hỗ trợ nén hàng loạt.",
    emoji: "📉"
  },
  {
    id: "convert",
    name: "Đổi đuôi ảnh",
    description: "Chuyển đổi linh hoạt qua lại giữa các đuôi PNG, JPG, WEBP, BMP, GIF, ICO cực kỳ nhanh chóng.",
    emoji: "🔄"
  },
  {
    id: "resize",
    name: "Đổi kích thước ảnh",
    description: "Thay đổi kích thước ảnh theo pixel hoặc theo các khung mẫu sẵn như CCCD, ảnh Facebook.",
    emoji: "📐"
  },
  {
    id: "remove-bg",
    name: "Xóa nền ảnh",
    description: "Tách người hoặc vật thể ra khỏi ảnh, tạo phông nền trong suốt tự động bằng AI cục bộ.",
    emoji: "✨"
  },
  {
    id: "watermark",
    name: "Thêm watermark",
    description: "Chèn logo hoặc chữ bản quyền lên ảnh để bảo vệ hình ảnh cá nhân, tránh bị sao chép.",
    emoji: "🛡️"
  },
  {
    id: "crop",
    name: "Cắt ảnh",
    description: "Cắt bớt các phần thừa của ảnh tự do hoặc cắt theo tỉ lệ cố định 1:1, 16:9, 4:3 siêu dễ.",
    emoji: "✂️"
  },
  {
    id: "rotate-flip",
    name: "Xoay & lật ảnh",
    description: "Xoay ảnh các góc 90/180/270 độ hoặc lật ngược ảnh theo chiều ngang, chiều dọc tùy ý.",
    emoji: "🔁"
  },
  {
    id: "heic-to-jpg",
    name: "Chuyển ảnh HEIC sang JPG",
    description: "Đổi định dạng ảnh HEIC từ điện thoại iPhone sang đuôi JPG để xem được trên mọi máy tính.",
    emoji: "🍏"
  },
  {
    id: "svg-to-png",
    name: "Chuyển SVG sang ảnh PNG",
    description: "Chuyển đổi các file đồ họa vector SVG thành hình ảnh PNG sắc nét để dễ chia sẻ.",
    emoji: "🎨"
  },
  {
    id: "add-border",
    name: "Thêm viền ảnh",
    description: "Thêm một khung viền màu sắc bắt mắt xung quanh ảnh với độ dày viền tùy chỉnh cực đẹp.",
    emoji: "🖼️"
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
            <span>🖼️</span> Chỉnh sửa ảnh online
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
            Nén ảnh, đổi đuôi, xóa nền, cắt, resize trực tiếp trên trình duyệt máy bạn.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ ảnh..."
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
              href={`/image/${tool.id}`}
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
              Không tìm thấy công cụ ảnh nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
