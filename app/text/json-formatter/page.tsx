"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function JSONFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const formatJSON = (minify = false) => {
    setValidationError(null);
    if (input.trim() === "") {
      setOutput("");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      if (minify) {
        setOutput(JSON.stringify(parsed));
      } else {
        setOutput(JSON.stringify(parsed, null, indentSize));
      }
    } catch (err: any) {
      setValidationError(err.message || "Chuỗi JSON không đúng cấu trúc cú pháp.");
      setOutput("");
    }
  };

  useEffect(() => {
    formatJSON();
  }, [input, indentSize]);

  const loadSample = () => {
    const sample = {
      name: "ZavClip Studio",
      type: "Free Office Toolkit",
      features: ["PDF Compressor", "Image Background Remover", "Meme Maker"],
      year: 2026,
      active: true,
      stats: {
        users: 15000,
        rating: 4.8
      }
    };
    setInput(JSON.stringify(sample));
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

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
            🔒 Bảo mật 100% - Dữ liệu xử lý hoàn toàn cục bộ
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>💻</span> Trình Định Dạng & Kiểm Tra JSON
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Format chuỗi JSON rối rắm trở nên dễ đọc, nén gọn (minify), hoặc kiểm tra lỗi cú pháp lập trình.
        </p>

        {/* Quick controls bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 p-4 mb-6 flex flex-wrap gap-3 items-center justify-between shadow-sm">
          <div className="flex gap-2">
            <button
              onClick={loadSample}
              className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              📝 Chèn Mẫu Thử
            </button>
            <button
              onClick={() => formatJSON(true)}
              disabled={!input}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              ⚡ Nén Gọn (Minify)
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-semibold">Khoảng thụt dòng (Indent):</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-750 px-2 py-1 rounded font-bold cursor-pointer"
            >
              <option value="2">2 Khoảng trắng</option>
              <option value="4">4 Khoảng trắng</option>
              <option value="8">8 Khoảng trắng</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Dữ liệu JSON đầu vào
              </label>
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="text-xs text-rose-500 font-bold hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Dán đoạn mã JSON tại đây, ví dụ: {"name":"John", "age":30}'
              className="w-full h-80 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500 dark:text-white font-mono leading-relaxed"
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 flex flex-col justify-between h-full">
            <div className="space-y-3 w-full">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-400 uppercase">
                  Kết quả định dạng
                </label>
                {output && !validationError && (
                  <button
                    onClick={handleCopy}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    {copySuccess ? "✅ Đã Sao Chép" : "📋 Sao Chép"}
                  </button>
                )}
              </div>

              {validationError ? (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs space-y-1">
                  <h4 className="font-bold flex items-center gap-1">
                    <span>⚠️</span> Cú pháp JSON Lỗi:
                  </h4>
                  <p className="font-mono mt-1 break-words">{validationError}</p>
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-750 rounded-xl p-4 text-sm font-mono overflow-y-auto break-all select-all text-emerald-600 dark:text-emerald-400 leading-relaxed whitespace-pre">
                  {output || <span className="text-gray-400 italic">Đang chờ dữ liệu JSON hợp lệ...</span>}
                </div>
              )}
            </div>

            {/* Validation successful banner */}
            {!validationError && output && (
              <div className="mt-4 p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1">
                <span>✓</span> JSON hợp lệ (Valid JSON)
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
