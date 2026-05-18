"use client";

import Link from "next/link";
import { useState } from "react";

const VIETNAM_TOOLS = [
  {
    id: "lunar-calendar",
    name: "Âm Dương lịch Việt Nam",
    description: "Tra cứu ngày âm lịch, dương lịch, xem Can Chi, ngày hoàng đạo hắc đạo hoàn toàn offline.",
    emoji: "🏮"
  },
  {
    id: "cccd-check",
    name: "Kiểm tra số CCCD",
    description: "Giải mã thông tin tỉnh thành sinh, giới tính, năm sinh trực tiếp từ số căn cước công dân 12 số.",
    emoji: "🪪"
  },
  {
    id: "fake-name",
    name: "Tạo họ tên VN ngẫu nhiên",
    description: "Tạo danh sách họ tên, email, số điện thoại, địa chỉ Việt Nam ngẫu nhiên để phục vụ kiểm thử.",
    emoji: "🎲"
  },
  {
    id: "qr-reader",
    name: "Quét mã QR từ hình ảnh",
    description: "Tải ảnh chụp chứa mã QR từ thư viện ảnh của bạn lên để đọc nhanh nội dung văn bản ẩn.",
    emoji: "📷"
  },
  {
    id: "invoice",
    name: "Tạo biên lai bán hàng nhanh",
    description: "Tạo nhanh hóa đơn biên lai bán hàng chuyên nghiệp, tự động đổi số thành chữ và in ấn tiện lợi.",
    emoji: "🧾"
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
            <span>🇻🇳</span> Tiện ích Việt Nam
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
            Lịch vạn niên, kiểm tra mã số căn cước công dân, quét QR từ ảnh hay in hóa đơn được thiết kế riêng.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh tiện ích Việt Nam..."
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
              href={`/vietnam/${tool.id}`}
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
              Không tìm thấy công cụ tiện ích nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
