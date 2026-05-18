"use client";

import Link from "next/link";
import { useState } from "react";

const PDF_TOOLS = [
  {
    id: "compress",
    name: "Nén file PDF",
    description: "Giảm kích thước file PDF để dễ gửi qua Email, Zalo mà không làm mờ chữ.",
    emoji: "📉"
  },
  {
    id: "merge",
    name: "Gộp nhiều PDF thành một",
    description: "Ghép nhiều file PDF riêng lẻ thành một file duy nhất, tự do sắp xếp thứ tự.",
    emoji: "🔗"
  },
  {
    id: "split",
    name: "Tách trang PDF",
    description: "Chia nhỏ file PDF dài thành từng trang riêng biệt hoặc trích xuất lấy các trang.",
    emoji: "✂️"
  },
  {
    id: "rotate",
    name: "Xoay trang PDF",
    description: "Xoay thẳng lại các trang tài liệu bị scan ngược 90 độ, 180 độ nhanh chóng.",
    emoji: "🔁"
  },
  {
    id: "remove-pages",
    name: "Xóa trang trong PDF",
    description: "Xem trước và loại bỏ nhanh những trang lỗi, trang trống, hoặc nội dung thừa.",
    emoji: "🗑️"
  },
  {
    id: "pdf-to-jpg",
    name: "PDF ra ảnh JPG",
    description: "Tách các trang PDF rồi lưu thành từng tệp ảnh JPG để dễ xem trên điện thoại.",
    emoji: "🖼️"
  },
  {
    id: "pdf-to-png",
    name: "PDF ra ảnh PNG",
    description: "Đổi định dạng các trang PDF thành hình ảnh PNG không nền chất lượng sắc nét.",
    emoji: "🎨"
  },
  {
    id: "jpg-to-pdf",
    name: "Ảnh thành file PDF",
    description: "Gộp nhiều tệp ảnh JPG, PNG chụp tài liệu lại thành một file PDF hoàn chỉnh.",
    emoji: "📄"
  },
  {
    id: "word-to-pdf",
    name: "Word sang PDF",
    description: "Chuyển đổi file tài liệu Word (.docx) của bạn sang định dạng PDF tiện lợi.",
    emoji: "📝"
  },
  {
    id: "pdf-to-txt",
    name: "Lấy chữ từ PDF",
    description: "Đọc và trích xuất toàn bộ văn bản chữ bên trong file PDF rồi lưu thành file txt.",
    emoji: "🖨️"
  }
];

export default function PDFToolsHubPage() {
  const [search, setSearch] = useState("");

  const filteredTools = PDF_TOOLS.filter(
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
            <span>📄</span> Công cụ PDF online
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
            Nén, gộp, tách, xoay PDF, chuyển Word sang PDF trực tiếp trên trình duyệt máy bạn.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ PDF..."
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
              href={`/pdf/${tool.id}`}
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
              Không tìm thấy công cụ PDF nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
