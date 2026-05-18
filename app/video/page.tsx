"use client";

import Link from "next/link";
import { useState } from "react";

const VIDEO_TOOLS = [
  {
    id: "trim",
    name: "Cắt ghép video online",
    description: "Cắt lấy đoạn video mong muốn từ tệp tin gốc cực nhanh hoàn toàn trên trình duyệt của bạn.",
    emoji: "🎬"
  },
  {
    id: "extract-audio",
    name: "Tách nhạc từ video",
    description: "Trích xuất lấy riêng tệp âm thanh (MP3, WAV) từ các video clip của bạn hoàn toàn offline.",
    emoji: "🎵"
  },
  {
    id: "compress",
    name: "Nén giảm dung lượng video",
    description: "Nén nhẹ tệp tin video siêu lớn để dễ dàng gửi qua Zalo, Messenger, email không sợ bị chặn.",
    emoji: "📦"
  },
  {
    id: "convert-audio",
    name: "Đổi đuôi file âm thanh",
    description: "Chuyển đổi định dạng qua lại giữa các tệp MP3, WAV, AAC, M4A, OGG hoàn toàn cục bộ.",
    emoji: "📻"
  }
];

export default function VideoHubPage() {
  const [search, setSearch] = useState("");

  const filteredTools = VIDEO_TOOLS.filter(
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
            <span>🎬</span> Video & Âm thanh
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
            Cắt video, tách âm thanh MP3, nén dung lượng video, đổi đuôi nhạc trực tiếp bằng FFmpeg.wasm offline.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Tìm nhanh công cụ video..."
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
              href={`/video/${tool.id}`}
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
              Không tìm thấy công cụ video nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
