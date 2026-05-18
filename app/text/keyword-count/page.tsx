"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface KeywordResult {
  keyword: string;
  count: number;
  percentage: number;
}

export default function KeywordCountPage() {
  const [text, setText] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [results, setResults] = useState<KeywordResult[]>([]);

  useEffect(() => {
    if (!text || !keywordInput.trim()) {
      setResults([]);
      return;
    }

    const keywords = keywordInput
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const totalWords = text.trim() ? text.trim().split(/\s+/).length : 0;

    const computed: KeywordResult[] = keywords.map((kw) => {
      let count = 0;
      try {
        const flags = caseSensitive ? "g" : "gi";
        // Escape special regex chars
        const escapedKw = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        
        // Find exact or partial matches
        const regex = new RegExp(escapedKw, flags);
        const matches = text.match(regex);
        count = matches ? matches.length : 0;
      } catch (e) {
        console.error(e);
      }

      // Calculate percentage in relation to total word count
      const percentage = totalWords > 0 ? (count / totalWords) * 100 : 0;

      return {
        keyword: kw,
        count,
        percentage
      };
    });

    setResults(computed);
  }, [text, keywordInput, caseSensitive]);

  const handleClear = () => {
    setText("");
    setKeywordInput("");
  };

  const handleLoadDemo = () => {
    setText(
      "Học tiếng Anh mỗi ngày giúp bạn tự tin giao tiếp. Tiếng Anh mở ra nhiều cơ hội học tập và làm việc. Nếu bạn yêu thích tiếng Anh, hãy luyện nghe tiếng Anh hàng ngày."
    );
    setKeywordInput("tiếng Anh\nhọc tập\ngiao tiếp\ncơ hội");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/text"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-455 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Xử lý offline - Chữ viết được bảo mật an toàn 100%
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              📊 Phân tích tần suất từ khóa
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Đếm số lần xuất hiện của các từ hoặc cụm từ cụ thể trong văn bản để tối ưu SEO hoặc phân tích tài liệu văn bản.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLoadDemo}
              className="px-4 py-2 border border-gray-250 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Xem mẫu thử
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-455 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Xóa hết
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Keywords Area (col: 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Nhập danh sách từ khóa
              </label>
              <textarea
                placeholder="Mỗi từ khóa viết trên 1 dòng..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                className="w-full h-44 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xs font-medium focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-100 leading-normal"
              />
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Nhập từ hoặc cụm từ bạn muốn đếm, mỗi dòng là một cụm từ riêng biệt.
              </p>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                />
                Phân biệt chữ hoa / chữ thường
              </label>
            </div>
          </div>

          {/* Text Editor & Results (col: 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Input textarea */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-5 space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Văn bản cần đếm từ khóa
              </label>
              <textarea
                placeholder="Nhập hoặc dán văn bản cần phân tích tần suất từ khóa vào đây..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xs focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-150 leading-relaxed font-sans"
              />
            </div>

            {/* Results Table */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                Bảng thống kê kết quả
              </h3>

              {results.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700 text-gray-400 font-bold">
                        <th className="py-2.5">Từ khóa</th>
                        <th className="py-2.5 text-center">Số lần lặp</th>
                        <th className="py-2.5 text-right">Tần suất (% tổng số từ)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {results.map((r, idx) => (
                        <tr key={idx} className="text-gray-700 dark:text-gray-300 font-medium">
                          <td className="py-3 font-bold text-gray-900 dark:text-white max-w-[200px] truncate">
                            {r.keyword}
                          </td>
                          <td className="py-3 text-center text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                            {r.count}
                          </td>
                          <td className="py-3 text-right">
                            {r.percentage.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-400 text-xs italic">
                  Vui lòng điền văn bản gốc và nhập ít nhất một từ khóa để phân tích.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
