"use client";

import Link from "next/link";
import { useState } from "react";

const PDF_TOOLS = [
  {
    id: "compress",
    name: "Nén file PDF",
    description: "Giảm kích thước file PDF để dễ gửi qua Email, Zalo mà không làm mờ chữ hay hỏng trang tài liệu.",
    emoji: "📉",
    color: "from-red-500 to-rose-500"
  },
  {
    id: "merge",
    name: "Gộp nhiều PDF thành một",
    description: "Ghép nhiều file PDF nhỏ riêng lẻ thành một file duy nhất, tự do kéo thả sắp xếp lại thứ tự.",
    emoji: "🔗",
    color: "from-orange-500 to-amber-500"
  },
  {
    id: "split",
    name: "Tách trang PDF",
    description: "Chia nhỏ file PDF dài thành từng trang riêng biệt hoặc trích xuất lấy các trang bạn mong muốn.",
    emoji: "✂️",
    color: "from-purple-500 to-fuchsia-500"
  },
  {
    id: "rotate",
    name: "Xoay trang PDF",
    description: "Xoay thẳng lại các trang tài liệu bị scan ngược 90 độ, 180 độ một cách nhanh chóng và dễ dàng.",
    emoji: "🔁",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "remove-pages",
    name: "Xóa trang trong PDF",
    description: "Xem trước và loại bỏ nhanh những trang lỗi, trang trống, hoặc nội dung thừa trong file PDF.",
    emoji: "🗑️",
    color: "from-rose-500 to-pink-500"
  },
  {
    id: "pdf-to-jpg",
    name: "PDF ra ảnh JPG",
    description: "Tách toàn bộ các trang trong file PDF rồi lưu thành từng tệp ảnh JPG để dễ xem trên điện thoại.",
    emoji: "🖼️",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "pdf-to-png",
    name: "PDF ra ảnh PNG",
    description: "Đổi định dạng các trang PDF thành hình ảnh PNG không có nền chất lượng cao cực kỳ sắc nét.",
    emoji: "🎨",
    color: "from-teal-500 to-green-500"
  },
  {
    id: "jpg-to-pdf",
    name: "Ảnh thành file PDF",
    description: "Gộp nhiều tệp ảnh JPG, PNG chụp tài liệu lại thành một file PDF hoàn chỉnh và chuyên nghiệp.",
    emoji: "📄",
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: "word-to-pdf",
    name: "Word sang PDF",
    description: "Chuyển đổi file tài liệu Word (.docx) của bạn sang định dạng PDF mà không bị lỗi phông chữ.",
    emoji: "📝",
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "pdf-to-txt",
    name: "Lấy chữ từ PDF",
    description: "Đọc và trích xuất toàn bộ văn bản chữ bên trong file PDF rồi lưu thành file text (.txt) gọn nhẹ.",
    emoji: "🖨️",
    color: "from-yellow-500 to-orange-500"
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
          📄 Công cụ PDF online
        </h1>
        <p className="text-gray-650 dark:text-gray-400 mb-8 max-w-3xl text-sm md:text-base leading-relaxed">
          Nén, gộp, tách, xoay PDF, chuyển Word sang PDF — tất cả chạy ngay trên trình duyệt, bảo mật tuyệt đối.
        </p>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-750 p-4 mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ PDF cần dùng (ví dụ: Nén PDF, gộp trang, Word sang PDF...)..."
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
              href={`/pdf/${tool.id}`}
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
              <div className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-450 group-hover:translate-x-1.5 transition-transform mt-auto pt-2">
                Mở công cụ <span>➔</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-150 dark:border-gray-750">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Không tìm thấy công cụ PDF nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
