"use client";

import Link from "next/link";
import { useState } from "react";

const TEXT_TOOLS = [
  {
    id: "number-to-words",
    name: "Số → Chữ tiếng Việt",
    description: "Đọc số tiền, số đếm siêu lớn thành văn bản chữ tiếng Việt chuẩn xác và nhanh chóng.",
    emoji: "🔢"
  },
  {
    id: "case-convert",
    name: "Chuyển kiểu chữ",
    description: "Chuyển nhanh kiểu chữ sang viết hoa, viết thường, hoa đầu từ, hoa đầu câu lập tức.",
    emoji: "🔤"
  },
  {
    id: "text-diff",
    name: "So sánh 2 văn bản",
    description: "Highlight và so sánh sự khác nhau, phần thêm mới hoặc bị xóa giữa hai tài liệu.",
    emoji: "🔍"
  },
  {
    id: "clean-text",
    name: "Dọn dẹp văn bản",
    description: "Xóa khoảng trắng thừa, xóa dòng trống, chuyển tab, chuẩn hóa dấu câu nhanh chóng.",
    emoji: "🧹"
  },
  {
    id: "keyword-count",
    name: "Phân tích từ khóa",
    description: "Đếm số lần xuất hiện và mật độ phần trăm của các từ khóa trong văn bản chi tiết.",
    emoji: "📊"
  },
  {
    id: "word-count",
    name: "Đếm từ & ký tự",
    description: "Đếm nhanh số từ, số chữ, số dòng, xem mất bao lâu để đọc xong một bài viết.",
    emoji: "📝"
  },
  {
    id: "qr-generator",
    name: "Tạo mã QR",
    description: "Tạo nhanh mã QR từ link trang web, chữ viết thường, mật khẩu WiFi, số điện thoại.",
    emoji: "📱"
  },
  {
    id: "barcode-generator",
    name: "Tạo mã vạch",
    description: "Tạo mã vạch chuẩn để quản lý hàng hóa hoặc dán nhãn sản phẩm nhanh chóng.",
    emoji: "🏷️"
  },
  {
    id: "base64",
    name: "Mã hóa Base64",
    description: "Chuyển chữ hoặc ảnh sang chuỗi Base64 và ngược lại hoàn toàn trên trình duyệt.",
    emoji: "🔐"
  },
  {
    id: "json-formatter",
    name: "Định dạng JSON",
    description: "Làm đẹp, căn lề và kiểm tra lỗi chính tả trong chuỗi dữ liệu JSON cho dễ đọc.",
    emoji: "💻"
  },
  {
    id: "password-generator",
    name: "Tạo mật khẩu",
    description: "Tạo ngẫu nhiên mật khẩu siêu mạnh và an toàn để chống hack tài khoản của bạn.",
    emoji: "🔑"
  },
  {
    id: "lorem-ipsum",
    name: "Tạo văn bản giả",
    description: "Tạo nhanh các đoạn chữ mẫu dài ngắn tùy ý để chèn vào bản thiết kế cho đẹp.",
    emoji: "🖨️"
  },
  {
    id: "color-picker",
    name: "Bảng màu",
    description: "Chọn màu sắc, xem nhanh mã màu HEX, RGB và lưu lại các tông màu phối hợp ăn ý.",
    emoji: "🎨"
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
            <span>📝</span> Tiện ích văn phòng
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
            Tạo QR code, đếm từ, tạo mật khẩu, định dạng JSON trực tiếp trên trình duyệt máy bạn.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh tiện ích..."
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
              href={`/text/${tool.id}`}
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
