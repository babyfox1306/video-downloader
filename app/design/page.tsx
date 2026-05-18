"use client";

import Link from "next/link";
import { useState } from "react";

const DESIGN_TOOLS = [
  {
    id: "placeholder-image",
    name: "Tạo ảnh mẫu Placeholder",
    description: "Tạo nhanh ảnh placeholder với kích thước, màu nền và chữ tùy ý để chèn vào layout thiết kế.",
    emoji: "🖼️"
  },
  {
    id: "gradient",
    name: "Tạo màu Gradient CSS",
    description: "Thiết kế và chọn các dải màu gradient mượt mà, tự động xuất mã CSS gradient dùng ngay.",
    emoji: "🎨"
  },
  {
    id: "shadow",
    name: "Tạo bóng Box Shadow CSS",
    description: "Điều chỉnh độ nhòe, màu sắc, góc đổ bóng của thẻ và sao chép nhanh mã CSS shadow cực đẹp.",
    emoji: "👥"
  },
  {
    id: "favicon",
    name: "Tạo file Favicon .ico",
    description: "Tải ảnh vuông bất kỳ lên để tự động nén và xuất ra file favicon.ico đa kích thước cho website.",
    emoji: "🌐"
  },
  {
    id: "social-resize",
    name: "Cắt ảnh mạng xã hội",
    description: "Cắt và đổi kích thước ảnh chuẩn theo tỉ lệ avatar, ảnh bìa Facebook, Zalo, Tiktok hoặc CCCD.",
    emoji: "✂️"
  }
];

export default function DesignHubPage() {
  const [search, setSearch] = useState("");

  const filteredTools = DESIGN_TOOLS.filter(
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
            <span>🎨</span> Thiết kế nhanh
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
            Tạo ảnh placeholder, dải màu gradient, đổ bóng CSS shadow và chuyển đổi favicon trực tiếp.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ thiết kế..."
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
              href={`/design/${tool.id}`}
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
              Không tìm thấy công cụ thiết kế nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
