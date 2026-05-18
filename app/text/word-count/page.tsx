"use client";

import Link from "next/link";
import { useState } from "react";

export default function WordCountPage() {
  const [text, setText] = useState("");

  const getStats = () => {
    const trimmed = text.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, "").length;
    const paragraphs = trimmed === "" ? 0 : trimmed.split(/\n+/).filter((p) => p.trim() !== "").length;
    
    // Simple sentence matching: split by ".", "?", "!"
    const sentences = trimmed === "" ? 0 : trimmed.split(/[.!?]+/).filter((s) => s.trim() !== "").length;

    // Estimate reading time (average 200 words/min)
    const readTimeMin = Math.ceil(words / 200);
    // Estimate speaking time (average 130 words/min)
    const speakTimeMin = Math.ceil(words / 130);

    return {
      words,
      charsWithSpaces,
      charsWithoutSpaces,
      paragraphs,
      sentences,
      readTime: words === 0 ? "0 giây" : readTimeMin < 1 ? `${Math.round(words * 0.3)} giây` : `${readTimeMin} phút`,
      speakTime: words === 0 ? "0 giây" : speakTimeMin < 1 ? `${Math.round(words * 0.46)} giây` : `${speakTimeMin} phút`
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/text"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện Ích
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Bảo mật 100% - Dữ liệu không gửi lên máy chủ
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>📝</span> Bộ Đếm Từ & Ký Tự
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Dán văn bản của bạn vào ô bên dưới để tự động phân tích chi tiết các số liệu thống kê.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Key counters */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-750 text-center shadow-sm">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Từ</p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.words}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-750 text-center shadow-sm">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Ký tự (gồm dấu cách)</p>
            <p className="text-3xl font-black text-blue-500 mt-1">{stats.charsWithSpaces}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-750 text-center shadow-sm">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Ký tự (không dấu cách)</p>
            <p className="text-3xl font-black text-indigo-500 mt-1">{stats.charsWithoutSpaces}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-750 text-center shadow-sm">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Đoạn văn</p>
            <p className="text-3xl font-black text-purple-500 mt-1">{stats.paragraphs}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor block */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập hoặc dán văn bản của bạn tại đây..."
                className="w-full min-h-[350px] bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none resize-y text-base leading-relaxed"
              />
              
              {text && (
                <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-750">
                  <button
                    onClick={() => setText("")}
                    className="text-xs text-rose-500 hover:text-rose-600 font-bold"
                  >
                    🗑 Xóa toàn bộ
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar with more details */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2 flex items-center gap-2">
                <span>📊</span> Chi tiết thống kê
              </h3>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Số câu văn:</span>
                <span className="font-bold text-gray-850 dark:text-gray-150">{stats.sentences}</span>
              </div>

              <div className="flex justify-between items-center text-sm border-t border-gray-50 dark:border-gray-750/30 pt-3">
                <span className="text-gray-500 flex items-center gap-1">
                  <span>⏱️</span> Thời gian đọc:
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.readTime}</span>
              </div>

              <div className="flex justify-between items-center text-sm border-t border-gray-50 dark:border-gray-750/30 pt-3">
                <span className="text-gray-500 flex items-center gap-1">
                  <span>🗣️</span> Thời gian nói:
                </span>
                <span className="font-bold text-blue-500">{stats.speakTime}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-500/20 rounded-2xl p-5 text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed shadow-sm">
              <h4 className="font-bold mb-1.5 flex items-center gap-1">
                <span>💡</span> Bạn có biết?
              </h4>
              Ước tính thời gian đọc dựa trên tốc độ đọc trung bình của người trưởng thành là 200 từ mỗi phút. Tốc độ nói ước tính dựa trên 130 từ mỗi phút đối với thuyết trình.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
