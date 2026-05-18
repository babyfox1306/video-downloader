"use client";

import Link from "next/link";
import { useState } from "react";

export default function CaseConvertPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toUppercase = () => {
    setText((prev) => prev.toUpperCase());
  };

  const toLowercase = () => {
    setText((prev) => prev.toLowerCase());
  };

  const toTitleCase = () => {
    setText((prev) => {
      return prev
        .split(" ")
        .map((word) => {
          if (!word) return "";
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
    });
  };

  const toSentenceCase = () => {
    setText((prev) => {
      if (!prev) return "";
      return prev
        .split(/([.!?]\s*)/)
        .map((part, index, arr) => {
          // If previous part was a punctuation mark, capitalize this part
          const isAfterPunct = index > 0 && arr[index - 1].match(/[.!?]\s*/);
          const isFirst = index === 0;
          if ((isFirst || isAfterPunct) && part.trim().length > 0) {
            const trimmed = part.trim();
            return part.replace(trimmed, trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase());
          }
          return part;
        })
        .join("");
    });
  };

  const toAlternatingCase = () => {
    setText((prev) => {
      return prev
        .split("")
        .map((char, index) => {
          return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
        })
        .join("");
    });
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/text"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Xử lý offline - Chữ viết được bảo mật hoàn toàn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🔤 Chuyển đổi kiểu chữ
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Chuyển nhanh kiểu chữ sang viết hoa, viết thường, hoa chữ cái đầu hoặc viết xen kẽ cực kỳ dễ dàng.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Input Textarea (col: 8) */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-4">
            <textarea
              placeholder="Nhập hoặc dán đoạn văn bản cần chuyển đổi vào đây..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-80 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 text-sm focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-100 leading-relaxed font-sans"
            />

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                Ký tự: <strong>{text.length}</strong> | Từ: <strong>{text.trim() ? text.trim().split(/\s+/).length : 0}</strong>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  disabled={!text}
                  className="px-4 py-2 border border-gray-250 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                >
                  Xóa sạch
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!text}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer disabled:opacity-50"
                >
                  {copied ? "✓ Đã copy" : "📋 Sao chép"}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Transform Controls (col: 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-5">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
              Các kiểu chữ viết
            </h3>

            <div className="space-y-3">
              <button
                onClick={toUppercase}
                disabled={!text}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-bold text-xs cursor-pointer disabled:opacity-50"
              >
                🔠 VIẾT HOA HẾT
              </button>

              <button
                onClick={toLowercase}
                disabled={!text}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-bold text-xs cursor-pointer disabled:opacity-50"
              >
                🔡 viết thường hết
              </button>

              <button
                onClick={toTitleCase}
                disabled={!text}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-bold text-xs cursor-pointer disabled:opacity-50"
              >
                🔤 Viết Hoa Đầu Mỗi Từ
              </button>

              <button
                onClick={toSentenceCase}
                disabled={!text}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-bold text-xs cursor-pointer disabled:opacity-50"
              >
                ✍️ Viết hoa đầu câu
              </button>

              <button
                onClick={toAlternatingCase}
                disabled={!text}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-950 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all font-bold text-xs cursor-pointer disabled:opacity-50"
              >
                🤪 aLtErNaTiNg CaSe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
